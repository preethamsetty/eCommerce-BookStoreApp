import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import BookService from '../services/book.service';

class BookController{
    private BookService = new BookService();
    
  //Get Book by id
    public  getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookId = req.params.id;
            const data = await this.BookService.getBookById((bookId));
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
  
  //Get All Books 
    public getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = await this.BookService.getBooks();
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
}

export default BookController;
