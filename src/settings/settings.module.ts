import { Module } from '@nestjs/common'
import { ProfileModule } from 'src/profile/profile.module'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
  imports: [ProfileModule],
  providers: [SettingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
