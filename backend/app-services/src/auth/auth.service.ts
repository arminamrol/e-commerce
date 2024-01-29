import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(body: LoginDto) {
    const checkPassword = (user) => {
      if (body.password !== user.password) {
        throw new NotFoundException('password is wrong');
      }
    };
    if (body.email) {
      const user = await this.usersService.findOneByEmail(body.email);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      checkPassword(user);
      return user;
    }
    if (body.userName) {
      const user = await this.usersService.findOneByUserName(body.userName);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      checkPassword(user);

      return user;
    }
    if (body.phone) {
      const user = await this.usersService.findOneByPhone(parseInt(body.phone));
      if (!user) {
        throw new NotFoundException('user not found');
      }
      checkPassword(user);

      return user;
    }
  }
}
