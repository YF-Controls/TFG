import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';


@Component({
  selector: 'app-device-control',
  imports: [NgClass],
  templateUrl: './device-control-component.html',
})
export class DeviceControlComponent {

  inName = input.required<string>();
  inDescription = input.required<string>();
  inStatus = input.required<'unknown' | 'off' | 'on'>();
  
  
  setOn () {
    console.log(`${this.inName()} sets ON`);
  }

  setOff () {
    console.log(`${this.inName()} sets OFF`);
  }

  clear() {
    console.log(`${this.inName()} clear`);
  }
 }
