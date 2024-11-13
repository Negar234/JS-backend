var http = require('http');
var fs = require('fs');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var port = 50000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
/*app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
*/
app.get('/', (req, res) => {
    fs.readFile('industrial.json', function(err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error loading index.html');
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            //console.log(data);
            res.end(data);
        }
    });
});

app.post('/order', (req, res) => {
    var d = new Date();
    var mysql = require('mysql');
    const order = req.body;
    var orderId = 0;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database:"amjadi"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO orders (OrderDate,Username) VALUES ('"+d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+"', '"+order.username+"')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                orderId = result.insertId;
                
            });
        });
    order.basket.forEach(record=>{
       // con.connect(function(err) {
         //   if (err) throw err;
           // console.log("Connected!");
            var sql = "INSERT INTO order_items (OrderID,ProductArticleNumber,Price) VALUES ("+orderId+",'"+record.prArticleNumber+"' , " +record.price.replace("$","")+")";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(record.prArticleNumber+" was inserted!");
                
            });
       // });
        
    })

    console.log('fff');
    
/*
    

    */
    res.end("Order was Registered!");
});

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});
