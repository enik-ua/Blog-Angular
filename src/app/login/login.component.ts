import { Component,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() myEvent = new EventEmitter<void>();
  login(){
    let me = this;
    const login    = document.getElementById("login") as HTMLInputElement;
    const password1 = document.getElementById("password1") as HTMLInputElement;
    const password2 = document.getElementById("password2") as HTMLInputElement;
    if (login && password1 && password2){
      if(login.value && password1.value && password2.value){
        if(password1.value==password2.value){
          const request = new XMLHttpRequest();
          request.open('POST', 'http://127.0.0.1:3001/users');
          request.onload = function() {
              me.myEvent.emit();
          }
          request.send(JSON.stringify({'login':login.value,'password':password1.value}));
        }
      }
    }
  }
}
