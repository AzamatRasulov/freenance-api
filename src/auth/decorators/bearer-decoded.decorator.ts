import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const BearerDecoded = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()
    return request.user
  }
)
