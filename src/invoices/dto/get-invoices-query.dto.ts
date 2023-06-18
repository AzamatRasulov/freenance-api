import { ApiProperty } from '@nestjs/swagger'
import { InvoiceStatus } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'
import { QueryFilterDto } from 'src/core/dto/query-filter.dto'

export class GetInvoicesQueryDto extends QueryFilterDto {
  @IsString()
  @IsOptional()
  public client?: string

  @ApiProperty({ enum: InvoiceStatus })
  @IsString()
  @IsOptional()
  public status?: InvoiceStatus
}
