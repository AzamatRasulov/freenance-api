import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { DbService } from 'src/db/db.service'

@Injectable()
export class ProfileService {
  constructor(private readonly _db: DbService) {}

  public async get(
    id: number
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...user } = await this._db.user.findUnique({
      where: { id }
    })

    return user
  }
}
