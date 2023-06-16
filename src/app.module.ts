import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ClientsModule } from './clients/clients.module'
import { DbModule } from './db/db.module'
import { InvoicesModule } from './invoices/invoices.module'
import { ProfileModule } from './profile/profile.module'
import { SettingsModule } from './settings/settings.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    ProfileModule,
    SettingsModule,
    ClientsModule,
    InvoicesModule
  ]
})
export class AppModule {}
