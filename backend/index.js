const admin = require("./routes/admin");
const cms = require("./routes/cms")
const express = require('express');
const cors = require('cors')
// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
// const https = require('https');
// const fs = require('fs');

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };






const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
// app.use(redirectToHTTPS());

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors())

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

app.use('/admin', cors(corsOptions), admin);
app.use('/cms', cors(corsOptions), cms)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${ PORT }`);
});

// https.createServer(options, function (req, res) {
//   res.writeHead(200);
//   console.log(`server is running on port ${ PORT }`);
// }).listen(5000);


// app.listen(5000, ()=>{
//     console.log("server is listning on port 5000");
// });