import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 200 })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.accounts, { eager: true, nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;
}
