import appDataSource from "../../database/orm-config";
import ErrorHandling from "../../helpers/error-handling";
import User from "./user.model";

export default class UserRepository {
  private readonly manager = appDataSource.manager;


  public async getAllUsersRepo(): Promise<IDataResponse<IUser[]>> {
    try {
      const users = await this.manager.find(User, {
        order: { created_at: "DESC" },
      });

      return {
        success: true,
        message: "Users fetched successfully",
        data: users,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  public async getUserByIdRepo(userId: number): Promise<IDataResponse<IUser>> {
    try {
      const user = await this.manager.findOne(User, {
        where: { user_id: userId },
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }


  public async getUserByEmailRepo(
    email: string
  ): Promise<IDataResponse<IUser>> {
    try {
      const user = await this.manager.findOne(User, {
        where: { email },
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }


  public async createUserRepo(
    userData: Omit<IUser, "user_id">
  ): Promise<IDataResponse<IUser>> {
    try {
      const savedUser = await this.manager.save(User, userData);
      return {
        success: true,
        message: "User created successfully",
        data: savedUser,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }


  public async updateUserByIdRepo(
    userId: number,
    updateData: Partial<IUser>
  ): Promise<IDataResponse<IUser>> {
    try {
      const existing = await this.manager.findOne(User, {
        where: { user_id: userId },
      });

      if (!existing) {
        return { success: false, message: "User not found" };
      }

      await this.manager.update(User, { user_id: userId }, updateData);

      const updatedUser = await this.manager.findOne(User, {
        where: { user_id: userId },
      });

      return {
        success: true,
        message: "User updated successfully",
        data: updatedUser!,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }


  public async deleteUserByIdRepo(userId: number): Promise<IBasicResponse> {
    try {
      const user = await this.manager.findOne(User, {
        where: { user_id: userId },
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      await this.manager.delete(User, { user_id: userId });

      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }
}
