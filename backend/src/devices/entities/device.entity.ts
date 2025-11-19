// System
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// Ohter modules
import { DeviceArea } from "@device-areas/entities";
import { DeviceType } from "@device-types/entities";


@Entity('devices') // Name of this table in database
export class Device {

  // ##################################
  // Properties
  // ##################################
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
    
  // Relation with DeviceType
  @ManyToOne(
    () => DeviceType,
    deviceType => deviceType.devices,
    { 
      nullable: false,
      eager: true
    }
  )
  @JoinColumn({ name: 'deviceTypeId' })
  deviceType: DeviceType;

  @Column({ name: 'deviceTypeId' })
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
  @JoinColumn({ name: 'deviceAreaId' })
  deviceArea: DeviceArea;

  @Column({ name: 'deviceAreaId' })
  deviceAreaId: string;
  
  // ##################################
  // Methods
  // ##################################
  @BeforeInsert()
  checkNameBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkNameBeforeUpdate() {
    this.checkNameBeforeInsert();
  }

}
