import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (payload.is2faToken) {
      throw new BadRequestException(
        '2FA token cannot be used for this request',
      );
    }
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
