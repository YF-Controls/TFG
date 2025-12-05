// System
import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownControlService {
  
  // Properties
  private activeDropdown = signal<string | null>(null);
  
  // Methods
  open(id: string): void {
    this.activeDropdown.set(id);
  }
  
  close(id: string): void {
    if (this.activeDropdown() === id) {
      this.activeDropdown.set(null);
    }
  }
  
  closeAll(): void {
    this.activeDropdown.set(null);
  }
  
  isOpen(id: string): boolean {
    return this.activeDropdown() === id;
  }
}
