import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AccountValidationDto } from './dto/account-validation.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { TokenDtoTransformerPipe } from './pipes/token-dto-transformer.pipe'
import { SignInResponse } from './types/sign-in.response'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto): Promise<number> {
    return this._service.signUp(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up/validate')
  public async validate(@Body() dto: AccountValidationDto): Promise<void> {
    return this._service.validateAccountExistence(dto)
  }

  @Get('token')
  public async signIn(
    @Query(TokenDtoTransformerPipe)
    dto: SignInDto | RefreshTokenDto
  ): Promise<SignInResponse> {
    if (dto instanceof RefreshTokenDto) return this._service.refreshToken(dto)
    return this._service.signIn(dto)
  }
}
