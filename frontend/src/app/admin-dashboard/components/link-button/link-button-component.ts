import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-link-button',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './link-button-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkButtonComponent { 

  /*
    Properties
  */
  private sanitizer = inject(DomSanitizer);

  /*
    Inputs/Outputs
  */
  title = input.required<string>();
  subtitle = input.required<string>();
  path = input.required<string>();
  svgIcon = input.required<string>();
  
  /*
    Constructor
  */
  

  /*
    Public methods
  */

  safeSvgIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgIcon());
  }

  /*
    Private methods
  */
}
