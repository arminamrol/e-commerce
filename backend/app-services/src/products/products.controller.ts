import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'products', scope: Scope.REQUEST })
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllProducts({
      page,
      limit,
    });
  }

  @Post('product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  async createProduct(@Body() body: CreateProductDto, @Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.productService.create(body, user);
  }

  @Get('user-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  async getUserProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Request() req,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    const userId = req.user.userId;
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const products = this.productService.getUserProducts(user.id, {
      page,
      limit,
    });

    return products;
  }
}
