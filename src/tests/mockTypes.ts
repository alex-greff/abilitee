type UserType = "user" | "admin" | "manager";

export class User {
  name: string;
  type: UserType;

  constructor(name: string, type: UserType = "user") {
    this.name = name;
    this.type = type;
  }
}

export class Product {
  seller: User;
  isPublic: boolean;

  constructor(seller: User, isPublic: boolean = true) {
    this.seller = seller;
    this.isPublic = isPublic;
  }
} 

export type Subjects =
  | User
  | Product
;

export type Actions = "read" | "create" |  "update" | "delete";