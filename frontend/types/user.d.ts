interface IUser extends IBase {
  user_id: number;
  user_name: string;
  email: string;
  is_admin: boolean;
  password: string;
}

interface IUserInsertDTO extends Omit<IUser, "user_id"> {
  user_id?: number;
}


interface IUserUpdateDTO extends Partial<Omit<IUser, "user_id">> {}