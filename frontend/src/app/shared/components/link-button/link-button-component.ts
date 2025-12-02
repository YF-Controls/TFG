// System
import { Component, computed, input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from '@angular/router';
// Other modules
import { SvgIconComponent, SvgIconName } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-link-button',
  imports: [RouterLink, RouterLinkActive, CommonModule, SvgIconComponent],
  templateUrl: './link-button-component.html',
})
export class LinkButtonComponent { 

  // Properties
  title = input.required<string>();
  subtitle = input.required<string>();
  path = input.required<string>();
  svgIconName = input<SvgIconName>('dashboard');
  isCollapsed = input<boolean>(false);
  
  svgIconNameComputed = computed<SvgIconName>(() => this.svgIconName());
  
}
