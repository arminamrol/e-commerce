import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  role_id: number;
}
