// System
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';


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
  
  // Properties
  protected readonly title = signal('HOME Assisstant');

  // Methods
  ngOnInit(): void {
    this.titleService.setTitle(this.title());
  }

}
