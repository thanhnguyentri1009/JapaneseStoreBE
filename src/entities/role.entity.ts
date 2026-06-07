import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @OneToMany(() => Account, (account) => account.role)
  accounts: Account[];
}
