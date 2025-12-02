// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
// Other modules
import { environment } from "@env/environment.development";
import { QueryParamsDto } from "@shared/dto";
// This module
import { CreateDeviceAreaDto, DeviceAreaResponseDto, UpdateDeviceAreaDto } from "@device-areas/dtos";
import { DeviceArea } from "@device-areas/interfaces";


// Constants
const URL: string = `${environment.baseUrl}/device-areas`;

@Injectable({  providedIn: 'root' })
export class DeviceAreaApi {
  
  // Injections
  private readonly http = inject(HttpClient);
  
  // CRUD Methods
  // Create: POST
  createOne(deviceArea: CreateDeviceAreaDto) : Observable<string | null> {
    return this.http.post<DeviceAreaResponseDto>(URL, deviceArea)
      .pipe(
        map((resp: DeviceAreaResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device area'))
      );
  }

  // Read: GET
  getAll(queryParamsDto: QueryParamsDto) : Observable<DeviceArea[]> {
    const params: any = { ...queryParamsDto };
    if (params.withInactives !== true) delete params.withInactives;
    return this.http.get<DeviceArea[]>(URL, {params : params});
  }
  
  // Read: GET
  getOne(id: string, queryParamsDto: QueryParamsDto) : Observable<DeviceArea> {
    const params: any = { ...queryParamsDto };
    if (params.withInactives !== true) delete params.withInactives;
    return this.http.get<DeviceArea>(`${URL}/${id}`, {params : params});
  }
  
  // Update: PATCH
  updateOne(id: string, deviceArea: UpdateDeviceAreaDto) : Observable<string | null> {
    return this.http.patch<DeviceAreaResponseDto>(`${URL}/${id}`, deviceArea)
      .pipe(
        map((resp: DeviceAreaResponseDto) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device area'))
      );
  }

  // Delete: DELETE
  deleteOne(id: string) : Observable<string | null> {
    return this.http.delete<any>(`${URL}/${id}`)
      .pipe(
        map((data) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting device area'))
      );
  }
}
