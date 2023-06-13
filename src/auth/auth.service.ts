import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'
import to from 'await-to-js'
import { DbService } from 'src/db/db.service'
import { AccountValidationDto } from './dto/account-validation.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(private readonly _db: DbService) {}

  public async signUp({ email, password }: SignUpDto): Promise<number> {
    const [error, user] = await to(
      this._db.user.create({
        data: { email, password: await argon.hash(password) }
      })
    )

    if (!error) return user.id

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        "There's an account registered with this email already"
      )
    }
  }

  public async validateAccountExistence({
    email
  }: AccountValidationDto): Promise<void> {
    const user = await this._db.user.findUnique({ where: { email } })

    if (!user) return

    throw new ConflictException(
      "There's an account registered with this email already"
    )
  }
}
