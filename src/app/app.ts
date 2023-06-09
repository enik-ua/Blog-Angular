import { Component} from '@angular/core';
import { Blog } from './blog'

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  blogs : Blog[];
  listPage : boolean;
  newPage : boolean;
  loginPage : boolean;
  login : string;
  passwd : string;
  constructor(){
    let me = this;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:3001/articles');
    request.onload = function() {
      debugger;
      let recivedBlogs = JSON.parse(this.responseText);

      for (let i = 0; i<recivedBlogs.length;i++){

        me.blogs.push(new Blog(recivedBlogs[i].title,recivedBlogs[i].text,recivedBlogs[i].login));
      };  
    };
    this.blogs=[new Blog("","","")];
    this.login  ="";
    this.passwd ="";
    this.listPage  = true;
    this.newPage   = false;
    this.loginPage = false;
    request.send();
  }
  newArticle(): void {
    this.listPage=false;
    this.newPage=true; 
    this.loginPage=false;
  }
  saveArticle(): void{
    let me = this;
    let guid = new XMLHttpRequest();
    guid.open('GET', 'http://127.0.0.1:3001/guid');
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
          //request.open('POST', 'http://127.0.0.1:3001/'+guidResponce);
          request.open('POST', 'http://127.0.0.1:3001/articles');
          request.onload = function() {
            me.listPage=true;
            me.newPage=false;
          };
          request.send(JSON.stringify({title:title.value,text:text.value,login:login.value,password:passwd.value}));
        }
      }
    }
    guid.send();
  }
  onLogin():void{
    this.loginPage=false;
    this.listPage=true;
    this.newPage=false;
  }
  loginUser():void{
    this.loginPage=true;
    this.listPage=false;
    this.newPage=false;
  }
}
