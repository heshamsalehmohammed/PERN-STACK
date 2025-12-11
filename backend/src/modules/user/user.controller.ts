import type { Request, Response } from 'express';

import type UserService from './user.services';

export default class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Get all users
   */
  public getAllUsersController = async (
    req: Request<Request, unknown, string>,
    res: Response<IDataResponse<IUser[]>>,
  ): Promise<void> => {
    // get isAdmin from query params
    const isAdmin = req.query.is_admin as boolean | undefined;
    const result = await this.userService.getAllUsers(isAdmin);
    res.status(result.success ? 200 : 400).json(result);
  };

  /**
   * Get user by ID
   */
  public getUserByIdController = async (
    req: Request<{ userId: string }>,
    res: Response<IDataResponse<IUser>>,
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.getUserById(userId);
    res.status(result.success ? 200 : 404).json(result);
  };

  /**
   * Create a new user
   */
  public createUserController = async (
    req: Request<unknown, unknown, IUserInsertDTO>,
    res: Response<IDataResponse<IUser>>,
  ): Promise<void> => {
    const result = await this.userService.createUser(req.body);

    res.status(result.success ? 201 : 400).json(result);
  };

  /**
   * Update a user by ID
   */
  public updateUserByIdController = async (
    req: Request<{ userId: string }, unknown, IUserUpdateDTO>,
    res: Response<IDataResponse<IUser>>,
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.updateUserById(userId, req.body);
    res.status(result.success ? 200 : 400).json(result);
  };

  /**
   * Delete a user by ID
   */
  public deleteUserByIdController = async (
    req: Request<{ userId: string }>,
    res: Response<IBasicResponse>,
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.deleteUserById(userId);
    res.status(result.success ? 200 : 404).json(result);
  };
}
