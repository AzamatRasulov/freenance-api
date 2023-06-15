import { ForbiddenException, Injectable } from '@nestjs/common'
import { Client } from '@prisma/client'
import { DbService } from 'src/db/db.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(private readonly _db: DbService) {}

  public async create(userId: number, dto: CreateClientDto): Promise<Client> {
    return this._db.client.create({
      data: {
        ...dto,
        address: { create: dto.address },
        user: { connect: { id: userId } }
      }
    })
  }

  public async findAll(userId: number): Promise<Client[]> {
    return this._db.client.findMany({
      where: { user: { id: userId } },
      include: { address: true }
    })
  }

  public async findOne(id: number): Promise<Client> {
    return this._db.client.findUniqueOrThrow({
      where: { id },
      include: { address: true }
    })
  }

  public async update(
    userId: number,
    id: number,
    dto: UpdateClientDto
  ): Promise<Client> {
    const client = await this._db.client.findUniqueOrThrow({ where: { id } })

    if (client.userId !== userId) throw new ForbiddenException()

    return this._db.client.update({
      where: { id },
      data: { ...dto, address: { update: dto.address } },
      include: { address: true }
    })
  }

  public async delete(userId: number, id: number): Promise<Client> {
    const client = await this._db.client.findUnique({ where: { id } })

    if (!client) return
    if (client.userId !== userId) throw new ForbiddenException()

    return this._db.client.delete({ where: { id }, include: { address: true } })
  }
}
