import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import CartService from '../services/cart.service';


class CartController {
  public CartService = new CartService();

  // Add Book to Cart
  public addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try{
    const data = await this.CartService.addToCart(req.body.userId, req.params.BookId)
    res.status(HttpStatus.OK).json({
      code : HttpStatus.OK,
      data : data
    })
    }
    catch(error){
      res.status(HttpStatus.BAD_REQUEST).json({
        code : HttpStatus.BAD_REQUEST,
        error : error.message
      })
    }
  };

  // Update the Quantity
  public updateQuantity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const quantityChange = req.body.quantityChange; 
      const data = await this.CartService.updateQuantity(
        req.body.userId,
        req.params.BookId,
        quantityChange
      );
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };
  
  //Remove Book from Cart
  public removeItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body; 
      const { BookId } = req.params;
  
      const data = await this.CartService.removeItem({ userId }, BookId);
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };

  public deleteCart = async(
    req:Request,
    res:Response,
    next:NextFunction
  ):Promise<void> =>{
    try {
      const data = await this.CartService.deleteCart(req.body.userId);
      res.status(HttpStatus.OK).json({
        code : HttpStatus.OK,
        data : data ,
        message :"Cart Deleted Successfully"
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code : HttpStatus.BAD_REQUEST,
        error : error.message
      })
    }
  }
  // Get Cart
  public getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.CartService.getCart(req.body.userId);
      res.status(HttpStatus.OK).json({
        code : HttpStatus.OK,
        data : data ,
        message: "Cart Details",
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };
}


export default CartController;
