import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdowntoggle]'
})
export class DropdowntoggleDirective {
  @HostBinding('class.btn-success') color = false;

  @HostListener('click') toggleOpen(){
    this.color = !this.color;
  }

  constructor() { }



}
