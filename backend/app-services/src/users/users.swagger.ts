import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { UpdateRoleDto } from 'src/users/dtos/updateRole.dto';

export function FindAllUsersSwagger() {
  return ApiOperation({ summary: 'Retrieve all users' }) as MethodDecorator;
}

export function FindUserByEmailSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Find user by email' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBody({
      type: String,
      description: 'Email of the user to be found',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Successfully found the user by email.',
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

export function FindUserByIdSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Find user by ID' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'id',
      description: 'ID of the user to be found',
      type: Number,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Successfully found the user by ID.',
      schema: {
        example: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
  };
}

export function DeleteUserSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Delete user by ID' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'id',
      description: 'ID of the user to be deleted',
      type: Number,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully deleted.',
      schema: {
        example: {
          success: true,
          message: 'User with ID 1 deleted',
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
  };
}

export function UpdateUserSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Update user by ID' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'id',
      description: 'ID of the user to be updated',
      type: Number,
    })(target, propertyKey, descriptor);
    ApiBody({
      type: UpdateUserDto,
      description: 'Data to update the user',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully updated.',
      schema: {
        example: {
          id: 1,
          name: 'John Doe Updated',
          email: 'john.doe.updated@example.com',
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
  };
}

export function UpdateRoleSwagger() {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiOperation({ summary: 'Update user role by ID' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'id',
      description: 'ID of the user whose role will be updated',
      type: Number,
    })(target, propertyKey, descriptor);
    ApiBody({
      type: UpdateRoleDto,
      description: 'Data to update the user role',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'User role successfully updated.',
      schema: {
        example: {
          id: 1,
          role_id: 2,
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 404,
      description: 'User not found.',
    })(target, propertyKey, descriptor);
  };
}
