import {
  Controller,
  ExecutionContext,
  Get,
  UseGuards,
  createParamDecorator
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Request } from 'express'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { ProfileService } from './profile.service'

export const BearerDecoded = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()
    return request.user
  }
)

@UseGuards(AuthGuard('jwt'))
@Controller()
export class ProfileController {
  constructor(private readonly _service: ProfileService) {}

  @Get('me')
  public async get(
    @BearerDecoded() jwtPayload: JwtPayload
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    return this._service.get(jwtPayload.sub)
  }
}
