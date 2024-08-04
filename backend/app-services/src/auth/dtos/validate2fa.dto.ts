import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  access_token: string;
}
