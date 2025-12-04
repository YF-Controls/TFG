// System
import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// This path
import { SvgIconComponent, SvgIconName } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-layout-link-button-primary',
  imports: [TranslateModule, RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './layout-link-button-primary-component.html',
})
export class LayoutLinkButtonPrimaryComponent { 

  // IO
  title = input.required<string>();
  subtitle = input.required<string>();
  path = input.required<string>();
  svgIconName = input.required<SvgIconName>();
  isCollapsed = input.required<boolean>();
  
  // Properties
  svgIconNameComputed = computed<SvgIconName>(() => this.svgIconName());
  
}
