import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  blogs = [{"title":"","text":"","login":""}];
  listPage = true;
  newPage = false;
  loginPage =false;
  constructor(){
    const me = this;
    const articles = new XMLHttpRequest();
    //articles.open('GET', 'http://109.201.229.40:3000/articles');
    articles.open('GET', 'http://127.0.0.1:3000/articles');
    articles.onload = function() {
      const recivedBlogs = JSON.parse(this.responseText);
      const tmpBlogs=[];
      for (let i = 0; i<recivedBlogs.length;i++){
        tmpBlogs.push({"title":recivedBlogs[i].title,"text":recivedBlogs[i].text,"login":recivedBlogs[i].login});
      };
      me.blogs=tmpBlogs;
    };
    articles.send();
  }
  newArticle(){
    this.listPage=false;
    this.newPage=true; 
    this.loginPage=false;
  }
  saveArticle(){
    let me = this;
    let guid = new XMLHttpRequest();
    //guid.open('GET', 'http://109.201.229.40:3000/guid');
    guid.open('GET', 'http://127.0.0.1:3000/guid');
    guid.responseType = "text";
    guid.onload = function(){
      let guidResponce = this.response;
      let request = new XMLHttpRequest();
      let title = document.getElementById("title") as HTMLInputElement;
      let text = document.getElementById("text") as HTMLTextAreaElement;
      let login = document.getElementById("login") as HTMLInputElement;
      let passwd = document.getElementById("password") as HTMLInputElement;
      if (title && text && login && passwd){
        if (title.value && text.value && login.value && passwd.value){
          me.sendArticle(title.value,text.value,login.value,passwd.value);
        }
      }
    }
    guid.send();
  }
  sendArticle(title:string,text:string,login:string,passwd:string):void{
    let me = this;
    let request = new XMLHttpRequest();
    //request.open('POST', 'http://109.201.229.40:3000/articles');
    request.open('POST', 'http://127.0.0.1:3000/articles');
    request.onload = function() {
      me.listPage=true;
      me.newPage=false;
      me.blogs.push({title:title,text:text,login:login});
    };
    request.send(JSON.stringify({title:title,text:text,login:login,password:passwd}));
  }  
  loginUser(){
    this.loginPage=true;
    this.listPage=false;
    this.newPage=false;
  }
  newUser(){
    let me = this;
    const login    = document.getElementById("login") as HTMLInputElement;
    const password1 = document.getElementById("password1") as HTMLInputElement;
    const password2 = document.getElementById("password2") as HTMLInputElement;
    if (login && password1 && password2){
      if(login.value && password1.value && password2.value){
        if(password1.value==password2.value){
          const request = new XMLHttpRequest();
          //request.open('POST', 'http://109.201.229.40:3000/users');
          request.open('POST', 'http://127.0.0.1:3000/users');
          request.onload = function() {
            me.loginPage=false;
            me.listPage=true;
            me.newPage=false;
          }
          request.send(JSON.stringify({'login':login.value,'password':password1.value}));
        }
      }
    }
  }
}
