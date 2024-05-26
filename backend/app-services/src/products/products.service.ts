import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findAllProducts() {
    const products = await this.productRepo.find({ relations: ['user'] });
    return products;
  }
  async create(body: CreateProductDto, user: User) {
    const product = await this.productRepo.save(
      this.productRepo.create({ ...body, user }),
    );
    return product;
  }
}
