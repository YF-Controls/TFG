// System
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// Ohter modules
import { DeviceArea } from "@device-areas/entities";
import { DeviceType } from "@device-types/entities";


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

  @Column('text', {default : 'No comment'})
  description:  string;
  
  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;
  
  
  // Relación con DeviceType
  @ManyToOne(
    () => DeviceType,
    deviceType => deviceType.devices,
    { 
      nullable: false,
      eager: true
    }
  )
  @JoinColumn({ name: 'device_type_id' })
  deviceType: DeviceType;

  // Relación con DeviceArea
  @ManyToOne(
    () => DeviceArea, 
    deviceArea => deviceArea.devices,
    { 
      nullable: false,
      eager: true
    }
  )
  @JoinColumn({ name: 'device_area_id' })
  deviceArea: DeviceArea;
  
  @BeforeInsert()
  checkNameBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkNameBeforeUpdate() {
    this.checkNameBeforeInsert();
  }

}
