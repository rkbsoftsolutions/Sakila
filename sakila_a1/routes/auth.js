var express=require("express")
var routes=express.Router()
var auth=require('../api/auth-api')

routes.post("/",function(req,res){
     var body=req.body;
     console.log(body);
     auth.login(body).then(function (response) {
         res.status(200).json(response)
     })
         .catch(function (error) {
            res.status(500).json(error)
        })
});


module.exports=routes