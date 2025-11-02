import { Component, input, signal } from '@angular/core';



@Component({
  selector: 'app-device-control',
  imports: [],
  templateUrl: './device-control.component.html',
})
export class DeviceControlComponent {

  name = input.required<string>();
  status = signal<string>('?');

  updateStatus () {

  }


  setOn () {

  }

  setOff () {

  }

 }
