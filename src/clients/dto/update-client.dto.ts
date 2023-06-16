import { ApiHideProperty, PartialType } from '@nestjs/swagger'
import { CreateClientDto } from './create-client.dto'

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiHideProperty()
  public lastInvoiceId?: number
}
