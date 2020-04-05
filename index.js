const express  = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

let dbClient;

app.use("/static", express.static(__dirname + '/public'));

mongoClient.connect((err, client) => {
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db('maximdb').collection('user');
    app.listen(3000, () => {
        console.log("Сервер ожидает подключения...");
    })
});

app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/api/users', (req, res) => {
   const collection = req.app.locals.collection;
   collection.find({}).toArray((err, users) => {
       if (err) return console.log(err);
       res.send(users)
   })
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
