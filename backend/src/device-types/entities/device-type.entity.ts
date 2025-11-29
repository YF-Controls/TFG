// System
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// Other modules
import { Device } from "@devices/entities";


@Entity('device_types') // Name of this table in database
export class DeviceType {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name : 'name', unique : true, nullable: false})
  name: string;
  
  @Column('char', {name: 'hw_id', length: 4, unique: true, nullable: true})
  hwId: string;

  @Column('text', {name: 'description', default : 'No comment'})
  description:  string;
  
  @Column('boolean', { name: 'is_active', default: true, nullable: false })
  isActive: boolean;
  
  // Relación con Device
  @OneToMany(
    () => Device,
    device => device.deviceType
  )
  devices: Device[];

  @BeforeInsert()
  checkBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
    this.hwId = this.hwId.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkBeforeUpdate() {
    this.checkBeforeInsert();
  }

}
