import { Types } from "mongoose";
import { IUser } from "../User/user.interface";

export type TAccess = "user" | "owner" | "restaurant" | "settings";

export interface IAdmin {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

export interface IAdministratorPayload {
    administratorData: IUser,
    access: TAccess[]
}


export type TAdministratorQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
};

export type TUpdateAdministrator = {
  fullName?: string;
  phone?: string;
}