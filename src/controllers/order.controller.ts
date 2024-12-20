import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/order.service';

class OrderController {

  public OrderService = new OrderService();

    // Order from cart
    public orderCart = async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
        try{
            const data = await this.OrderService.orderCart(req.body.userId)
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


        // Get orders
        public getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const userId = req.params.userId;
                const orders = await this.OrderService.getOrder(userId);
                res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                data: orders,
            });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
            code: HttpStatus.BAD_REQUEST,
            error: error.message,
        });
    }
};
    };



export default OrderController;
