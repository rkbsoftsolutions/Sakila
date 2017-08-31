var  express =require('express');
var path =require('path');
const app = express();
var bodyParser = require('body-parser');




app.use(express.static('www'))
app.use(bodyParser.json())



app.use("/node",(req,res)=>{
    res.send("hello how are you")
})
app.listen(3000);
console.log('listening on port 3000');


