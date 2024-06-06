import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ValidateDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
