import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { BearerDecoded } from 'src/auth/decorators/bearer-decoded.decorator'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { ProfileDto } from 'src/core/dto/profile.dto'
import { AvatarInterceptor } from './interceptors/avatar.interceptor'
import { SettingsService } from './settings.service'

@ApiTags('Settings')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class SettingsController {
  constructor(private readonly _service: SettingsService) {}

  @ApiConsumes('multipart/form-data')
  @Patch('settings')
  @UseInterceptors(AvatarInterceptor())
  public async update(
    @BearerDecoded() jwtPayload: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })]
      })
    )
    avatar: Express.Multer.File,
    @Body() dto: ProfileDto
  ): Promise<void> {
    return this._service.update(jwtPayload.sub, {
      ...dto,
      avatar: avatar.filename
    })
  }
}
