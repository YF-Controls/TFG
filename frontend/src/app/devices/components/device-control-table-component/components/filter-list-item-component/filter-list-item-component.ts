// System
import { Component, input, output } from '@angular/core';


@Component({
  standalone : true,
  selector: 'app-filter-list-item-component',
  imports: [],
  templateUrl: './filter-list-item-component.html',
})
export class FilterListItemComponent {

  // IO
  filter = input.required<string | null>();
  id = input.required<string | null>();
  name = input.required<string>();
  
  onClick = output();
  
 }
