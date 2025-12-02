import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MyValidRoles } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users') // Name of this table in database
export class User {

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'UUID for the user',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'Email address of the user',
    uniqueItems: true,
  })
  @Column('text', { name : 'email', unique: true })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    uniqueItems: true,
  })
  @Column('text', { name: 'full_name', unique: true })
  fullname: string;
  
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password for the user account'
  })
  @Column('text', { name: 'password', select: false })
  password?: string;
  
  @ApiProperty({
    example: true,
    description: 'Indicates if the user is active',
    default: false
  })
  @Column('boolean', { name: 'is_active', default: false })
  isActive: boolean;
  
  @ApiProperty({
    example: [MyValidRoles.user, MyValidRoles.admin],
    description: 'Roles assigned to the user',
    default: [MyValidRoles.user]
  })
  @Column('text', { name: 'roles', array: true, default: [MyValidRoles.user] })
  roles: string[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFields() {
    this.email = this.email.toLowerCase().trim();
  }

}
