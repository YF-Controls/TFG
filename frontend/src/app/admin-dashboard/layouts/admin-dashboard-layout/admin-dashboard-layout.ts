import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, ],
  templateUrl: './admin-dashboard-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardLayout {
  
 }
