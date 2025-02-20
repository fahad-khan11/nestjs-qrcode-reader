import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class QRCode extends Document {
  @ApiProperty({ example: 'Some extracted QR code data', description: 'Extracted QR code string' })
  @Prop()
  qrData: string; // Changed from qrPic to qrData
}

export const QRCodeSchema = SchemaFactory.createForClass(QRCode);
