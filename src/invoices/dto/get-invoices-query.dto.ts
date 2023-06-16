import { ApiProperty } from '@nestjs/swagger'
import { InvoiceStatus } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class GetInvoicesQueryDto {
  @IsString()
  @IsOptional()
  public client: string

  @ApiProperty({ enum: InvoiceStatus })
  @IsString()
  @IsOptional()
  public status: InvoiceStatus
}
