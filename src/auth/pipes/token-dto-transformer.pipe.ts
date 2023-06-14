import { Injectable, PipeTransform, ValidationPipe } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { SignInDto } from '../dto/sign-in.dto'

@Injectable()
export class TokenDtoTransformerPipe implements PipeTransform {
  public async transform(
    dto: SignInDto | RefreshTokenDto
  ): Promise<SignInDto | RefreshTokenDto> {
    let transformed: SignInDto | RefreshTokenDto

    if ('refreshToken' in dto) {
      transformed = plainToInstance(RefreshTokenDto, dto)
    } else {
      transformed = plainToInstance(SignInDto, dto)
    }

    const validation = await validate(transformed)

    if (validation.length > 0) {
      const validationPipe = new ValidationPipe()
      const exceptionFactory = validationPipe.createExceptionFactory()

      throw exceptionFactory(validation)
    }

    return transformed
  }
}
