// System
import { Component, computed, input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from '@angular/router';
// Other modules
import { SvgIconComponent, SvgIconName } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-link-button-primary',
  imports: [RouterLink, RouterLinkActive, CommonModule, SvgIconComponent],
  templateUrl: './link-button-primary-component.html',
})
export class LinkButtonPrimaryComponent { 

  // IO
  title = input.required<string>();
  subtitle = input.required<string>();
  path = input.required<string>();
  svgIconName = input.required<SvgIconName>();
  isCollapsed = input.required<boolean>();
  
  // Properties
  svgIconNameComputed = computed<SvgIconName>(() => this.svgIconName());
  
}
