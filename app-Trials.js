const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req,res) => {
    const products = {
        id: 1,
        Name: 'umang',
        Work: 'business'
    }
    res.send(products);
})
app.post('/', (req, res) => {
    const products1  = req.body;
    console.log("post", products1);
    res.send(products1);
})
app.listen(3000, () => {
    console.log('Server is running at localhost:3000')
})