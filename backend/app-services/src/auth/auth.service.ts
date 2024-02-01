import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/hashingWithSalt.util';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async findUser(body: LoginDto) {
    let user;

    if (body.email) {
      user = await this.usersService.findOneByEmail(body.email);
    } else if (body.userName) {
      user = await this.usersService.findOneByUserName(body.userName);
    } else if (body.phone) {
      user = await this.usersService.findOneByPhone(parseInt(body.phone));
    }

    return user;
  }

  async login(body: LoginDto) {
    const user = await this.findUser(body);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isPasswordValid = await comparePassword(user.password, body.password);
    if (!isPasswordValid) {
      throw new BadRequestException('password is wrong');
    }
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(body: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    if (!user) {
      const hashedPassword = await hashPassword(body.password);
      const user = await this.usersService.create(body.email, hashedPassword);
      return user;
    }
  }
}
