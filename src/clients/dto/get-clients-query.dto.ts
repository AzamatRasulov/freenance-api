import { IsOptional, IsString } from 'class-validator'
import { QueryFilterDto } from 'src/core/dto/query-filter.dto'

export class GetClientsQueryDto extends QueryFilterDto {
  @IsString()
  @IsOptional()
  public country?: string
}
