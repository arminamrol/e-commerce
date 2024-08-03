import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { ValidateDto } from './dtos/validate2fa.dto';

export function RegisterSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Register a new user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBody({
      type: CreateUserDto,
      description: 'User data for registration',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 201,
      description: 'User successfully registered.',
      schema: {
        example: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function LoginSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Login a user' })(target, propertyKey, descriptor);
    ApiBody({
      type: LoginDto,
      description: 'User credentials for login',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully logged in.',
      schema: {
        example: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function Enable2FASwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Enable Two-Factor Authentication for a user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      description: 'Two-Factor Authentication enabled.',
      schema: {
        example: {
          secret: 'string',
          url: 'string',
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function Disable2FASwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Disable Two-Factor Authentication for a user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      description: 'Two-Factor Authentication disabled.',
    })(target, propertyKey, descriptor);
  };
}

export function Verify2FASwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Verify Two-Factor Authentication token' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBody({
      type: ValidateDto,
      description: '2FA verification token and user ID',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: '2FA token verification result.',
      schema: {
        example: {
          success: true,
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 400,
      description: 'Invalid 2FA token.',
    })(target, propertyKey, descriptor);
  };
}
