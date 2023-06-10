const hostname = '127.0.0.1';
const port     = 3001;
const acao     = "*";
const database = "database";
const http     = require('http');
const sqlite   = require('sqlite3').verbose();
const { v4: uuid } = require('uuid');
const CryptoJS = require('crypto-js');

let db = new sqlite.Database(database,(err)=>{
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});
db.close();

const server = http.createServer((query, packet) => {
    let data = "";

    query.on("data", (chunk) => {
      data += chunk;
    });
    query.on("end",()=>{
        packet.setHeader("Content-Type", "text/plain");
        packet.statusCode = 200;
        packet.setHeader("Access-Control-Allow-Origin",acao);

        db = new sqlite.Database('database');
        switch (query.method){
            case "GET":
                switch (query.url){
                    case "/guid":
                        packet.end(uuid());
                        break;
                    case "/articles":
                        db.serialize(()=>{
                            db.all('SELECT * FROM articles;',(err,rows)=>{
                                if (err){
                                    console.error(err.message);
                                }
                                packet.end(JSON.stringify(rows));
                            });
                        });
                        break;
                }
                break;
            case "POST":
                switch (query.url){
                    case "/articles":
                        let article = JSON.parse(data);
                        db.serialize(()=>{
                            let MD5 = CryptoJS.MD5(article.password);
                            let hash = MD5.words[0]>0?MD5.words[0]:-MD5.words[0]+MD5.words[1]>0?MD5.words[1]:-MD5.words[1]+MD5.words[2]>0?MD5.words[2]:-MD5.words[2]+MD5.words[3]>0?MD5.words[3]:-MD5.words[3];
                            db.get('SELECT login,password FROM users WHERE login="'+article.login+'" AND password="'+ hash+'";',[],(err,row)=>{
                                if(err){
                                    console.error(err.message);
                                }else if(row==undefined){
                                    console.error("Помилка аутентифікації");
                                }else{
                                    db = new sqlite.Database('database');
                                    db.run(`INSERT INTO articles (title,text,login) VALUES(?,?,?);`,[article.title,article.text,article.login],(err,row)=>{
                                        if (err){
                                            console.error(err.message);
                                        }else{
                                            packet.end();
                                        }
                                    });
                                    db.close();
                                }
                            });
                        });
                        break;
                    case "/users":
                        let user = JSON.parse(data);
                        db.serialize(()=>{
                    	    db.get('SELECT login FROM users WHERE login ="'+user.login+'";',[],(err,row)=>{
                                if(err){
                    		        console.error(err.message);
                    		    }else if(row!==undefined){
                                    console.error("Логін використаний");
                                }else{
                                    db = new sqlite.Database('database');
                                    let MD5 = CryptoJS.MD5(user.password);
                                    let hash = MD5.words[0]>0?MD5.words[0]:-MD5.words[0]+MD5.words[1]>0?MD5.words[1]:-MD5.words[1]+MD5.words[2]>0?MD5.words[2]:-MD5.words[2]+MD5.words[3]>0?MD5.words[3]:-MD5.words[3];
                                    db.run(`INSERT INTO users (login,password) VALUES(?,?);`,[user.login,hash],(err,row)=>{
                                        if (err){
                                            console.error(err.message);
                                        }else{
                                            packet.end(row);
                                        }
                                    });
                                    db.close();
                                }
                    	    });
                        });            
                        break;
                }
                break;
        }
        db.close();
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function createResponse(query,packet){
    packet.statusCode = 200;
    packet.setHeader('Content-Type', 'text/plain');
    packet.end('Hello World');
    console.log(`Connect to server at http://${hostname}:${port}/`);
    console.log(packet);
}