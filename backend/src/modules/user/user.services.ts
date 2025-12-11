import type UserRepository from "./user.repo";
import {
  createUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  updateUserSchema,
} from "./user.validations";
import ErrorHandling from "../../helpers/error-handling";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get all users
   */
  public async getAllUsers(
    is_admin?: boolean
  ): Promise<IDataResponse<IUser[]>> {
    // validate status if provided with zod
    if (is_admin !== undefined) {
      const validation = createUserSchema.shape.is_admin.safeParse(is_admin);
      if (!validation.success) {
        return {
          success: false,
          message: ErrorHandling.getErrorMessage(validation.error),
        };
      }
    }
    return this.userRepository.getAllUsersRepo(is_admin);
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: number): Promise<IDataResponse<IUser>> {
    const validation = getUserByIdSchema.safeParse({ user_id: userId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.userRepository.getUserByIdRepo(userId);
  }

  /**
   * Create a new user
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

    const password_hash = await bcrypt.hash(
      validation.data.password,
      SALT_ROUNDS
    );

    const validatedData: IUserInsertDTO = {
      email: validation.data.email,
      user_name: validation.data.user_name,
      is_admin: validation.data.is_admin,
      password: password_hash,
    };

    return this.userRepository.createUserRepo(validatedData);
  }

  /**
   * Update a user by ID
   */
  public async updateUserById(
    userId: number,
    updateData: IUserUpdateDTO
  ): Promise<IDataResponse<IUser>> {
    const idValidation = getUserByIdSchema.safeParse({ user_id: userId });
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

    const { email, password, user_name,is_admin } = validation.data;

    const partial: Partial<IUser> = {};

    if (email !== undefined) partial.email = email;
    if (user_name !== undefined) partial.user_name = user_name;
    if (is_admin !== undefined) partial.is_admin = is_admin;

    if (password) {
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      partial.password = password_hash;
    }
    return this.userRepository.updateUserByIdRepo(userId, partial);
  }

  /**
   * Delete a user by ID
   */
  public async deleteUserById(userId: number): Promise<IBasicResponse> {
    const validation = deleteUserSchema.safeParse({ user_id: userId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.userRepository.deleteUserByIdRepo(userId);
  }
}
