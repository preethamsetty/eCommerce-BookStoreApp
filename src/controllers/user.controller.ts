import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';

class UserController {
  public UserService = new userService();

  // Register user
  public registerUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      await this.UserService.registerUser(req.body as IUser);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'User registered successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error.message}`,
      });
    }
  };

  // Register admin
  public registerAdmin = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      await this.UserService.registerUser(req.body as IUser, 'admin');
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Admin registered successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error.message}`,
      });
    }
  };

  // Log in user
  public loginUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data =
        await this.UserService.loginUser(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Log in successful',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.UNAUTHORIZED,
        message: `${error.message}`,
      });
    }
  };
  public getUserDataById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
      try {
          const data = await this.UserService.getUserDataById(req.body.userId);
              res.status(HttpStatus.OK).json({
                  code: HttpStatus.OK,
                  message: 'Data fetched successfully',
                  data
              });
          } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                Error: error.message,
            });
          }
    }
  //Forgot Password
  public forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      await this.UserService.forgotPassword(req.body.email);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Reset token sent to email successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error.message}`,
      });
    }
  };

  // Reset User password
  public resetPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await this.UserService.resetPassword(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: `Password updated successfully for ${req.body.email}, you 
               can login through your updated password`,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error.message}`,
      });
    }
  };

  public refreshtoken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.header("Authorization")?.split(" ")[1];
  
      if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: "Refresh token is required",
        });
        return;
      }
      const newAccessToken = 
      await this.UserService.refreshToken(refreshToken);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: { accessToken: newAccessToken },
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
  
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message || "Failed to refresh token",
      });
    }
  };
  
  
  //update the user details along with Profile Image
  public updateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { firstName, lastName } = req.body;
      const updateData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      };
      const updatedUser =
      await this.UserService.updateUser(req.body.userId, updateData, req.file?.path);
      
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
}

export default UserController;
