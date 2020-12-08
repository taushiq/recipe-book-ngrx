import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() message: string; 
  @Output() alertOver = new EventEmitter<boolean>();
  

  constructor() { }

  ngOnInit(): void {
    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: this.message,
    }).then(data => {
      if(data){
        this.alertOver.emit(false);
      }
    })
  }

}
