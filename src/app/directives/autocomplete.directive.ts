import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Country } from '../shared/enum/country';

@Directive({
  selector: '[appAutocomplete]'
})
export class AutocompleteDirective implements AfterViewInit {
  private countries: string[] = Object.values(Country);
  private dropdown: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2, private control: NgControl) {
    this.dropdown = this.renderer.createElement('div');
    this.renderer.setStyle(this.dropdown, 'position', 'absolute');
    this.renderer.setStyle(this.dropdown, 'backgroundColor', 'white');
    this.renderer.setStyle(this.dropdown, 'border', '1px solid #ced4da');
    this.renderer.setStyle(this.dropdown, 'zIndex', '1000');
    this.renderer.setStyle(this.dropdown, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.dropdown);
  }

  ngAfterViewInit() {
    this.setDropdownWidth();
  }

  private setDropdownWidth() {
    const width = this.el.nativeElement.offsetWidth + 'px';
    this.renderer.setStyle(this.dropdown, 'width', width);
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const value = this.el.nativeElement.value.toLowerCase();
    const filteredCountries = this.countries.filter(country => country.toLowerCase().includes(value));

    this.clearDropdown();
    if (filteredCountries.length > 0) {
      this.showSuggestions(filteredCountries);
      this.renderer.setStyle(this.dropdown, 'display', 'block');
      this.setDropdownWidth();
    } else {
      this.renderer.setStyle(this.dropdown, 'display', 'none');
    }
  }

  @HostListener('window:resize') onResize() {
    this.setDropdownWidth();
  }

  @HostListener('document:click', ['$event']) onClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.clearDropdown();
      this.renderer.setStyle(this.dropdown, 'display', 'none');
    }
  }

  private showSuggestions(countries: string[]) {
    countries.forEach(country => {
      const option = this.renderer.createElement('div');
      this.renderer.setStyle(option, 'padding', '5px');
      this.renderer.setStyle(option, 'cursor', 'pointer');
      this.renderer.setProperty(option, 'innerText', country);
      this.renderer.listen(option, 'click', () => {
        this.control.control?.setValue(country);
        this.clearDropdown();
        this.renderer.setStyle(this.dropdown, 'display', 'none');
      });
      this.renderer.appendChild(this.dropdown, option);
    });
  }

  private clearDropdown() {
    while (this.dropdown.firstChild) {
      this.dropdown.removeChild(this.dropdown.firstChild);
    }
  }
}
