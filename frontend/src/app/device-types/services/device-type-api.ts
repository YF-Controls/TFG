// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
// Other modules
import { environment } from "@env/environment.development";
import { QueryParamsDto } from "@shared/dto";
// This module
import { CreateDeviceTypeDto, DeviceTypeResponseDto, UpdateDeviceTypeDto } from "@device-types/dtos";
import { DeviceType } from "@device-types/interfaces";


// Constants
const URL: string = `${environment.baseUrl}/device-types`;
 
@Injectable({  providedIn: 'root' })
export class DeviceTypeApi {
  
  // Injections
  protected readonly http = inject(HttpClient);
  
  // CRUD Methods
  // Create: POST
  create(deviceType: CreateDeviceTypeDto) : Observable<string | null> {
    return this.http.post<DeviceTypeResponseDto>(URL, deviceType)
      .pipe(
        map((resp: DeviceTypeResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device Type'))
      );
  }

  // Read: GET
  getAll(queryParamsDto: QueryParamsDto) : Observable<DeviceType[]> {
    const params: any = { ...queryParamsDto };
    // Remove undefined/null properties
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null) delete params[key];
    });
    return this.http.get<DeviceType[]>(URL, {params : params});
  }

  // Read: GET
  getOne(id: string, queryParamsDto: QueryParamsDto) : Observable<DeviceType> {
    const params: any = { ...queryParamsDto };
    // Remove undefined/null properties
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null) delete params[key];
    });
    return this.http.get<DeviceType>(`${URL}/${id}`, {params : params});
  }
  
  // Update: PATCH
  updateOne(id: string, deviceType: UpdateDeviceTypeDto) : Observable<string | null> {
    return this.http.patch<DeviceTypeResponseDto>(`${URL}/${id}`, deviceType)
      .pipe(
        map((resp: DeviceTypeResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device Type')        )
      );
  }

  // Delete: DELETE
  delete(id: string) : Observable<string | null> {
    return this.http.delete<any>(`${URL}/${id}`)
      .pipe(
        map((data) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting device Type'))
      );
  }

}