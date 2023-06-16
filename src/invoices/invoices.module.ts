import { Module } from '@nestjs/common'
import { ClientsModule } from 'src/clients/clients.module'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'

@Module({
  imports: [ClientsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
