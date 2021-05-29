const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config') // to get value from .env file

app.use(cors());
app.options('*', cors());

//Middleware methods
app.use(bodyParser.json());
app.use(morgan('tiny')); //useful to dispaly log request in specific format

//Routers
const productsRoutes = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');
const categoriesRoutes = require('./routers/categories');
const sndRouters = require('./routers/snds');

const api = process.env.API_URL;

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/categories`, categoriesRoutes);

app.use(`${api}/snds`, sndRouters);

//Connecting to DB with mongodb atlas(cloud) and mongoose
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
}).then(()=>{
    console.log('Database connected successfully!')
}).catch((err)=>{
    console.log(err);
})

//Server connection
app.listen(3000, () => {
    console.log('Server is running at localhost:3000')
})
