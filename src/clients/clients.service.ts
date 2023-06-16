import { ForbiddenException, Injectable } from '@nestjs/common'
import { Client } from '@prisma/client'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { DbService } from 'src/db/db.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(private readonly _db: DbService) {}

  public async create(
    userId: number,
    logo: string,
    dto: Omit<CreateClientDto, 'logo'>
  ): Promise<Partial<Client>> {
    const client = await this._db.client.create({
      data: {
        ...dto,
        logo,
        address: { create: dto.address },
        user: { connect: { id: userId } }
      },
      select: { id: true }
    })

    return client
  }

  public async findAll(userId: number): Promise<Client[]> {
    const clients = await this._db.client.findMany({
      where: { user: { id: userId } },
      include: { address: true }
    })

    return clients.map(client => this._buildLogoPath(client))
  }

  public async findOne(
    key: 'id' | 'name',
    value: string | number
  ): Promise<Client> {
    const client = await this._db.client.findUniqueOrThrow({
      where: { [key]: value },
      include: { address: true }
    })

    return this._buildLogoPath(client)
  }

  public async update(
    userId: number,
    id: number,
    logo: string,
    dto: Omit<UpdateClientDto, 'logo'>
  ): Promise<void> {
    const client = await this._db.client.findUniqueOrThrow({ where: { id } })

    if (client.userId !== userId) throw new ForbiddenException()
    if (logo && client.logo) this._deleteLogo(client.logo)

    await this._db.client.update({
      where: { id },
      data: { ...dto, logo, address: { update: dto.address } }
    })
  }

  public async delete(userId: number, id: number): Promise<void> {
    const client = await this._db.client.findUnique({ where: { id } })

    if (!client) return
    if (client.userId !== userId) throw new ForbiddenException()

    const deletedClient = await this._db.client.delete({
      where: { id },
      include: { address: true }
    })

    this._deleteLogo(deletedClient.logo)
  }

  public async addToTurnover(name: string, amount: number): Promise<void> {
    await this._db.client.update({
      where: { name },
      data: { turnover: { increment: amount } }
    })
  }

  private _buildLogoPath(client: Client): Client {
    if (!client.logo) return client
    return {
      ...client,
      logo: join('/', process.env['LOGOS_FOLDER'], client.logo)
    }
  }

  private _deleteLogo(filename: string): void {
    const path = join(
      process.env['STATIC_FOLDER'],
      process.env['LOGOS_FOLDER'],
      filename
    )

    if (existsSync(path)) unlinkSync(path)
  }
}
