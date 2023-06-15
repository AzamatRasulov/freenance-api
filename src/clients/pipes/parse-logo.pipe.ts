import { FileTypeValidator, ParseFilePipe } from '@nestjs/common'

export class ParseLogoPipe extends ParseFilePipe {
  constructor() {
    super({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' })] })
  }
}
