import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import WishlistService from "../services/wishlist.service";
import redisClient from "../config/redisClient";

class WishlistController {
  public wishlistService = new WishlistService();

  public addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const { BookId } = req.params; 
      const { userId } = req.body; 
  
      const wishlist = await this.wishlistService.addToWishlist(userId, BookId);

      // Clear cache for the user's wishlist
      await redisClient.del( `wishlist:${userId}`);
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Book added to wishlist successfully',
        data: wishlist,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };

  public removeFromWishlist = async (req: Request, res: Response): Promise<void> =>  {
    try {
      const { BookId } = req.params; 
      const { userId } = req.body; 
  
      const wishlist = await this.wishlistService.removeFromWishlist(userId, BookId);

      // Clear cache for the user's wishlist
      await redisClient.del( `wishlist:${req.body.userId}`);
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Book Removed From wishlist successfully',
        data: wishlist,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

  };

  // Get Wishlist
  public getWishlist = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
      const { userId } = req.body;
      const wishlist = await this.wishlistService.getWishlist(userId);
  
      // Cache the wishlist data
      const cacheKey = `wishlist:${userId}`;
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(wishlist));
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: "Wishlist retrieved successfully",
        data: wishlist,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  };
  
}

export default WishlistController;
