type UserType = "user" | "admin" | "manager";

export class User {
  constructor(public name: string, public type: UserType = "user") {}
}

export class Product {
  constructor(public seller: User, public isPublic: boolean = true) {}
} 

export type Subjects =
  | User
  | Product
;

export type Actions = "read" | "create" |  "update" | "delete";