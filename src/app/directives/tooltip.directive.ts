import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidationMessage]'
})
export class ValidationMessageDirective {
  @Input('validationType') validationType!: string;

  private errorMessageElement: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2, private control: NgControl) {
    this.errorMessageElement = this.renderer.createElement('span');
    this.renderer.setStyle(this.errorMessageElement, 'color', 'red');
    this.renderer.setStyle(this.errorMessageElement, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorMessageElement);
  }

  ngOnInit() {
    this.control.statusChanges?.subscribe(status => {
      if (status === 'INVALID') {
        this.showErrorMessage();
      } else {
        this.hideErrorMessage();
      }
    });
  }

  private showErrorMessage() {
    let errorMessage = 'Please provide a correct ' + this.validationType;
    this.renderer.setProperty(this.errorMessageElement, 'innerText', errorMessage);
    this.renderer.setStyle(this.errorMessageElement, 'display', 'block');
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid red');
  }

  private hideErrorMessage() {
    this.renderer.setStyle(this.errorMessageElement, 'display', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #ced4da');
  }
}
