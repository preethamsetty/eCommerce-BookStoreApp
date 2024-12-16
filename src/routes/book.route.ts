import express, { IRouter } from 'express';
import BookController from '../controllers/book.controller';


class BookRoutes {
  private router = express.Router();
  private BookController = new BookController();

  constructor() {
    this.routes();
  }

  private routes = (): void => {

    // Route to get a book by id
    this.router.get('/:id', this.BookController.getBookById);

    // Getting all user books 
      this.router.get('/', this.BooksController.getBooks); 
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default BookRoutes;