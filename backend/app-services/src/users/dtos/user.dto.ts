import { Expose, Type } from 'class-transformer';
import { Role } from '../role.entity';
import { RoleDto } from './role.dto';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  userName: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  address: string;

  @Expose()
  @Type(() => RoleDto)
  roles: Role[];
}
