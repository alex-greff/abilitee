# Abilities

A simple ability definition library that allows for complex rules to be
expressed simply. Inspired by [CanCan](https://www.npmjs.com/package/cancan)
(which was in turn inspired by the Rub Gem with the same name).

## Installation

```
npm install <TODO: package name here>
```

## Usage

```TypeScript
import { Ability, Or } from "<TODO: package name here>";

// --- Define types ---

class User {
  constructor(public name: string, public type: UserType = "user") {}
}

class Product {
  constructor(public seller: User, public isPublic: boolean = true) {}
}

// --- Subjects and actions that are available (for intellisense) ---

export type Subjects =
  | User
  | Product
;

export type Actions = "read" | "create" |  "update" | "delete";


// --- Ability factory function ---

const createAbilityForUser = (user: User) => {
  const ability = new Ability<Subjects, Actions>();

  // Users can view users
  ability.allow(User, "read", User);

  // Users can only update and delete themselves
  ability.allow(User, ["update", "delete"], User, (performer, target) => {
    return performer.name === target.name;
  });

  // Users can create new products
  ability.allow(User, "create", Product);

  // Users can view public products or products that they are selling
  ability.allow(
    User, 
    "read", 
    Product, 
    Or<User, Product>(
      { isPublic: true }, 
      (user, product) => user.name === product.seller.name
    )
  );

  // Users can update and delete their own products
  ability.allow(User, ["update", "delete"], Product, (user, product) => {
    return user.name === product.seller.name;
  });

  // Admin can manage everything
  if (user.type === "admin") {
    ability.allow(User, "$manage", "$all");
  }

  // Manager can manage everything with products
  if (user.type === "manager") {
    ability.allow(User, "$manage", Product);
  }

  return ability;
};


// --- Instantiate data ----

const admin = new User("Admin", "admin");
const manager = new User("Manager", "manager");
const userA = new User("A");
const userB = new User("B");

const product1 = new Product(userA);
const product2 = new Product(userB);
const product3 = new Product(userB, false);

// Ability instance specifically for each user
const adminAbility = createAbilityForUser(admin);
const managerAbility = createAbilityForUser(manager);
const userAAbility = createAbilityForUser(userA);
const userBAbility = createAbilityForUser(userB);


// --- Check some abilities ---

// User A can view any user
userAAbility.can(userA, "read", User); // => true

// User A can view user B
userAAbility.can(userA, "read", userB); // => true

// User A can update self
userAAbility.can(userA, "update", userA); // => true

// User A cannot update others
userAAbility.can(userA, "update", userB); // => true

// Throws error because a custom condition is defined
userAAbility.can(userA, "update", User) // error

// User A can view product 2, which is public
userAAbility.can(userA, "read", product2); // => true

// User A cannot view product 3 because it is private and they do not sell it
userAAbility.can(userA, "read", product3); // => false

// User B can view product 3 because they sell it
userBAbility.can(userB, "read", product3); // => false

// Admin and manager can view product 3 as well because they manage products
adminAbility.can(admin, "read", product3); // => true
managerAbility.can(manager, "read", product3) // => true

// However, only admin can delete user A
adminAbility.can(admin, "delete", userA); // => true
managerAbility.can(manager, "delete", userA) // => false
```

## API

`Ability` class:
  * `constructor(options?)`
    * `options` (optional):
    * `allow(model, action, target, condition?): void`
      * Description: Sets up an allow relation between `model`, `action`, 
      and `target`. You can think of it as "`<model>` can `<action>` `<target>`"
      * Parameters: 
        * `model: Class`
        * `action: string | string[]`
        * `target: Class`
        * `condition: ConditionFunction or Partial<target>`
    * `can(performer, action, target): boolean`
      * Description: Returns true if the given relation between `model`, 
      `action` and `target` is allowed.
      * Parameters: 
        * `performer: Class instance`
        * `action: string`
        * `target: Class or class instance`
    * `cannot(performer, action, target): boolean`
      * Description: Returns true if the given relation between `model`, 
      `action` and `target` is not allowed.
      * Parameters: 
        * `performer: Class instance`
        * `action: string`
        * `target: Class or class instance`

`Ability` options:
  * `instanceOf: (performer, model) => boolean`: overrides the default 
  instanceOf function used.

`ConditionFunction = (performer, target) => boolean`:
  * Description: a function that takes in a performer (instance of the model
    class) and a target (instance of the target class) and returns true if the
    `allow` passes.

### Predicate Composition Functions

`Or(...conditions): ConditionFunction`
  * Description: returns a condition function that evaluates true if some of the
  given conditions return true.

`And(...conditions): ConditionFunction`
  * Description: returns a condition function that evaluates true if all of the
  given conditions return true.

`Or(condition): ConditionFunction`
  * Description: returns a condition function that negates the result of the
  given condition.