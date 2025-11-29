// System
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// Other modules
import { DeviceArea } from "@device-areas/entities";
import { DeviceType } from "@device-types/entities";


@Entity('devices') // Name of this table in database
export class Device {

  // ##################################
  // Properties
  // ##################################
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', unique : false, nullable: false})
  name: string;
  
  @Column('numeric', { name: 'number', unique: true, nullable: true})
  number: number;

  @Column('char', { name: 'hw_id', length: 14, unique: true, nullable: true})
  hwId: string;

  @Column('text', { name: 'description', default : 'No comment'})
  description:  string;
  
  @Column('boolean', { name: 'is_active', default: true, nullable: false })
  isActive: boolean;
    
  // Relation with DeviceType
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

  @Column({ name: 'device_type_id' })
  deviceTypeId: string;

  // Relation with DeviceArea
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

  @Column({ name: 'device_area_id' })
  deviceAreaId: string;W
  
  // ##################################
  // Methods
  // ##################################
  @BeforeInsert()
  @BeforeUpdate()
  checkBeforeTo() {
    this.name = this.name.toLowerCase().trim();
  }
  
}
