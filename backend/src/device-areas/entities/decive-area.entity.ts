import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('device_areas') // Name of this table in database
export class DeviceArea {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique : true, nullable: false})
  name: string;
  
  @Column('varchar', {length: 8, unique: true, nullable: true})
  hwId: string;

  @Column('text', {default : 'No comment'})
  description:  string;
  
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
