import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly _config: ConfigService) {
    super({ datasources: { db: { url: _config.get('DATABASE_URL') } } })
  }

  public onModuleInit(): void {
    void this.$connect()
  }
  public onModuleDestroy(): void {
    void this.$disconnect()
  }
}
