import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import { LoginDto } from './dtos/login.dto';

const scrypt = promisify(_scrypt);

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

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return result;
  }
  private async comparePassword(
    storedPassword: string,
    suppliedPassword: string,
  ) {
    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await scrypt(suppliedPassword, salt, 64)) as Buffer;
    return storedHash === hash.toString('hex');
  }
  async login(body: LoginDto) {
    const user = await this.findUser(body);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isPasswordValid = await this.comparePassword(
      user.password,
      body.password,
    );
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
      const hashedPassword = await this.hashPassword(body.password);
      const user = await this.usersService.create(body.email, hashedPassword);
      return user;
    }
  }
}
