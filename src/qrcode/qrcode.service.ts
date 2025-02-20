import { Injectable } from '@nestjs/common';
import { QRCode } from './schema/qrcode.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQrDto } from './dto/qrcode.dto';

@Injectable()
export class QrcodeService {
  constructor(@InjectModel(QRCode.name) private readonly qrModel: Model<QRCode>) {}

  async create(uploadqrcode: CreateQrDto): Promise<QRCode> {
    const { qrData } = uploadqrcode; 
    const qrCode = new this.qrModel({ qrData });
    return await qrCode.save(); 
  }
}
