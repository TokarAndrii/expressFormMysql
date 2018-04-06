const express = require('express');
const app = express();
let router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
var multer = require('multer');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var upload = multer();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(require('connect-livereload')({
    port: 3001
    //ignore: ['.js', '.svg']
}));


app.listen(3001);

app.get('/', function (req, res) {
    res.render('index', {title: 'Express'});

});


app.post('/', upload.array(), function (req, res, next) {
    console.log(`Data from html - name: ${req.body.user}, tel: ${req.body.tel}, email: ${req.body.email}, message: ${req.body.message}`);
    connection.connect(function (err) {
        if (err) throw err;
        console.log('You are now connected...');

        connection.query('CREATE TABLE IF NOT EXISTS users(id int primary key NOT NULL AUTO_INCREMENT, name varchar(255),email varchar(255), tel varchar(255), message text)',
            function (err, result) {
            if (err) throw err;
            connection.query('INSERT INTO users (name, email,tel, message) VALUES (?, ?, ?, ?)', [req.body.name, req.body.email, req.body.tel, req.body.message],
                function (err, result) {
                    if (err) throw err;
                    connection.query('SELECT * FROM users', function (err, results) {
                        if (err) throw err;
                        console.log(results[0].id);
                        console.log(results[0].name);
                        console.log(results[0].email);
                        console.log(results[0].tel);
                        console.log(results[0].message)
                    })
                })
        })
    });
});

app.post('/', function (req,res) {

});


