// System
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
// Other modules
import { environment } from "@env/environment";
import { QueryParamsDto } from "@shared/dto";
// This module
import { CreateDeviceDto, UpdateDeviceDto } from "@devices/dtos";
import { Device } from "@devices/interfaces";


// Constants
const URL: string = `${environment.baseUrl}/devices`;

@Injectable({  providedIn: 'root' })
export class DeviceApi {
  
  // Injections
  private readonly http = inject(HttpClient);

  // CRUD Methods
  // Create: POST
  create(device: CreateDeviceDto) : Observable<string | null> {
    return this.http.post<Device>(URL, device)
      .pipe(
        map((resp: Device) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error creating device'))
      );
  }
  
  // Read: GET
  getAll(queryParamsDto: QueryParamsDto): Observable<Device[]> {
    const params: any = { ...queryParamsDto };
    if (params.withInactives !== true) delete params.withInactives;
    return this.http.get<Device[]>(URL, {params : params});
  }
  
  // Read: GET
  getOne(id: string, queryParamsDto: QueryParamsDto): Observable<Device> {
    const params: any = { ...queryParamsDto };
    if (params.withInactives !== true) delete params.withInactives;
    return this.http.get<Device>(`${URL}/${id}`, {params : params});
  }

  // Update: PATCH
  update(id: string, device: UpdateDeviceDto) : Observable<string | null> {
    return this.http.patch<Device>(`${URL}/${id}`, device)
      .pipe(
        map((resp: Device) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error updating device'))
      );
  }

  // Delete: DELETE
  delete(id: string) : Observable<string | null> {
    return this.http.delete<any>(`${URL}/${id}`)
      .pipe(
        map((data) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting device'))
      );
  }
}
