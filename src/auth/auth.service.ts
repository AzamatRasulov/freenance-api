import {
  ConflictException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'
import to from 'await-to-js'
import { DbService } from 'src/db/db.service'
import { AccountValidationDto } from './dto/account-validation.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { SignInResponse } from './types/sign-in.response'

@Injectable()
export class AuthService {
  constructor(
    private readonly _db: DbService,
    private readonly _jwt: JwtService,
    private readonly _config: ConfigService
  ) {}

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

  public async signIn({ email, password }: SignInDto): Promise<SignInResponse> {
    const user = await this._db.user.findUnique({ where: { email } })

    if (!user || !(await argon.verify(user.password, password))) {
      throw new ForbiddenException('Incorrect credentials')
    }

    return {
      accessToken: await this._generateAccessToken(user.id, user.email)
    }
  }

  private async _generateAccessToken(
    userId: number,
    email: string
  ): Promise<string> {
    return this._jwt.signAsync(
      { sub: userId, email },
      { expiresIn: '10m', secret: this._config.get('JWT_SECRET') }
    )
  }
}
