
import { DepartmentModel } from "./department";

export interface Product {
  name: string;
  departments: DepartmentModel[] | string[];
  stock: Number;
  price: Number;
  _id?: string;
}
