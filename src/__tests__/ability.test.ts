import { Ability } from "../ability";
import { And, Not, Or } from "../conditions";
import { Actions, Product, Subjects, User } from "./mockTypes";

test("Basic ability conditions", () => {
  const createAbilityForUser = (user: User) => {
    const ability = new Ability<Subjects, Actions>();

    ability.allow(User, "read", User);
    ability.allow(User, "update", User, (performer, target) => {
      return performer.name === target.name;
    });
    ability.allow(User, "delete", User, (performer, target) => {
      return performer.name === target.name;
    });

    ability.allow(User, "create", Product);
    ability.allow(User, "read", Product, { isPublic: true });
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

  const admin = new User("Admin", "admin");
  const manager = new User("Manager", "manager");
  const userA = new User("A");
  const userB = new User("B");

  const adminAbility = createAbilityForUser(admin);
  const managerAbility = createAbilityForUser(manager);
  const userAAbility = createAbilityForUser(userA);
  const userBAbility = createAbilityForUser(userB);

  const product1 = new Product(userA);
  const product2 = new Product(userB);
  const product3 = new Product(userB, false);

  // === Admin ability checks ===

  // CRUD on self user
  expect(adminAbility.can(admin, "create", admin)).toBe(true);
  expect(adminAbility.can(admin, "read", admin)).toBe(true);
  expect(adminAbility.can(admin, "update", admin)).toBe(true);
  expect(adminAbility.can(admin, "delete", admin)).toBe(true);

  // CRUD on other user
  expect(adminAbility.can(admin, "create", userB)).toBe(true);
  expect(adminAbility.can(admin, "read", userB)).toBe(true);
  expect(adminAbility.can(admin, "update", userB)).toBe(true);
  expect(adminAbility.can(admin, "delete", userB)).toBe(true);

  // Test User with constructor functions
  expect(adminAbility.can(admin, "create", User)).toBe(true);
  expect(adminAbility.can(admin, "read", User)).toBe(true);
  expect(() => adminAbility.can(admin, "update", User)).toThrow();
  expect(() => adminAbility.can(admin, "delete", User)).toThrow();

  // CRUD product1 with admin
  expect(adminAbility.can(admin, "create", product1)).toBe(true);
  expect(adminAbility.can(admin, "read", product1)).toBe(true);
  expect(adminAbility.can(admin, "update", product1)).toBe(true);
  expect(adminAbility.can(admin, "delete", product1)).toBe(true);

  // Test with constructor functions
  expect(adminAbility.can(admin, "create", Product)).toBe(true);
  expect(() => adminAbility.can(admin, "read", Product)).toThrow();
  expect(() => adminAbility.can(admin, "update", Product)).toThrow();
  expect(() => adminAbility.can(admin, "delete", Product)).toThrow();

  // CRUD product2 with admin
  expect(adminAbility.can(admin, "create", product2)).toBe(true);
  expect(adminAbility.can(admin, "read", product2)).toBe(true);
  expect(adminAbility.can(admin, "update", product2)).toBe(true);
  expect(adminAbility.can(admin, "delete", product2)).toBe(true);

  // CRUD product3 with admin
  expect(adminAbility.can(admin, "create", product3)).toBe(true);
  expect(adminAbility.can(admin, "read", product3)).toBe(true);
  expect(adminAbility.can(admin, "update", product3)).toBe(true);
  expect(adminAbility.can(admin, "delete", product3)).toBe(true);

  // === Manager ability checks ===

  // CRUD on self user
  expect(managerAbility.can(manager, "create", manager)).toBe(false);
  expect(managerAbility.can(manager, "read", manager)).toBe(true);
  expect(managerAbility.can(manager, "update", manager)).toBe(true);
  expect(managerAbility.can(manager, "delete", manager)).toBe(true);

  // CRUD on other user
  expect(managerAbility.can(manager, "create", userB)).toBe(false);
  expect(managerAbility.can(manager, "read", userB)).toBe(true);
  expect(managerAbility.can(manager, "update", userB)).toBe(false);
  expect(managerAbility.can(manager, "delete", userB)).toBe(false);

  // Test User with constructor functions
  expect(managerAbility.can(manager, "create", User)).toBe(false);
  expect(managerAbility.can(manager, "read", User)).toBe(true);
  expect(() => managerAbility.can(manager, "update", User)).toThrow();
  expect(() => managerAbility.can(manager, "delete", User)).toThrow();

  // CRUD product1 with manager
  expect(managerAbility.can(manager, "create", product1)).toBe(true);
  expect(managerAbility.can(manager, "read", product1)).toBe(true);
  expect(managerAbility.can(manager, "update", product1)).toBe(true);
  expect(managerAbility.can(manager, "delete", product1)).toBe(true);

  // Test with constructor functions
  expect(managerAbility.can(manager, "create", Product)).toBe(true);
  expect(() => managerAbility.can(manager, "read", Product)).toThrow();
  expect(() => managerAbility.can(manager, "update", Product)).toThrow();
  expect(() => managerAbility.can(manager, "delete", Product)).toThrow();

  // CRUD product2 with manager
  expect(managerAbility.can(manager, "create", product2)).toBe(true);
  expect(managerAbility.can(manager, "read", product2)).toBe(true);
  expect(managerAbility.can(manager, "update", product2)).toBe(true);
  expect(managerAbility.can(manager, "delete", product2)).toBe(true);

  // CRUD product3 with manager
  expect(managerAbility.can(manager, "create", product3)).toBe(true);
  expect(managerAbility.can(manager, "read", product3)).toBe(true);
  expect(managerAbility.can(manager, "update", product3)).toBe(true);
  expect(managerAbility.can(manager, "delete", product3)).toBe(true);

  // === User A ability checks ===

  // CRUD on self user
  expect(userAAbility.can(userA, "create", userA)).toBe(false);
  expect(userAAbility.can(userA, "read", userA)).toBe(true);
  expect(userAAbility.can(userA, "update", userA)).toBe(true);
  expect(userAAbility.can(userA, "delete", userA)).toBe(true);

  // CRUD on other user
  expect(userAAbility.can(userA, "create", userB)).toBe(false);
  expect(userAAbility.can(userA, "read", userB)).toBe(true);
  expect(userAAbility.can(userA, "update", userB)).toBe(false);
  expect(userAAbility.can(userA, "delete", userB)).toBe(false);

  // Test User with constructor functions
  expect(userAAbility.can(userA, "create", User)).toBe(false);
  expect(userAAbility.can(userA, "read", User)).toBe(true);
  expect(() => userAAbility.can(userA, "update", User)).toThrow();
  expect(() => userAAbility.can(userA, "delete", User)).toThrow();

  // CRUD product1 with userA
  expect(userAAbility.can(userA, "create", product1)).toBe(true);
  expect(userAAbility.can(userA, "read", product1)).toBe(true);
  expect(userAAbility.can(userA, "update", product1)).toBe(true);
  expect(userAAbility.can(userA, "delete", product1)).toBe(true);

  // Test Product with constructor functions
  expect(userAAbility.can(userA, "create", Product)).toBe(true);
  expect(() => userAAbility.can(userA, "read", Product)).toThrow();
  expect(() => userAAbility.can(userA, "update", Product)).toThrow();
  expect(() => userAAbility.can(userA, "delete", Product)).toThrow();

  // CRUD product2 with userA
  expect(userAAbility.can(userA, "create", product2)).toBe(true);
  expect(userAAbility.can(userA, "read", product2)).toBe(true);
  expect(userAAbility.can(userA, "update", product2)).toBe(false);
  expect(userAAbility.can(userA, "delete", product2)).toBe(false);

  // CRUD product3 with userA
  expect(userAAbility.can(userA, "create", product3)).toBe(true);
  expect(userAAbility.can(userA, "read", product3)).toBe(false);
  expect(userAAbility.can(userA, "update", product3)).toBe(false);
  expect(userAAbility.can(userA, "delete", product3)).toBe(false);

  // === User B ability checks ===

  // CRUD product1 with userB
  expect(userBAbility.can(userB, "create", product1)).toBe(true);
  expect(userBAbility.can(userB, "read", product1)).toBe(true);
  expect(userBAbility.can(userB, "update", product1)).toBe(false);
  expect(userBAbility.can(userB, "delete", product1)).toBe(false);

  // CRUD product2 with userB
  expect(userBAbility.can(userB, "create", product2)).toBe(true);
  expect(userBAbility.can(userB, "read", product2)).toBe(true);
  expect(userBAbility.can(userB, "update", product2)).toBe(true);
  expect(userBAbility.can(userB, "delete", product2)).toBe(true);

  // CRUD product3 with userB
  expect(userBAbility.can(userB, "create", product3)).toBe(true);
  expect(userBAbility.can(userB, "read", product3)).toBe(false);
  expect(userBAbility.can(userB, "update", product3)).toBe(true);
  expect(userBAbility.can(userB, "delete", product3)).toBe(true);
});

test("Basic inability conditions", () => {
  const createAbilityForUser = (user: User) => {
    const ability = new Ability<Subjects, Actions>();

    // Users can view any user
    ability.allow(User, "read", User);
    // User can update and delete self
    ability.allow(User, ["update", "delete"], User, (performer, target) => {
      return performer.name === target.name;
    });
    // User cannot update own role
    ability.disallow(User, "update", User, (performer, target) => {
      return performer.type !== target.type;
    });

    // Admin can manage everything
    if (user.type === "admin") {
      ability.allow(User, "$manage", "$all");
    }

    return ability;
  };

  const admin = new User("Admin", "admin");
  const userA = new User("A");
  const userB = new User("B");

  const adminAbility = createAbilityForUser(admin);
  const userAAbility = createAbilityForUser(userA);
  const userBAbility = createAbilityForUser(userB);

  const userANew = new User("A", "admin");

  // User A tries to upgrade themself to admin
  expect(userAAbility.can(userA, "update", userANew)).toBe(false);
  expect(userBAbility.can(userB, "update", userANew)).toBe(false);
  expect(adminAbility.can(admin, "update", userANew)).toBe(true);
});

test("Object condition", () => {
  const createAbilityForUser = (user: User) => {
    const ability = new Ability<Subjects, Actions>();

    ability.allow(User, "update", User, { name: user.name });

    return ability;
  };

  const userA = new User("A");
  const userB = new User("B");

  const userAAbility = createAbilityForUser(userA);
  const userBAbility = createAbilityForUser(userB);

  expect(userAAbility.can(userA, "update", userA)).toBe(true);
  expect(userAAbility.can(userA, "update", userB)).toBe(false);
  expect(userBAbility.can(userB, "update", userA)).toBe(false);
  expect(userBAbility.can(userB, "update", userB)).toBe(true);
});

test("Chain conditions", () => {
  const ability = new Ability<Subjects, Actions>();
  ability.allow(
    User,
    "read",
    Product,
    Or<User, Product>(
      { isPublic: true },
      (user, product) => user.name === product.seller.name
    )
  );

  const userA = new User("A");
  const userB = new User("B");

  const product1 = new Product(userA);
  const product2 = new Product(userB);
  const product3 = new Product(userB, false);

  // UserA can view product1
  expect(ability.can(userA, "read", product1)).toBe(true);

  // UserA can view product2
  expect(ability.can(userA, "read", product2)).toBe(true);

  // UserA cannot view product3
  expect(ability.can(userA, "read", product3)).toBe(false);

  // UserB can view product1
  expect(ability.can(userB, "read", product1)).toBe(true);

  // UserB can view product2
  expect(ability.can(userB, "read", product2)).toBe(true);

  // UserB can view product3 (by ownership)
  expect(ability.can(userB, "read", product3)).toBe(true);
});

test("Condition joining functions", () => {
  const and1 = And<User, User>(
    { name: "A" },
    (user1, user2) => user1.name === user2.name
  );

  const or1 = Or<User, User>(
    { name: "A" },
    (user1, user2) => user1.name === user2.name
  );

  const not1 = Not<User, User>({ name: "A" });
  const not2 = Not<User, User>((user1, user2) => user1.name === user2.name);

  const nested1 = And<User, User>({ name: "A" }, not2);

  const userA = new User("A");
  const userB = new User("B");

  expect(and1(userA, userA)).toBe(true);
  expect(and1(userA, userB)).toBe(false);
  expect(and1(userB, userA)).toBe(false);
  expect(and1(userB, userB)).toBe(false);

  expect(or1(userA, userA)).toBe(true);
  expect(or1(userA, userB)).toBe(false);
  expect(or1(userB, userA)).toBe(true);
  expect(or1(userB, userB)).toBe(true);

  expect(not1(userA, userA)).toBe(false);
  expect(not1(userA, userB)).toBe(true);
  expect(not1(userB, userA)).toBe(false);
  expect(not1(userB, userB)).toBe(true);

  expect(not2(userA, userA)).toBe(false);
  expect(not2(userA, userB)).toBe(true);
  expect(not2(userB, userA)).toBe(true);
  expect(not2(userB, userB)).toBe(false);

  expect(nested1(userA, userA)).toBe(false);
  expect(nested1(userA, userB)).toBe(false);
  expect(nested1(userB, userA)).toBe(true);
  expect(nested1(userB, userB)).toBe(false);
});
