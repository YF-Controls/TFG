import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MyValidRoles } from "../interfaces";

@Entity('users') // Name of this table in database
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name : 'email', unique: true })
  email: string;

  @Column('text', { name: 'full_name', unique: true })
  fullname: string;
  
  @Column('text', { name: 'password', select: false })
  password?: string;
  
  @Column('boolean', { name: 'is_active', default: false })
  isActive: boolean;
  
  @Column('text', { name: 'roles', array: true, default: [MyValidRoles.user] })
  roles: string[];
  
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();   
  }
}
