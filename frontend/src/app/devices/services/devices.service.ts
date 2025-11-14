// System
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
// Other modules
import { environment } from "@env/environment";
// This module
import { Device } from "../interfaces";


@Injectable({  providedIn: 'root' })
export class DevicesService {
  
  private http = inject(HttpClient);

  getDevices(): Observable<Device[]> {
    const apiUrl = environment.baseUrl
    return this.http.get<Device[]>(`${apiUrl}/devices`);
  }

}