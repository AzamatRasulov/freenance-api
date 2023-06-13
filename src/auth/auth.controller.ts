import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccountValidationDto } from './dto/account-validation.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { SignInResponse } from './types/sign-in.response'

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto): Promise<number> {
    return this._service.signUp(dto)
  }

  @HttpCode(200)
  @Post('sign-up/validate')
  public async validate(@Body() dto: AccountValidationDto): Promise<void> {
    return this._service.validateAccountExistence(dto)
  }

  @Get('sign-in')
  public async signIn(@Query() dto: SignInDto): Promise<SignInResponse> {
    return this._service.signIn(dto)
  }
}
