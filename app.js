//importing dependencies 
const express = require("express") 
const app=express(); 
const path = require('path');
var bodyParser=require("body-parser"); 

// Calling form.js from models 
var Form=require("./models/form"); 

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

//middlewares 
app.set('view engine','ejs'); 
app.use(bodyParser.urlencoded({extended:true})); 

//rendering form.ejs 
app.get("/",function(req,res){ 
	res.render("form"); 
}); 

// Handling registration form submission 
app.post("/register", function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password; // Make sure to handle password securely

    // Create a new user with the form data
    var newUser = { username: username, email: email, password: password };
    console.log(newUser); //Ignore the plaintext password for now - would be fixed soon

    // Handle registration logic (authentication)
    // For now, just a placeholder response; add MongoDB for future implementation
    res.send("Register logic not implemented yet.");
});

// Handling login form submission 
app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    // Handle login logic (authentication)
    // For now, just a placeholder response; add MongoDB for future implementation
    res.send("Login logic not implemented yet.");
});

// Starting the server at port 3000 
app.listen(3000, function() { 
	console.log('Server running on port 3000'); 
}); 
