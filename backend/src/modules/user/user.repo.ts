import User from './user.model';
import appDataSource from '../../database/orm-config';
import ErrorHandling from '../../helpers/error-handling';

export default class UserRepository {
  private readonly manager = appDataSource.manager;

  /**
   * Get all users
   */
  public async getAllUsersRepo(is_admin?: boolean): Promise<IDataResponse<IUser[]>> {
    // if status pass it as where condition
    try {
      const users = await this.manager.find(User, {
        where: { is_admin },
      });
      return {
        success: true,
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Get user by ID
   */
  public async getUserByIdRepo(userId: number): Promise<IDataResponse<IUser>> {
    try {
      const user = await this.manager.findOne(User, {
        where: { user_id: userId },
      });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return {
        success: true,
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Create a new user
   */
  public async createUserRepo(
    userData: IUserInsertDTO,
  ): Promise<IDataResponse<IUser>> {
    try {
      const savedUser = await this.manager.save(User, userData);
      return {
        success: true,
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Update a user by ID
   */
  public async updateUserByIdRepo(
    userId: number,
    updateData: IUserUpdateDTO,
  ): Promise<IDataResponse<IUser>> {
    try {
      const user = await this.manager.findOne(User, {
        where: { user_id: userId },
      });
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      await this.manager.update(User, { user_id: userId }, updateData);

      const updatedUser = await this.manager.findOne(User, {
        where: { user_id: userId },
      });
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser!,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Delete a user by ID
   */
  public async deleteUserByIdRepo(userId: number): Promise<IBasicResponse> {
    try {
      const user = await this.manager.findOne(User, {
        where: { user_id: userId },
      });
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      await this.manager.delete(User, { user_id: userId });
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }
}
