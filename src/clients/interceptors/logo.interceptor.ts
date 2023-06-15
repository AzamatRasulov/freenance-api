import { FileInterceptor } from '@nestjs/platform-express'
import { mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { join } from 'path'

export function LogoInterceptor(): ReturnType<typeof FileInterceptor> {
  return FileInterceptor('logo', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const path = join(
          process.env['STATIC_FOLDER'],
          process.env['LOGOS_FOLDER']
        )

        mkdirSync(path, { recursive: true })
        return callback(null, path)
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname)
      }
    })
  })
}
