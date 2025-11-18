// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
// Other modules
import { environment } from "@env/environment.development";
import { QueryParamsDto } from "@shared/dto";
import { OrderDirection } from '@shared/interfaces';
import { CreateDeviceAreaDto, DeviceAreaResponseDto, UpdateDeviceAreaDto } from "@device-areas/dtos";
// This module
import { DeviceArea } from "../interfaces";


// Constants
const URL: string = `${environment.baseUrl}/device-areas`;

@Injectable({  providedIn: 'root' })
export class DeviceAreaApi {
  
  // Injections
  private http = inject(HttpClient);
  

  // HTTP request GET
  getAll(queryParamsDto: QueryParamsDto) : Observable<DeviceArea[]> {
    
    const {limit = 10, offset = 0, withInactives = false, orderBy = 'id', orderDirection = OrderDirection.ASC} = queryParamsDto;
    
    return this.http.get<DeviceArea[]>(URL, {params : {limit, offset, withInactives}});
      //.pipe(
      //  tap((deviceAreas) => console.log('!DELETE device-areas.service.ts Fetched device areas:', {deviceAreas}))
      //);
  }

  // HTTP request POST
  create(deviceArea: CreateDeviceAreaDto) : Observable<string | null> {

    return this.http.post<DeviceAreaResponseDto>(URL, deviceArea)
      .pipe(
        map((resp: DeviceAreaResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device area'))
      );
  }

  // HTTP request PATCH
  update(id: string, deviceArea: UpdateDeviceAreaDto) : Observable<string | null> {
    
    return this.http.patch<DeviceAreaResponseDto>(`${URL}/${id}`, deviceArea)
      .pipe(
        map((resp: DeviceAreaResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device area')        )
      );
  }

  // HTTP request DELETE
  delete(id: string) : Observable<string | null> {

    return this.http.delete<any>(`${URL}/${id}`)
      .pipe(
        map((data) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting device area'))
      );
  }

}