const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;
    
    const member_data = {
        "email_address" : email,
        "status" : "subscribed",
        "merge_fields" : {
            "FNAME" : fName,
            "LNAME" : lName
        }
    }

    const JSON_data = JSON.stringify(member_data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/fc6f4542fd/members";
    const options = {
        method : "POST",
        auth : "prasanth:" + process.env.API_KEY
    };

    const reqst = https.request(url,options,function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            console.log(response.statusCode);
            res.sendFile(__dirname + "/failure.html");
        }
    });
    reqst.write(JSON_data);
    reqst.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || "3000",function(){
    console.log("the server is at port 3000");
});
