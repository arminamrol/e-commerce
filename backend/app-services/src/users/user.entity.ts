import { Exclude } from 'class-transformer';
import { Product } from 'src/products/product.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  userName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: '' })
  address: string;

  @Column({ nullable: true })
  phone: number;

  @ManyToMany(() => Role, (role) => role.name, { cascade: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Product, (product) => product.title)
  @JoinColumn()
  products: Product[];

  // @Column()
  // wishlist: string;
  // orders;
  // payments;
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}
