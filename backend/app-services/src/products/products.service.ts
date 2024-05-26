import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  //create product
  async create(body: CreateProductDto, user: User) {
    const product = await this.productRepo.save(
      this.productRepo.create({ ...body, user }),
    );
    return product;
  }

  //findAllProducts
  async findAllProducts(
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.user', 'user');

    return paginate<Product>(queryBuilder, options);
  }

  //findClientProducts
  async getUserProducts(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    queryBuilder.where('product.userId = :userId', { userId });
    const products = await paginate<Product>(queryBuilder, options);

    return products;
  }
}
