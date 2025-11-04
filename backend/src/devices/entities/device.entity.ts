import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('devices') // Name of this table in database
export class Device {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique : true, nullable: false})
  name: string;
  
  @Column('numeric', {unique: true, nullable: true})
  nr: number;

  @Column('text', {unique: true, nullable: true})
  hwId: string;

  //@Column('enum', { enum : DeviceTypes, default : DeviceTypes.lamp })
  //@IsEnum(DeviceTypes)
  //type: string;
  
  @Column('text', {default : 'No comment'})
  description:  string;
  
  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @BeforeInsert()
  checkNameBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkNameBeforeUpdate() {
    this.checkNameBeforeInsert();
  }

}
