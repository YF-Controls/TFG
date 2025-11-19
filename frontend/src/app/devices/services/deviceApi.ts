// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
// Other modules
import { environment } from "@env/environment";
import { QueryParamsDto } from "@shared/dto";
import { OrderDirection } from '@shared/interfaces';
// This module
import { CreateDeviceDto, UpdateDeviceDto } from "@devices/dtos";
import { Device } from "@devices/interfaces";


// Constants
const URL: string = `${environment.baseUrl}/devices`;

@Injectable({  providedIn: 'root' })
export class DeviceApi {
  
  // Injections
  private http = inject(HttpClient);

  // HTTP request GET
  getAll(queryParamsDto: QueryParamsDto): Observable<Device[]> {
    // Get query parameters
    const {limit = 10, offset = 0, withInactives = false, orderBy = 'id', orderDirection = OrderDirection.ASC} = queryParamsDto;
    // HTTP request
    return this.http.get<Device[]>(URL, {params : {limit, offset, withInactives, orderBy, orderDirection}});
  }

  // HTTP request POST
  create(device: CreateDeviceDto) : Observable<string | null> {

    return this.http.post<Device>(URL, device)
      .pipe(
        map((resp: Device) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device'))
      );
  }

  // HTTP request PATCH
  update(id: string, device: UpdateDeviceDto) : Observable<string | null> {
    
    return this.http.patch<Device>(`${URL}/${id}`, device)
      .pipe(
        map((resp: Device) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error updating device'))
      );
  }

  // HTTP request DELETE
  delete(id: string) : Observable<string | null> {

    return this.http.delete<any>(`${URL}/${id}`)
      .pipe(
        map((data) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting device'))
      );
  }

}
