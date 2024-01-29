// login.dto.ts
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !(o.email || o.phone))
  @IsString()
  @IsDefined({ message: 'Please provide either username, email, or phone' })
  userName?: string;

  @ValidateIf((o) => !(o.username || o.phone))
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ValidateIf((o) => !(o.username || o.email))
  @IsPhoneNumber('IR', { message: 'Invalid phone number format' })
  phone?: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString()
  @MinLength(6)
  password: string;
}
