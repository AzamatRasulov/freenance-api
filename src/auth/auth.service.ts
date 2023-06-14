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
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { JwtPayload } from './types/jwt-payload'
import { SignInResponse } from './types/sign-in.response'

@Injectable()
export class AuthService {
  constructor(
    private readonly _db: DbService,
    private readonly _jwt: JwtService,
    private readonly _config: ConfigService
  ) {}

  public async validateAccountExistence({
    email
  }: AccountValidationDto): Promise<void> {
    const user = await this._db.user.findUnique({ where: { email } })

    if (!user) return

    throw new ConflictException(
      "There's an account registered with this email already"
    )
  }

  public async signUp({ password, ...dto }: SignUpDto): Promise<number> {
    const [error, user] = await to(
      this._db.user.create({
        data: { ...dto, password: await argon.hash(password) }
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

  public async signIn(
    { email, password }: SignInDto,
    securityKey: 'password' | 'refreshToken' = 'password'
  ): Promise<SignInResponse> {
    const user = await this._db.user.findUnique({ where: { email } })

    if (!user || !(await argon.verify(user[securityKey] as string, password))) {
      throw new ForbiddenException('Incorrect credentials')
    }

    const tokens = await this._generateTokens(user.id, user.email)

    await this._storeRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  public async refreshToken({
    refreshToken
  }: RefreshTokenDto): Promise<SignInResponse> {
    const [error, payload] = await to<JwtPayload>(
      this._jwt.verifyAsync(refreshToken, {
        secret: this._config.get('JWT_REFRESH_SECRET')
      })
    )

    if (error) throw new ForbiddenException('Invalid token')

    return this.signIn(
      { email: payload.email, password: refreshToken },
      'refreshToken'
    )
  }

  public decodeToken(token: string): JwtPayload {
    return this._jwt.decode(token) as JwtPayload
  }

  private async _generateTokens(
    userId: number,
    email: string
  ): Promise<SignInResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this._jwt.signAsync(
        { sub: userId, email },
        { expiresIn: '1w', secret: this._config.get('JWT_ACCESS_SECRET') }
      ),
      this._jwt.signAsync(
        { sub: userId, email },
        { expiresIn: '1w', secret: this._config.get('JWT_REFRESH_SECRET') }
      )
    ])

    return { accessToken, refreshToken }
  }

  private async _storeRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await this._db.user.update({
      where: { id: userId },
      data: { refreshToken: await argon.hash(refreshToken) }
    })
  }
}
