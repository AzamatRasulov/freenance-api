import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { BearerDecoded } from 'src/auth/decorators/bearer-decoded.decorator'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { ProfileDto } from 'src/core/dto/profile.dto'
import { ProfileService } from './profile.service'

@ApiTags('Profile')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class ProfileController {
  constructor(private readonly _service: ProfileService) {}

  @ApiResponse({ status: HttpStatus.OK, type: ProfileDto })
  @Get('me')
  public async get(
    @BearerDecoded() jwtPayload: JwtPayload
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    return this._service.get(jwtPayload.sub)
  }
}
