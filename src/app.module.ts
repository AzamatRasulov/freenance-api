import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DbModule } from './db/db.module'
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), DbModule, ProfileModule]
})
export class AppModule {}
