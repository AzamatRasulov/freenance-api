import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { ProfileDto } from 'src/core/dto/profile.dto'
import { DbService } from 'src/db/db.service'

@Injectable()
export class ProfileService {
  constructor(private readonly _db: DbService) {}

  public async get(
    id: number
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this._db.user.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        name: true,
        avatar: true,
        address: {
          select: { street: true, city: true, postCode: true, country: true }
        }
      }
    })

    if (!user.avatar) return user

    return {
      ...user,
      avatar: `/${process.env['AVATARS_FOLDER']}/${user.avatar as string}`
    }
  }

  public async update(
    id: number,
    { address, ...dto }: ProfileDto
  ): Promise<void> {
    await this._db.user.update({
      where: { id },
      data: {
        ...dto,
        address: { upsert: { create: address, update: address } }
      }
    })
  }
}
