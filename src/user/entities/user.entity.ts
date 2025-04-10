import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  // BeforeInsert,
} from 'typeorm';
// import { ulid } from 'ulid';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: true, unique: true })
  nickname: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  // @BeforeInsert()
  // generateId() {
  //   this.id = ulid();
  // }

  // @BeforeInsert()
  // hashPassword() {
  //   this.id = ulid();
  //   this.password = bcrypt.hash(this.password, 10);
  // }
}
