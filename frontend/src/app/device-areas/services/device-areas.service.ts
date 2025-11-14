// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
// Other modules
import { environment } from "@env/environment.development";
import { PaginationDto } from "@shared/dto";
import { CreateDeviceAreaDto, DeviceAreaResponseDto } from "@device-areas/dtos";
// This module
import { DeviceArea } from "../interfaces";



// Constants
const baseUrl = environment.baseUrl;
const DEVICE_AREAS_URL: string = `${baseUrl}/device-areas`;


@Injectable({  providedIn: 'root' })
export class DeviceAreasService {

  // Injections
  private http = inject(HttpClient);
  

  // HTTP request GET
  getAll(paginationDto: PaginationDto) : Observable<DeviceArea[]> {
    
    const {limit = 10, offset = 0, withInactives = false} = paginationDto;
    
    return this.http
      .get<DeviceArea[]>(DEVICE_AREAS_URL, {params : {limit, offset, withInactives}})
      .pipe(
        tap((deviceAreas) => console.log('!DELETE device-areas.service.ts Fetched device areas:', {deviceAreas}))
      );
  }

  // HTTP request POST
  create(deviceArea: CreateDeviceAreaDto) : Observable<string | null> {

    return this.http.post<DeviceAreaResponseDto>(DEVICE_AREAS_URL, deviceArea)
      .pipe(
        map((resp: DeviceAreaResponseDto) => {
          console.log('!DELETE device-areas.service.ts Created device area:', {resp});
          return null;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('!DELETE device-areas.service.ts Error creating device area:', error);
          return of(error.error.message || 'Error creating device area');
        })
      );
  }

}