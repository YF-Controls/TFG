// System
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { AuthApi } from '@auth/services';
import { DeviceApi } from '@devices/services';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceAreaApi } from '@device-areas/services';
// This module
import { DoughnutChartComponent } from '@admin/components';


interface DashboardStats {
  active: number;
  inactive: number;
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard-page',
  imports: [TranslateModule, DoughnutChartComponent],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage implements OnInit {
  
  // Injections
  private languageService = inject(LanguageService);
  private authApi = inject(AuthApi);
  private deviceApi = inject(DeviceApi);
  private deviceTypeApi = inject(DeviceTypeApi);
  private deviceAreaApi = inject(DeviceAreaApi);

  // Properties
  usersStats = signal<DashboardStats>({ active: 0, inactive: 0, total: 0 });
  devicesStats = signal<DashboardStats>({ active: 0, inactive: 0, total: 0 });
  deviceTypesStats = signal<DashboardStats>({ active: 0, inactive: 0, total: 0 });
  deviceAreasStats = signal<DashboardStats>({ active: 0, inactive: 0, total: 0 });

  // Lifecycle
  ngOnInit(): void {
    this.loadStats();
  }

  // Methods
  private loadStats(): void {
    // Load Users
    this.authApi.getUsers({ limit: 1000, withInactives: true }).subscribe(users => {
      const active = users.filter(u => u.isActive).length;
      const inactive = users.filter(u => !u.isActive).length;
      this.usersStats.set({ active, inactive, total: users.length });
    });

    // Load Devices
    this.deviceApi.getAll({ limit: 1000, withInactives: true }).subscribe(devices => {
      const active = devices.filter(d => d.isActive).length;
      const inactive = devices.filter(d => !d.isActive).length;
      this.devicesStats.set({ active, inactive, total: devices.length });
    });

    // Load Device Types
    this.deviceTypeApi.getAll({ limit: 1000, withInactives: true }).subscribe(types => {
      const active = types.filter(t => t.isActive).length;
      const inactive = types.filter(t => !t.isActive).length;
      this.deviceTypesStats.set({ active, inactive, total: types.length });
    });

    // Load Device Areas
    this.deviceAreaApi.getAll({ limit: 1000, withInactives: true }).subscribe(areas => {
      const active = areas.filter(a => a.isActive).length;
      const inactive = areas.filter(a => !a.isActive).length;
      this.deviceAreasStats.set({ active, inactive, total: areas.length });
    });
  }
}
