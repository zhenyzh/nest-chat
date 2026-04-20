import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files-attach')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {recursive: true});
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer);
    const isImage = file.mimetype.startsWith('image/');

    return {
      id: crypto.randomUUID(),
      url: `uploads/${fileName}`,
      name: file.originalname,
      size: file.size,
      type: isImage ? 'image' : 'file',
    };
  }
}
