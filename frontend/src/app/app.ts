// System
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  standalone : true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  //styleUrl: './app.css'
})
export class App implements OnInit{
  
  // Injections
  protected readonly titleService = inject(Title);
  private readonly translate = inject(TranslateService);
  
  // Properties
  protected readonly title = signal('HOME Assisstant');

  // Methods
  ngOnInit(): void {
    this.titleService.setTitle(this.title());
    // Initialize translations
    this.translate.use('en');
  }

}
