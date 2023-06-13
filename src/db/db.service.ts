import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DbService extends PrismaClient {
  constructor(private readonly _config: ConfigService) {
    super({ datasources: { db: { url: _config.get('DATABASE_URL') } } })
  }
}
