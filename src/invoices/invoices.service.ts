import { ForbiddenException, Injectable } from '@nestjs/common'
import { Invoice, Prisma } from '@prisma/client'
import { DbService } from 'src/db/db.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { InvoiceItem } from './dto/invoice.item.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'

@Injectable()
export class InvoicesService {
  constructor(private readonly _db: DbService) {}

  public async create(
    userId: number,
    dto: CreateInvoiceDto
  ): Promise<Partial<Invoice>> {
    return this._db.invoice.create({
      data: {
        ...dto,
        code: this._generateCode(dto.to.name),
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
  }

  public async findAll(userId: number): Promise<Invoice[]> {
    return this._db.invoice.findMany({
      where: { user: { id: userId } },
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
    const invoice = await this._db.invoice.findUniqueOrThrow({
      where: { id },
      include: { terms: true }
    })

    if (invoice.userId !== userId) throw new ForbiddenException()

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
  }

  public async delete(userId: number, id: number): Promise<void> {
    const invoice = await this._db.invoice.findUnique({ where: { id } })

    if (!invoice) return
    if (invoice.userId !== userId) throw new ForbiddenException()

    await this._db.invoice.delete({ where: { id } })
  }

  private _generateCode(client: string): string {
    const firstLetter = client.slice(0, 1)
    const middleLetterIndex = Math.floor(client.length / 2)
    const middleLetter = client
      .slice(middleLetterIndex, middleLetterIndex + 1)
      .toUpperCase()
    const date = new Date().toISOString().split('T').at(0).replace(/-/gi, '')

    return firstLetter + middleLetter + date
  }

  private _calculateAmountDue(items: InvoiceItem[]): number {
    return items.reduce((amountDue, current) => amountDue + current.price, 0)
  }
}
