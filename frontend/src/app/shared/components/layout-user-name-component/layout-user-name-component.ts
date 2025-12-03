// System
import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  standalone: true,
  selector: 'app-layout-user-name',
  imports: [TranslateModule],
  templateUrl: './layout-user-name-component.html',
})
export class LayoutUserNameComponent {
  
  // IO
  isSidebarCollapsed = input.required<boolean>();
  fullname = input.required<string>();
  welcomeText = input.required<string>();

  // Properties
  protected fullNameInitials = computed<string>(() => {
    return this.fullname()
      .split(' ')
      .map(namePart => namePart.charAt(0).toUpperCase())
      .join('');
  });
  
  // Methods
  
 }
