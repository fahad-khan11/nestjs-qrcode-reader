import { Module } from '@nestjs/common';
import { QRCode, QRCodeSchema } from './schema/qrcode.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterService } from 'src/file-upload/file.service';
import { QrcodeService } from './qrcode.service';
import { QrcodeController } from './qrcode.controller';

@Module({
    imports:[
       MongooseModule.forFeature([
        {name :QRCode.name  , schema : QRCodeSchema}
       ]),
    ],
  providers: [QrcodeService,MulterService],
  controllers:[QrcodeController]
})
export class QrcodeModule {}
