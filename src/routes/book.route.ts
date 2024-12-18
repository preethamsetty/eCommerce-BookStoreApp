import express, { IRouter } from 'express';
import BookController from '../controllers/book.controller';

class BookRoutes {
  private router = express.Router();
  private BookController = new BookController();

  constructor() {
    this.routes();
  }

  private routes = (): void => {

    // Getting all user books 
    this.router.get('/', this.BookController.getBooks); 

    // Route to get a book by id
    this.router.get('/:id', this.BookController.getBookById);

    //Update by id
    this.router.put('/:id',this.BookController.updateBookInfoById)
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default BookRoutes;
