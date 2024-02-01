import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class AllUserDto {
  @Expose()
  count: number;

  @Expose()
  @Type(() => UserDto) // Specify the type of each element in the array
  users: UserDto[];
}
