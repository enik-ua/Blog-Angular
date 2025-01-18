const app    = require('./settings');
const http   = require('http');
const db     = require('sqlite3').verbose();
const crypto = require('./engine/crypto');

let blog = new db.Database(app.database,(err)=>{
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
    listenServer();
    blog.close();
});

const server = http.createServer((query, packet) => {
    let data = "";
    query.on((chunk) => {
      data += chunk;
    });
    query.on(()=>{
        packet.setHeader("Content-Type", "text/plain");
        packet.statusCode = 200;
        packet.setHeader("Access-Control-Allow-Origin",app.acao);

        blog = new db.Database(app.database);
        switch (query.method){
            case "GET":
                switch (query.url){
                    case "/guid":
                        packet.end(0);
                        break;
                    case "/articles":
                        blog.serialize(()=>{
                            blog.all('SELECT * FROM articles;',(err,rows)=>{
                                if (err){
                                    console.error(err.message);
                                }
                                packet.end(JSON.stringify(rows));
                                blog.close()
                            });
                        });
                        break;
                }
                break;
            case "POST":
                data = JSON.parse(data);
                switch (query.url){
                    case "/articles":
                        blog.serialize(()=>{
                            blog.get('SELECT login,password FROM users WHERE login=? AND password=?;',[data.login,crypto.MD5(data.password)],(err,row)=>{
                                if(err){
                                    console.error(err.message);
                                }else if(row==undefined){
                                    console.error("Помилка аутентифікації");
                                }else{
                                    blog.run(`INSERT INTO articles (title,text,login) VALUES(?,?,?);`,[data.title,data.text,data.login],(err,row)=>{
                                        if (err){
                                            console.error(err.message);
                                        }else{
                                            packet.end();
                                        }
                                        blog.close();
                                    });
                                }
                            });
                        });
                        break;
                    case "/users":
                        blog.serialize(()=>{
                    	    blog.get('SELECT login FROM users WHERE login = ?;',[data.login],(err,row)=>{
                                if(err){
                    		        console.error(err.message);
                    		    }else if(row!==undefined){
                                    console.error("Логін використаний");
                                }else{
                                    blog.run(`INSERT INTO users (login,password) VALUES(?,?);`,[data.login,crypto.MD5(data.password)],(err,row)=>{
                                        if (err){
                                            console.error(err.message);
                                        }else{
                                            packet.end(row);
                                        }
                                        blog.close();
                                    });
                                }
                    	    });
                        });            
                        break;
                }
                break;
        }
    });
});

function listenServer(){
    server.listen(app.port,app.hostname,undefined,()=>{
        console.log(`Server running at http://${app.hostname}:${app.port}/`);
    })
}
