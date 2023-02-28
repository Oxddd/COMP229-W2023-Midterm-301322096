// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});


//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    book.find( (err, books) => {
      if (err) {
        return console.error(err);
      }
      else {
        res.render('books/details', {
          title: 'Books',
          books: books
        });
      }
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    // validate request
    if(!req.body){
      res.status(400).send({ message : "Content can not be emtpy!"});
      return;
    }

  // new user
  const bk = new book({
      Title : req.body.title,
      Price : req.body.price,
      Author: req.body.author,
      Genre : req.body.genre
  })

  console.log(req.body.title);

  // save user in the database
  bk
      .save(bk)
      .then(data => {
          //res.send(data)
          res.redirect('/books');
      })
      .catch(err =>{
          res.status(500).send({
              message : err.message || "Some error occurred while creating a create operation"
          });
      });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/

    const id = req.params.id;
    //console.log(id)
    book.findById(id)
      .then(data =>{
        if(!data){
          res.status(404).send({ message : "Not found user with id "+ id})
        }else{
          res.render('books/details', { title: 'Edit Book', books: data })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user with id " + id})
      })

});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    const id = req.params.id;
    const updatedBook = book({
      _id: id,
      Title : req.body.title,
      Price : req.body.price,
      Author: req.body.author,
      Genre : req.body.genre
    });
  
    book.updateOne({ _id: id }, updatedBook, (err) => {
      if (err) {
        console.log(err);
        res.end(err);
      }
      else {
        // refresh the book list
        res.redirect('/books');
      }
    });


});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    console.log("delete");
    let id = req.params.id;


    book.remove({ _id: id }, (err) => {
      if (err) {
        console.log(err);
        res.end(err);
      }
      else {
        // refresh the book list
        res.redirect('/books');
      }
    });

});


module.exports = router;
