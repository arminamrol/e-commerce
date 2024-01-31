import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(body: LoginDto) {
    const checkPassword = (user) => {
      if (body.password !== user.password) {
        throw new NotFoundException('password is wrong');
      }
    };
    let user;

    if (body.email) {
      user = await this.usersService.findOneByEmail(body.email);
    } else if (body.userName) {
      user = await this.usersService.findOneByUserName(body.userName);
    } else if (body.phone) {
      user = await this.usersService.findOneByPhone(parseInt(body.phone));
    }
    if (!user) {
      throw new NotFoundException('user not found');
    }
    checkPassword(user);

    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
