import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'
import { Client, Invoice, InvoiceStatus, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import to from 'await-to-js'
import { ClientsService } from 'src/clients/clients.service'
import { CreateClientDto } from 'src/clients/dto/create-client.dto'
import { DbService } from 'src/db/db.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto'
import { InvoiceItem } from './dto/invoice.item.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'

@Injectable()
export class InvoicesService {
  constructor(
    private readonly _db: DbService,
    private readonly _clients: ClientsService
  ) {}

  public async create(
    userId: number,
    dto: CreateInvoiceDto
  ): Promise<Partial<Invoice>> {
    const invoice = await this._db.invoice.create({
      data: {
        ...dto,
        code: this._generateCode(dto.to.name),
        status: InvoiceStatus.Draft,
        from: { create: { address: { create: dto.from.address } } },
        to: { create: { ...dto.to, address: { create: dto.to.address } } },
        terms: {
          create: {
            ...dto.terms,
            items: { set: dto.terms.items as unknown as Prisma.JsonArray },
            amountDue: this._calculateAmountDue(dto.terms.items)
          }
        },
        user: { connect: { id: userId } }
      },
      select: { id: true }
    })

    await this._upsertClient(userId, dto.to, invoice.id)

    return invoice
  }

  public async findAll(
    userId: number,
    { status, client }: GetInvoicesQueryDto
  ): Promise<Invoice[]> {
    return this._db.invoice.findMany({
      where: { user: { id: userId }, status: status, to: { name: client } },
      include: {
        from: { include: { address: true } },
        to: { include: { address: true } },
        terms: true
      }
    })
  }

  public async findOne(id: number): Promise<Invoice> {
    return this._db.invoice.findUniqueOrThrow({
      where: { id },
      include: {
        from: { include: { address: true } },
        to: { include: { address: true } },
        terms: true
      }
    })
  }

  public async update(
    userId: number,
    id: number,
    dto: UpdateInvoiceDto
  ): Promise<void> {
    const [error, invoice] = await to<Invoice, PrismaClientKnownRequestError>(
      this._db.invoice.findUniqueOrThrow({
        where: { id },
        include: { terms: true }
      })
    )

    if (error?.code === 'P2025') {
      throw new NotFoundException('Invoice not found')
    }

    if (invoice.userId !== userId) throw new ForbiddenException()

    if (invoice.status === 'Paid') {
      throw new ForbiddenException('Cannot edit paid invoice')
    }

    await this._db.invoice.update({
      where: { id },
      data: {
        from: { update: { address: { update: dto.from.address } } },
        to: { update: { ...dto.to, address: { update: dto.to.address } } },
        terms: {
          update: {
            ...dto.terms,
            items: { set: dto.terms.items as unknown as Prisma.JsonArray },
            amountDue: this._calculateAmountDue(dto.terms.items)
          }
        }
      }
    })

    await this._upsertClient(userId, dto.to, invoice.id)
  }

  public async delete(userId: number, id: number): Promise<void> {
    const invoice = await this._db.invoice.findUnique({ where: { id } })

    if (!invoice) return
    if (invoice.userId !== userId) throw new ForbiddenException()

    await this._db.invoice.delete({ where: { id } })
  }

  public async send(userId: number, id: number): Promise<void> {
    const invoice = await this._db.invoice.findUnique({ where: { id } })

    if (!invoice) throw new NotFoundException()
    if (invoice.userId !== userId) throw new ForbiddenException()
    if (invoice.status !== 'Draft') {
      throw new UnprocessableEntityException('Invoice already sent')
    }

    await this._db.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.Pending }
    })
  }

  public async complete(userId: number, id: number): Promise<void> {
    const invoice = await this._db.invoice.findUnique({
      where: { id },
      include: { to: true, terms: true }
    })

    if (!invoice) throw new NotFoundException()
    if (invoice.userId !== userId) throw new ForbiddenException()

    if (invoice.status === 'Draft') {
      throw new UnprocessableEntityException('Invoice cannot be completed yet')
    }

    if (invoice.status === 'Paid') {
      throw new UnprocessableEntityException('Invoice is already paid')
    }

    await this._db.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.Paid }
    })

    await this._clients.addToTurnover(invoice.to.name, invoice.terms.amountDue)
  }

  private async _upsertClient(
    userId: number,
    dto: Omit<CreateClientDto, 'logo'>,
    invoiceId: number
  ): Promise<void> {
    let [, client]: [void, Partial<Client>] = await to(
      this._clients.findOne('name', dto.name)
    )

    if (!client) client = await this._clients.create(userId, null, dto)

    await this._clients.update(userId, client.id, undefined, {
      lastInvoiceId: invoiceId
    })
  }

  private _generateCode(client: string): string {
    const firstLetter = client.slice(0, 1)
    const middleLetterIndex = Math.floor(client.length / 2)
    const middleLetter = client
      .slice(middleLetterIndex, middleLetterIndex + 1)
      .toUpperCase()
    const dateParts = new Date().toISOString().split('T')
    const date =
      dateParts.at(0).replace(/-/gi, '').slice(4) +
      dateParts.at(1).split('.').at(1).replace('Z', '')

    return firstLetter + middleLetter + date
  }

  private _calculateAmountDue(items: InvoiceItem[]): number {
    return items.reduce((amountDue, current) => amountDue + current.price, 0)
  }
}
