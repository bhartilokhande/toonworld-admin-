const admin = require("./routes/admin");
const cms = require("./routes/cms")
const express = require('express');
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const  mongoose = require('mongoose')

mongoose
  .connect('mongodb+srv://roshan:user12@cluster0.uoxgo.mongodb.net/toonworld?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to the Database successfully');
  }).catch((err)=>{
    console.log(err);
  })

app.use('/admin',admin);
app.use('/cms', cms)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${ PORT }`);
});

// app.listen(5000, ()=>{
//     console.log("server is listning on port 5000");
// });