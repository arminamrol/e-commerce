import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
  password: string;

  @Column({ default: '' })
  address: string;

  @Column({ nullable: true })
  phone: number;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

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
