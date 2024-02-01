import { Expose } from 'class-transformer';

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
}
