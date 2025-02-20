import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateQrDto } from './dto/qrcode.dto';
import { QRCode } from './schema/qrcode.schema';
import { Express } from 'express';
import { MulterService } from 'src/file-upload/file.service';
import * as QRCodeReader from 'qrcode-reader';
import { createCanvas, loadImage } from 'canvas';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrService: QrcodeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('qrPic', new MulterService().getOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload QR code image and save the extracted data',
    type: CreateQrDto,
  })
  @ApiOperation({ summary: 'Upload and extract QR code data' })
  async create(
    @Body() qrDto: CreateQrDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<QRCode> {
    if (file) {
      try {
        const qrData = await this.extractQrData(file.path);
        qrDto.qrData = qrData;
      } catch (error) {
        console.error('QR Code extraction error:', error);
        throw new Error('QR code extraction failed. Please upload a valid QR code image.');
      }
    }

    return this.qrService.create(qrDto);
  }

  private async extractQrData(filePath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Loading image:', filePath);
  
        const img = await loadImage(filePath);
        const canvas = createCanvas(img.width * 2, img.height * 2); // Scale up
        const ctx = canvas.getContext('2d');
  
        // Resize for better QR recognition
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
  
        for (let i = 0; i < pixels.length; i += 4) {
          let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          avg = avg > 128 ? 255 : 0;  
          pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
  
        const qr = new QRCodeReader();
        qr.callback = (err, value) => {
          if (err) {
            console.error('QR decode error:', err);
            reject('Failed to decode QR code');
            return;
          }
          if (!value || !value.result) {
            reject('No QR code found in image');
            return;
          }
          resolve(value.result);
        };
  
        qr.decode(ctx.getImageData(0, 0, canvas.width, canvas.height));
      } catch (error) {
        console.error('Image processing error:', error);
        reject(`Error processing image: ${error.message}`);
      }
    });
  }
}  