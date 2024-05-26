import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Request,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductsService } from './products.service';

@Controller({ path: 'products', scope: Scope.REQUEST })
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    @Inject(UsersService) private readonly userService: UsersService, // Inject UserService
  ) {}

  @Get()
  async getAllProducts() {
    const products = await this.productService.findAllProducts();
    return products;
  }

  @Post('product')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: CreateProductDto, @Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.productService.create(body, user);
  }
}
