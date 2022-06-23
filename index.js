
const express = require('express'); 
const app = express(); 
const cors = require('cors');
const Razorpay = require('razorpay');
//const dotenv = require('dotenv');
const mongoose = require('mongoose');

const router = require('./routes/routes'); 

require('dotenv').config(); 


app.use(cors());
app.use(express.json());



mongoose.connect('mongodb+srv://dbuser:dbuser@cluster0.yruaf.mongodb.net/?retryWrites=true&w=majority'); 

mongoose.connection.on('open', function () {
    console.log('db connected...')
})


app.use('/api/v1', router); 

var instance = new Razorpay({ key_id: 'rzp_test_obMCtlKp3EEqKX', key_secret: 'HJmwrAqZCfXxzoEXtZa1jMXd', });

app.post('/order', function (req, res) {
    console.log(req.body.data)

    


    var options = {
        amount: 500,  // amount in the smallest currency unit
        currency: "INR",
        receipt: 'rz_order_101'
    };

    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.status(200).json({ order })
    });

})



app.listen(process.env.PORT, function () {
    console.log('backend is up and running'); 
})