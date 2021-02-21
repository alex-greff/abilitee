import { Ability } from "./ability";
import { ConstructorTypeOf } from "./types";

class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
class Product {
  seller: User;
  public: Boolean = true;

  constructor(seller: User) {
    this.seller = seller;
  }
}

type Subjects = 
  // | typeof User
  | User
  // | typeof Product
  | Product
;

type Actions = "read" | "create" |  "update" | "delete";


const user1 = new User("Alex");
const user2 = new User("John");

const product1 = new Product(user1);

const ability = new Ability<Subjects, Actions>();

ability.allow(User, "delete", User, (a, b) => {
  return a.name == b.name;
});

ability.allow(User, "read", Product, { public: true });

ability.allow(User, "update", "all");

type Test = ConstructorTypeOf<User>;
const temp: Test = User;