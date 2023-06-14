import { Injectable } from '@nestjs/common'
import { ProfileDto } from 'src/core/dto/profile.dto'
import { ProfileService } from 'src/profile/profile.service'

@Injectable()
export class SettingsService {
  constructor(private readonly _profile: ProfileService) {}

  public async update(id: number, dto: ProfileDto): Promise<void> {
    return this._profile.update(id, dto)
  }
}
