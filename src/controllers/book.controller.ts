import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import redisClient from '../config/redisClient';
import BookService from '../services/book.service';

class BookController{
    private BookService = new BookService();

    // Create a book
    public createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          const bookData = req.body; // Book data from the request body
          const data = await this.BookService.createBook(bookData);

           // Clear cache after note update
            await redisClient.del(`books`);

          res.status(HttpStatus.CREATED).json({
              code: HttpStatus.CREATED,
              message: 'Book created successfully',
              data,
          });
      } catch (error) {
          res.status(HttpStatus.BAD_REQUEST).json({
              code: HttpStatus.BAD_REQUEST,
              message: error.message,
              error: error,
          });
      }
  };

    //Get Book by id
    public  getBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookId = req.params.id;
            const data = await this.BookService.getBook((bookId));
            // Clear cache after note update
            await redisClient.del(`books`);
              res.status(HttpStatus.OK).json({
                  code: HttpStatus.OK,
                  message: 'Book fetched successfully',
                  data
                });
            } catch (error)  {
              res.status(HttpStatus.BAD_REQUEST).json({
                  code: HttpStatus.BAD_REQUEST,
                  Error: error.message,
              });
            }
      };

    // Get Books
    public getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = Number(req.query.page) || 1; // Default to page 1
    const limit = Number(req.query.limit) || 16; // Default to 16 items per page
    const cacheKey = `books:page=${page}:limit=${limit}`;
  
    try {
      // Check cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: JSON.parse(cachedData),
          message: 'Books fetched successfully (from cache)',
        });
        return;
      }
  
      // Fetch from database if not in cache
      const data = await this.BookService.getBooks(page, limit);
  
      // Cache the fetched books data
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Books fetched successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        Error: error.message,
      });
    }
  };


    //Get All Serched User Books 
    public getSearchedBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = await this.BookService.getSearchedBooks(req.query.searchQuery, req.params.page);
      try {
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data,
          message: 'Books fetched successfully'
        });
      } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            code: HttpStatus.BAD_REQUEST,
            Error: error.message,
        });
      }
    };

  //Upadate By Id
  public updateBookInfoById = async(req:Request, res:Response ,next:NextFunction):Promise<void> =>{
    const bookId = req.params.id;
    const data= await this.BookService.updateBookInfoById(bookId,req.body);
    try {
      // Clear cache after note update
      await redisClient.del(`books`);

      res.status(HttpStatus.ACCEPTED).json({
        code :HttpStatus.ACCEPTED,
        data,
        message: "Book Updated Successfully"
      });
    } catch(error){
      res.status(HttpStatus.BAD_REQUEST).json({
        code:HttpStatus.BAD_REQUEST,
        Error: error.message
      })
    }

  }

      // Delete a Book by id
      public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const bookId = req.params.id;
        try {
          await this.BookService.deleteBookById(bookId);
           // Clear cache after note update
           await redisClient.del(`books`);

        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: 'Book deleted successfully',
        });
        } catch (error) {
          res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          Error: error.message,
        });
  } 
};

// Sort and Paginate Books by Price API
public sortBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = (req.query.order as string) || 'asc'; 
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 16; 

    if (order !== 'asc' && order !== 'desc') {
      res.status(400).json({
        code: 400,
        message: "Invalid 'order' value. Use 'asc' or 'desc'.",
      });
    }

    const books = await this.BookService.sortBooks(order, page, limit);
    res.status(200).json({
      code: 200,
      message: 'Books sorted successfully',
      data: books.data,
      pagination: books.pagination,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Failed to sort books',
      error: error.message,
    });
  }
};

}

export default BookController;
