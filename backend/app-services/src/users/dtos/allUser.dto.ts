import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class AllUserDto {
  @Expose()
  count: number;

  @Expose()
  @Type(() => UserDto)
  users: UserDto[];
}
