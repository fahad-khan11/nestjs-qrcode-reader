import { ApiProperty } from '@nestjs/swagger';

export class CreateQrDto {
  @ApiProperty({ type: 'string', required: false, description: 'Extracted QR code data' })
  qrData?: string; 
}
