const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override')

// custom Routes
const authRouter = require('./routers/userRouter');
const homeRouter = require('./routers/homeRouter');
const categoryRouter = require('./routers/catRouter.js');
const courseRouter = require('./routers/courseRouter.js');
const purchaseRouter = require('./routers/purchaseRouter.js');
const lectureRouter = require('./routers/lectureRouter.js');
// ...

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayouts);
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(fileUpload());

// mongo connection
// mongoose.connect(
//     'mongodb://localhost:27017/educationalapp',
//     {
//         useNewUrlParser: true,

//         useUnifiedTopology: true
//     }
// );

// const db = mongoose.connection;
// db.on('error', error => console.log(error))
// db.once('open', () => console.log('connected to mongodb'));
// ...

//production configs!
// i'm putting it here intentionally!
mongoose.connect("mongodb+srv://admin-Ahsan:UYjdUQrEsTo5pPFy@cluster0.xa5t5.mongodb.net/educationalapp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
    // useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to mongodb'));



// const uri = "";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//...
app.get('/', (req,res)=>{
    res.send('Welcome to Educatonal admin panel, please visit https://couse-admin-panel/api/auth/login');
});
// app.use
app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/category", categoryRouter);
app.use("/api/course", courseRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/lecture", lectureRouter);
// ...

// app listener
// app.listen(process.Port , () => console.log('EducationalApp server started at Port' + `process.Port`));
app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log("Server is running.");
});
