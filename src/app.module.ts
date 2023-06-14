import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DbModule } from './db/db.module'

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), DbModule]
})
export class AppModule {}
