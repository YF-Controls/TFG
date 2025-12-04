// System
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-layout-subtitle',
  imports: [TranslateModule],
  templateUrl: './layout-subtitle-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSubtitleComponent {
  
  // IO
  subtitle = input.required<string>();
  isSidebarCollapsed = input.required<boolean>();

 }
