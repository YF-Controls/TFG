// System
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// This path
import { SvgIconComponent, SvgIconName } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-layout-link-button-secondary',
  imports: [TranslateModule, RouterLink, SvgIconComponent],
  templateUrl: './layout-link-button-secondary-component.html',
})
export class LayoutLinkButtonSecondaryComponent { 

  // IO
  title = input.required<string>();
  subtitle = input.required<string>();
  path = input.required<string>();
  svgIconName = input.required<SvgIconName>();
  isCollapsed = input.required<boolean>();
  
  // Properties
  svgIconNameComputed = computed<SvgIconName>(() => this.svgIconName());
  
}
