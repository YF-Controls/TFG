import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ValidRoles } from "../interfaces";

@Entity('users') // Name of this table in database
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  fullname: string;
  
  @Column('text', { select: false })
  password: string;
  
  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: [ValidRoles.user] })
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
