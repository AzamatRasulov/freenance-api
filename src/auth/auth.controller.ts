import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccountValidationDto } from './dto/account-validation.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('sign-up')
  public signUp(@Body() dto: SignUpDto): unknown {
    return this._service.signUp(dto)
  }

  @HttpCode(200)
  @Post('sign-up/validate')
  public validate(@Body() dto: AccountValidationDto): unknown {
    return this._service.validateAccountExistence(dto)
  }
}
