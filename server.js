console.log('May the Node be with you!')
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
require("dotenv").config()
const connectionString = process.env.DB_KEY;

// ========================
// Link to Database
// ========================

app.listen(3000, function() {
    console.log('listening on 3000')
  })

  // MongoClient.connect('mongodb-connection-string', (err, client) => {
  //   // ... do something here
  // })

  // MongoClient.connect('mongodb+srv://jeffcrud:wekancrud22@learning-crud.e1tjd.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
  //   if (err) return console.error(err)
  //   console.log('Connected to Database')
  // })

  MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes') //changing the database
    const quotesCollection = db.collection('quotes')
  // }) ---- This syntax caused a massive error that was fixed after it was moved to the bottom of the page after app.post at this point in time.  Also the catch error below was removed after looking at zellwk github crud demo.
  // .catch(error => console.error(error))


// ========================
// Middlewares
// ========================
    app.set('view engine', 'ejs') // <=== This one HAS to be before use,get,post,ect..
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

//   app.get('/', (req, res) => {
//     res.send('Hello World')
//   })

// ========================
// Routes
// ========================

    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    

// app.get('/', (req, res) => {
//   const cursor = db.collection('quotes').find()
//   console.log(cursor)
//   // ...


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
    // Note: __dirname is the current directory you're in. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
  })

  // app.post('/quotes', (req, res) => {
  //   console.log(req.body)
  // })

  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
      .catch(error => console.error(error))
  })

  app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { name: 'Yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))
  })

  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name }
    )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
      })
      .catch(error => console.error(error))
  })
})

