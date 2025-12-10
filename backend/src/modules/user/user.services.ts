import * as bcrypt from "bcrypt";

import UserRepository from "./user.repo";
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.validations";
import ErrorHandling from "../../helpers/error-handling";
import JwtMethods from "../../utils/jwt.methods";
import { UserPermissionEnum } from "./user.const";

// Use env var for salt rounds, with a safe default
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export default class UserService {
  private readonly userRepository: UserRepository;
  private readonly jwtMethods: JwtMethods;

  constructor(
    userRepository: UserRepository,
    jwtMethods: JwtMethods = new JwtMethods()
  ) {
    this.userRepository = userRepository;
    this.jwtMethods = jwtMethods;
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<IDataResponse<IUser[]>> {
    return this.userRepository.getAllUsersRepo();
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: number): Promise<IDataResponse<IUser>> {
    const validation = userIdSchema.safeParse({ user_id: userId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.userRepository.getUserByIdRepo(userId);
  }

  /**
   * Create/register a new user
   * (You can restrict this to master/admin via controller/route/middleware)
   */
  public async createUser(
    userData: IUserInsertDTO
  ): Promise<IDataResponse<IUser>> {
    const validation = createUserSchema.safeParse(userData);
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const { email, password, role, permissions, is_active } = validation.data;

    // hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const toSave: Omit<IUser, "user_id"> = {
      email,
      password_hash,
      role,
      permissions: permissions ?? [],
      is_active: is_active ?? true,
      // Base fields (created_at, updated_at) handled by Base model
    } as Omit<IUser, "user_id">;

    return this.userRepository.createUserRepo(toSave);
  }

  /**
   * Update a user by ID
   */
  public async updateUserById(
    userId: number,
    updateData: IUserUpdateDTO
  ): Promise<IDataResponse<IUser>> {
    const idValidation = userIdSchema.safeParse({ user_id: userId });
    if (!idValidation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(idValidation.error),
      };
    }

    const validation = updateUserSchema.safeParse(updateData);
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const { email, password, role, permissions, is_active } = validation.data;

    const partial: Partial<IUser> = {};

    if (email !== undefined) partial.email = email;
    if (role !== undefined) partial.role = role;
    if (permissions !== undefined) partial.permissions = permissions;
    if (is_active !== undefined) partial.is_active = is_active;

    if (password) {
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      partial.password_hash = password_hash;
    }

    return this.userRepository.updateUserByIdRepo(userId, partial);
  }

  /**
   * Delete user by ID
   */
  public async deleteUserById(userId: number): Promise<IBasicResponse> {
    const validation = userIdSchema.safeParse({ user_id: userId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.userRepository.deleteUserByIdRepo(userId);
  }

  /**
   * Login user: validate credentials and return JWT + user
   */
  public async loginUser(
    email: string,
    password: string
  ): Promise<IDataResponse<{ token: string; user: ISignedPayload }>> {
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const userResult = await this.userRepository.getUserByEmailRepo(email);
    if (!userResult.success || !userResult.data) {
      return { success: false, message: "Invalid credentials" };
    }

    const user = userResult.data;

    if (!user.is_active) {
      return { success: false, message: "User is not active" };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const payload: ISignedPayload = {
      id: String(user.user_id),
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    // JwtMethods now handles expiresIn using config.jwtOptions.expireTime
    const token = this.jwtMethods.signToken(payload);

    return {
      success: true,
      message: "Login successful",
      data: { token, user: payload },
    };
  }

  /**
   * Public registration (self-signup) and login
   */
  public async registerUser(
    email: string,
    password: string
  ): Promise<IDataResponse<{ token: string; user: ISignedPayload }>> {
    // Basic validation (reusing loginSchema)
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    // Check if email already exists
    const existing = await this.userRepository.getUserByEmailRepo(email);

    if (existing.success && existing.data) {
      return {
        success: false,
        message: "Email is already registered",
      };
    }

    // Use createUser with forced defaults
    const createResult = await this.createUser({
      email,
      password,
      role: "user",
      permissions: [
        UserPermissionEnum.CAN_VIEW_TODO,
        UserPermissionEnum.CAN_EDIT_TODO,
        UserPermissionEnum.CAN_ADD_TODO
      ],
      is_active: true,
    });

    if (!createResult.success || !createResult.data) {
      return {
        success: false,
        message: createResult.message ?? "Failed to register user",
      };
    }

    const user = createResult.data;

    const payload: ISignedPayload = {
      id: String(user.user_id),
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const token = this.jwtMethods.signToken(payload);

    return {
      success: true,
      message: "User registered successfully",
      data: { token, user: payload },
    };
  }
}
