// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
// This module
import { DeviceArea } from '../../interfaces';
import { UpdateDeviceAreaComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-device-area-table',
  imports: [NgClass],
  templateUrl: './device-area-table-component.html',
})
export class DeviceAreaTableComponent { 

  // Injections
  private dialog = inject(Dialog);

  // Properties
  deviceAreas = input.required<DeviceArea[]>();
  updateTable = output();

  // Methods
  onUpdateOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(UpdateDeviceAreaComponent, {
      disableClose: false,
      data: {deviceArea}
    });

    dialogRef.closed.subscribe((confirmed) => {
      this.updateTable.emit();      
    });
  }
  
  onDeleteOne (deviceArea: DeviceArea) {
    console.error('Delete not implemented yet');
  }
}
