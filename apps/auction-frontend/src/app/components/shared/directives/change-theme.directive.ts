import { Directive, HostListener, inject, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appChangeTheme]',
  exportAs: 'appChangeTheme',
})
export class ChangeThemeDirective {
  isToggleChecked: boolean | false = false;
  private document = inject(DOCUMENT);
  constructor() {
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    this.isToggleChecked = currentTheme === 'dark-mode';
    this.document.documentElement.classList.toggle(currentTheme);
  }

  @HostListener('change', ['$event'])
  change({ checked }: { checked: boolean }) {
    if (checked) {
      localStorage.setItem('theme', 'dark-mode');
    } else {
      localStorage.setItem('theme', 'light-mode');
    }
    this.document.documentElement.classList.toggle('dark-mode');
    this.document.documentElement.classList.toggle('light-mode');
  }
}
