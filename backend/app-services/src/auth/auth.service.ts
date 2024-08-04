import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
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
    if (user.enable2FA) {
      const twoFaPayload = {
        email: user.email,
        sub: user.id,
        is2faToken: true,
      };
      return {
        message: '2FA required',
        access_token: this.jwtService.sign(twoFaPayload, {
          expiresIn: '2m',
        }),
      };
    }
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
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

      return 'user created successfully with id: ' + user.id;
    }
  }

  async enable2FA(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.enable2FA === true) {
      return '2FA already enabled';
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });

      await this.usersService.enable2FA(user.id, secret.base32);
      return { secret: secret.base32 };
    }
  }

  async disable2FA(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.enable2FA === false) {
      return '2FA already disabled';
    } else {
      await this.usersService.disable2FA(user.id);
      return '2FA disabled successfully';
    }
  }

  async validate2FA(access_token: string, token: string) {
    const decoded = this.jwtService.verify(access_token);

    if (decoded.is2faToken !== true) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.usersService.findOneById(decoded.sub);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const secret = user.twoFASecret;
    if (!secret) {
      throw new BadRequestException('2FA not enabled');
    }
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA token');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
