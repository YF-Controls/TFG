// System
import { Component, computed, input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
// Other modules
import { SvgIconComponent, SvgIconName } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-layout-link-button-secondary',
  imports: [RouterLink, CommonModule, SvgIconComponent],
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
