import { FileInterceptor } from '@nestjs/platform-express'
import { mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { JwtPayload } from 'src/auth/types/jwt-payload'

export function AvatarInterceptor(): ReturnType<typeof FileInterceptor> {
  return FileInterceptor('avatar', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const path = `${process.env['STATIC_FOLDER']}/${process.env['AVATARS_FOLDER']}`

        mkdirSync(path, { recursive: true })
        return callback(null, path)
      },
      filename: (req, file, callback) => {
        callback(
          null,
          `${(req.user as JwtPayload).sub}${extname(file.originalname)}`
        )
      }
    })
  })
}
