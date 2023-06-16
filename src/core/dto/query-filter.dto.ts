import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class QueryFilterDto {
  @IsNumber()
  @IsOptional()
  @Transform(limit => +limit.value || undefined)
  public limit?: number
}
