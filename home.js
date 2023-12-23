const {faker, tr} = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const { v4: uuidv4 } = require("uuid");

const path = require('path');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));


const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'delta',
    password : 'Rohit@3333',
});

let getRandomUser = () =>{
    return [
        faker.datatype.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};


//Route 1-> Home
app.get("/", (req,resp)=>{
    let q = "SELECT count(*) FROM user";

    try {
        connection.query(q,(err,result) => {
            if(err) throw err;
            // console.log(result[0]["count(*)"]);
            let count = result[0]["count(*)"];
            resp.render("home.ejs",{count});
        });
    } catch(err) {
        console.log(err);
        resp.send("Some error in database");
    }
    // resp.send("Welcome to home page");
})

//Route 2 Show that show the users id,username, email
app.get('/user',(req,resp) =>{
    let q = "SELECT * FROM user";

    try{
        connection.query(q, (err,users) => {
            if(err) throw err;
            //console.log(result[0]);
            resp.render("showusers.ejs",{users});
        })
    } catch (err){
        console.log(err);
        resp.send("Some error in database")
    }
})


//Route 3 ->Edit route
app.get("/user/:id/edit", (req,resp) => {
    let {id} = req.params; //getting id
    let q = `SELECT * FROM user WHERE id = '${id}'`;

    try {
        connection.query(q,(err,result) => {
            if(err) throw err;
            // console.log(result[0]);
            let user = result[0];
            resp.render("editForm.ejs",{user});
        });
    } catch(err) {
        console.log(err);
        resp.send("You have some error in database");
    }
    // console.log(id);
    // resp.render("editForm.ejs");
});

//Update(DB) route
app.patch("/user/:id",(req,resp) => {
    let {id} = req.params;
    let {password : formPassword ,username : newUsername} = req.body; //getting password and new username
    let q = `SELECT * FROM user WHERE id = '${id}'`;

    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            // console.log(result[0]);
            let user = result[0];
            if(formPassword != user.password) {
                resp.send("Wrong Password");
            } else {
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`; //updating username
                connection.query(q2 ,(err,result) => {
                    if(err) throw err;
                    // resp.send(result);
                    resp.redirect('/user');
                }) 
            }
            // resp.send(user);
        });
    } catch(err) {
        console.log(err);
        resp.send("You have some error in database");
    }
})


//Route 4 -Delete route 
app.get('/user/:id/delete',(req,resp) =>{
    let {id} = req.params;

    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err,result) =>{
            if(err) throw err;
            //console.log(result[0]);
            let user = result[0];
            resp.render("delete.ejs",{user});
        })
    } catch(err) {
        console.log(err);
        resp.send("Error in db");
    }

    // console.log(id);
    // resp.send("delete");
});

//deleting now route
app.delete('/user/:id', (req,resp) =>{
    let {id} = req.params;
    let { password } = req.body;

    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err,result) =>{
            if(err) throw err;
            //console.log(result[0]);
            let user = result[0];
            if(user.password != password) {
                resp.send("Wrong password entered");
            } else {
                let q2 = `DELETE  FROM user WHERE id='${id}'`;

                connection.query(q2, (err, result) =>{
                    if(err) throw err;
                    // resp.send(result);
                    console.log(result);
                    console.log("Deleted");
                    resp.redirect("/user");
                })
            }
        })
    } catch(err) {
        console.log(err);
        resp.send("Error in db");
    }
})


//New user adding route
app.get('/user/new', (req,resp) =>{
    resp.render('post.ejs');
})

//Adding to database route
app.post('/user/new',(req,resp) =>{
    let {username,email,password} = req.body;
    let id = uuidv4();

    let q = `INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;

    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            console.log("Added new user");
            resp.redirect("/user");
        })
    } catch(err) {
        console.log(err);
        resp.send("some error in database");
    }
})


app.listen('8080', () => {
    console.log("Server is listing at port 8080");
});


// try {
//     connection.query(q,[data], (result,err) =>{
//         if(err) throw err;
//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }

// connection.end();