// converted to use sequelize instead of pgp
const express = require("express");
nunjucks = require("nunjucks");
body_parser = require("body-parser");
jsonfile = "/src/file.json";
const Promise = require("bluebird");
session = require("express-session");
pbkdf2 = require("pbkdf2");
passhelper = require('pbkdf2-helpers');
crytpo = require("crypto");

let connection;

const db = require("./models"); //for use with sequelize

var app = express();

app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("public"));


var hour = 3600000;
app.use(
  session({
    secret: process.env.SECRET_KEY || "dev",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 2 * hour }
  })
);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true
});

// app.use(function(request, response, next) {
//   if (request.session.user) {
//     next();
//   } else if (request.path == "/login") {
//     next();
//   } else if (request.path == "/register") {
//     next();
//   } else {
//     response.redirect("/login");
//   }
// });

app.get("/register", function(request, response) {
  response.render("register.html");
});

app.post("/register", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var password2 = request.body.password2;
  var passcrypt = passhelper.generate_storage(password);
  

  if (passhelper.matches(password2, passcrypt)){
    console.log("Matching passwords!!")
    db.user.create({
      firstName:request.body.fname,
      lastName:request.body.lname,
      email:request.body.email,
      passcrypt:passcrypt
    }).then(user=>{
      response.redirect("/login");
    })
    //pass info to db.
    
  }else{
    console.log("mismatch!!");
    response.redirect("/register");
  }
  
});


app.get("/login", function(request, response) {
  response.render("login.html");
});

app.post("/login", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  db.user.findOne({where:{email:username}}).then( user =>{    
    if (username == user.email && passhelper.matches(password, user.passcrypt)) {
      request.session.user = username;
      console.log("Welcome!");
      response.redirect("/");
    } else {
      console.log("failed!");
      response.redirect("/login");
    }
  });
  
});

app.get("/logout", function(request, response) {
  request.session.destroy();
  response.redirect("login.html");
});

//Todo APPl

app.get("/", function(request, response) {
  response.render("index.html");
});

app.get("/form", function (request, response) {
  response.render("form.html");
});

app.get("/customer", function (request, response) {
  response.render("customer.html");
});

app.post("/success", function (request, response, next) {
  var data = request.body
  response.render("success.html", {data});
});




app.get("/todos", function(request, response) {
  db.task.findAll({ include: [{ model: db.user }] }).then(tasks => {
    db.user.findAll({ offset: 1 }).then(users=>{ 
      console.log(users.firstName)
      response.render("todos.html", { tasks, users });
    });
    // response.json({tasks: tasks})
  });
});

app.post("/todos", function(request, response, next) {
  console.log("DUE: " + request.body.date);
  var due_date = request.body.date + "T19:00:00";
  if (
    (request.body.n_task != "") &
    (request.body.agent != undefined) &
    (request.body.date != "")
  ) {
    db.task
      .create({
        name: request.body.n_task,
        due: due_date,
        userId: request.body.agent,
        status: false
      })
      .then(task => {
        // console.log("task: " + task.get('name') + " ");
        response.redirect("/todos");
      })
      .catch(next);
  } else {
    // response.send(500, 'ShowAlert')
    response.redirect("/todos");
    console.log("this: " + request.body.n_task);
  }
});

app.post("/todos/:done", function(request, response, next) {
  var tasks = request.body.task;
  if (typeof tasks === "string") {
    tasks = [tasks];
  } else if (typeof tasks === "undefined") {
    tasks = [0];
  }
  tasks = tasks.map(JSON.parse);

  var promises = [];

  if (request.body.action == "done") {
    for (let i = 0; i < tasks.length; i++) {
      var stat = !tasks[i].status;
      var p = db.task.update({ status: stat }, { where: { id: tasks[i].id } });
      promises.push(p);
    }
  } else if (request.body.action == "remove") {
    for (let i = 0; i < tasks.length; i++) {
      var stat = !tasks[i].status;
      var p = db.task.destroy({ where: { id: tasks[i].id } });
      promises.push(p);
    }
  }
  Promise.all(promises)
    .then(result => {
      response.redirect("/todos");
      // response.json({success: true})
    })
    .catch(next);
});

app.listen(8800, function() {
  console.log("Listening on port 8800");
});
