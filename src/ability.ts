import isObject from "is-plain-obj";
import arrify from "arrify";
import {
  Actions,
  ConstructorTypeOf,
  StripConstructors,
  Subjects,
} from "./types";

type AllKey = "all";
type ManageKey = "manage";

type ConditionFn<P, T, O> = (performer: P, target: T, options: O) => boolean;
type TargetPartial<T> = Partial<T>;

type ModelInputType<M> = ConstructorTypeOf<M>;
type ActionInputType<A> = 
  | A
  | A[]
  | ManageKey;
type TargetInputType<T> =
  | ConstructorTypeOf<T>
  | ConstructorTypeOf<T>[]
  | AllKey;

type OptionsInput<M, A, T> = ConditionFn<M, T, any> | TargetPartial<T>;

interface AbilityItem<
  M extends Subjects,
  A extends Actions,
  T extends Subjects
> {
  model: ModelInputType<M>;
  action: ActionInputType<A>;
  target: TargetInputType<T>;
  condition: ConditionFn<any, any, any> | undefined; // TODO: fix this
}

const get = (obj: { [k: string]: any }, key: any) => {
  if (typeof obj[key] === "function") return obj[key]();
  else return obj[key];
};

const isPartiallyEqual = <T extends { [k: string]: any }>(
  target: T,
  partial: Partial<T>
) => {
  return Object.keys(partial).every((key) => get(target, key) === partial[key]);
};

const createConditionFn = <M, T>(
  partial: TargetPartial<T>
): ConditionFn<M, T, null> => {
  return (performer: M, target: T, options) => isPartiallyEqual(target, partial);
};

// TODO: type it
const defaultInstanceOfFn = (instance: any, model: any) =>
  instance instanceof model;

export class Ability<S extends Subjects, A extends Actions> {
  private abilities: AbilityItem<S, A, S>[] = [];
  // TODO: type it
  private instanceOf: (performer: any, model: any) => boolean;

  constructor() {
    this.instanceOf = defaultInstanceOfFn;
  }

  allow<M extends S, T extends S>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    options?: OptionsInput<M, A, T>
    // options?: ConditionFn<M, T> | TargetPartial<T>
  ) {
    const conditionFn = isObject(options)
      ? createConditionFn(options)
      : options;

    const actionsArr = Array.isArray(actions) ? actions : [actions];

    const targetsArr = Array.isArray(targets) ? targets : [targets];

    actionsArr.forEach((action) => {
      targetsArr.forEach((target) => {
        this.abilities.push({ model, action, target, condition: conditionFn });
      });
    });
  }

  can<P extends S, T extends S, O>(
    performer: P,
    action: ActionInputType<A>,
    target: T | ConstructorTypeOf<T>,
    options: O
  ) {
    return this.abilities
      // Check performer is instance of the model
      .filter((ability) => this.instanceOf(performer, ability.model))
      // Check the target matches or target is the right instance
      .filter((ability) => {
        return (
          ability.target === "all" ||
          target === ability.target ||
          this.instanceOf(target, ability.target)
        );
      })
      // Check the action matches
      .filter((ability) => {
        return ability.action === "manage"
          || action === ability.action;
      })
      // Check the condition matches, if there is one
      .filter((ability) => {
        if (ability.condition)
          return ability.condition(performer, target, options);
        return true;
      })
      .length > 0;
  }

  // allow(model: StripConstructors<S>, action: A, target: S) {
  //   console.log("model", model);
  // }
}
