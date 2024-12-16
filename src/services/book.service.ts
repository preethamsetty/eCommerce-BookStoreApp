import Book from '../models/book.model';
import { IBook } from '../interfaces/book.interface';

class BookService {

  //get book by id
  public getBookById = async (bookId: string): Promise<IBook | null> => {
    const book = await Book.findById(bookId); 
    return book;
  };
  
  // Get all user books
  public getBooks = async (): Promise<IBook[]> => {
    const allBooks= await Book.find();
    if(allBooks.length===0)
        throw new Error("No Books Present")
    else
        return allBooks
  };

}

export default BookService;