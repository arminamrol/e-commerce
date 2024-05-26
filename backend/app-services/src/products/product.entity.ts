import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ default: 0, nullable: false })
  price: number;

  @Column({ nullable: false })
  count: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn()
  user: User;
}
