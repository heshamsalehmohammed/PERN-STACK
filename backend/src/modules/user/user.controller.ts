import type { Request, Response } from "express";

import type UserService from "./user.services";
import { config } from "../../config/general.config";

const isProd = process.env.NODE_ENV === "production";


export default class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public loginUserController = async (
    req: Request<unknown, unknown, { email: string; password: string }>,
    res: Response<IDataResponse<{ user: ISignedPayload }>>
  ): Promise<void> => {
    const { email, password } = req.body;

    const result = await this.userService.loginUser(email, password);

    if (!result.success || !result.data) {
      res.status(401).json({
        success: false,
        message: result.message ?? "Login failed",
      });
      return;
    }

    const { token, user } = result.data;

    // Cookie name must match your authentication middleware: req.cookies.token
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: config.jwtOptions.expireTime * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    });
  };

  public registerUserController = async (
    req: Request<unknown, unknown, { email: string; password: string }>,
    res: Response<IDataResponse<{ user: ISignedPayload }>>
  ): Promise<void> => {
    const { email, password } = req.body;

    const result = await this.userService.registerUser(email, password);

    if (!result.success || !result.data) {
      res.status(400).json({
        success: false,
        message: result.message ?? "Registration failed",
      });
      return;
    }

    const { token, user } = result.data;

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: config.jwtOptions.expireTime * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user },
    });
  };

  public logoutUserController = async (
    _req: Request,
    res: Response<IBasicResponse>
  ): Promise<void> => {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  };

  public getCurrentUserController = async (
    _req: Request,
    res: Response<IDataResponse<ISignedPayload>>
  ): Promise<void> => {
    const payload = res.locals.jwtPayload as ISignedPayload | undefined;

    if (!payload) {
      res
        .status(401)
        .json({ success: false, message: "Unauthenticated: no JWT payload" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: payload,
    });
  };

  public getAllUsersController = async (
    _req: Request,
    res: Response<IDataResponse<IUser[]>>
  ): Promise<void> => {
    const result = await this.userService.getAllUsers();
    res.status(result.success ? 200 : 400).json(result);
  };

  public getUserByIdController = async (
    req: Request<{ userId: string }>,
    res: Response<IDataResponse<IUser>>
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.getUserById(userId);
    res.status(result.success ? 200 : 404).json(result);
  };

  public createUserController = async (
    req: Request<unknown, unknown, IUserInsertDTO>,
    res: Response<IDataResponse<IUser>>
  ): Promise<void> => {
    const result = await this.userService.createUser(req.body);
    res.status(result.success ? 201 : 400).json(result);
  };

  public updateUserByIdController = async (
    req: Request<{ userId: string }, unknown, IUserUpdateDTO>,
    res: Response<IDataResponse<IUser>>
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.updateUserById(userId, req.body);
    res.status(result.success ? 200 : 400).json(result);
  };

  public deleteUserByIdController = async (
    req: Request<{ userId: string }>,
    res: Response<IBasicResponse>
  ): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const result = await this.userService.deleteUserById(userId);
    res.status(result.success ? 200 : 404).json(result);
  };
}
