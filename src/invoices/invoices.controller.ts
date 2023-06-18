import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Invoice } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import to from 'await-to-js'
import { BearerDecoded } from 'src/auth/decorators/bearer-decoded.decorator'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { PostResponseDto } from 'src/core/dto/post.response.dto'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { GetInvoiceDto } from './dto/get-invoice.dto'
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'
import { InvoicesService } from './invoices.service'

@ApiTags('Invoices')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly _service: InvoicesService) {}

  @Post()
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: PostResponseDto })
  public async create(
    @BearerDecoded() user: JwtPayload,
    @Body() dto: CreateInvoiceDto
  ): Promise<Partial<Invoice>> {
    return this._service.create(user.sub, dto)
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetInvoiceDto,
    isArray: true
  })
  public async findAll(
    @BearerDecoded() user: JwtPayload,
    @Query() query: GetInvoicesQueryDto
  ): Promise<Invoice[]> {
    return this._service.findAll(user.sub, query)
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GetInvoiceDto })
  public async findOne(@Param('id') id: number): Promise<Invoice> {
    const [error, client] = await to<Invoice, PrismaClientKnownRequestError>(
      this._service.findOne(+id)
    )

    if (error?.code === 'P2025') {
      throw new NotFoundException('Invoice not found')
    }

    return client
  }

  @Patch(':id')
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id') id: number,
    @BearerDecoded() user: JwtPayload,
    @Body() dto: UpdateInvoiceDto
  ): Promise<void> {
    return this._service.update(user.sub, +id, dto)
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number
  ): Promise<void> {
    return this._service.delete(user.sub, +id)
  }

  @Post(':id/send')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async send(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number
  ): Promise<void> {
    return this._service.send(user.sub, +id)
  }

  @Post(':id/complete')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async complete(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number
  ): Promise<void> {
    return this._service.complete(user.sub, +id)
  }
}
