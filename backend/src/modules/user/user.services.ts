import type UserRepository from './user.repo';
import {
  createUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  updateUserSchema,
} from "./user.validations";
import ErrorHandling from '../../helpers/error-handling';

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get all users
   */
  public async getAllUsers(is_admin?: boolean): Promise<IDataResponse<IUser[]>> {
    // validate status if provided with zod
    if (is_admin) {
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
  public async createUser(userData: IUserInsertDTO): Promise<IDataResponse<IUser>> {
    const validation = createUserSchema.safeParse(userData);
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const validatedData: IUserInsertDTO = {
      email: validation.data.email,
      user_name: validation.data.user_name,
      is_admin: validation.data.is_admin,
      password: validation.data.password,
    };


    /* 
    
    hashing the password // i dont remember the syntax
    
    */

    return this.userRepository.createUserRepo(validatedData);
  }

  /**
   * Update a user by ID
   */
  public async updateUserById(
    userId: number,
    updateData: IUserUpdateDTO,
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

    const validatedData: IUserUpdateDTO = {
      email: validation.data.email,
      user_name: validation.data.user_name,
      is_admin: validation.data.is_admin,
      password: validation.data.password,
    };

    return this.userRepository.updateUserByIdRepo(userId, validatedData);
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
