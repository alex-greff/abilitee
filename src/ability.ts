import { ClassConstructorTypeError } from "./errors";
import {
  BaseActions,
  ConstructorTypeOf,
  BaseSubjects,
  ConditionFn,
  AbilityItem,
  ModelInputType,
  ActionInputType,
  TargetInputType,
  ConditionInputType,
  InstanceOfFn,
  ManageKey,
  AllKey,
} from "./types";
import * as Utilities from "./utilities";

interface AbilityOptions<S, A> {
  instanceOf: InstanceOfFn<S, S>;
}

const defaultInstanceOfFn = (instance: any, model: any) =>
  instance instanceof model;

export class Ability<S extends BaseSubjects, A extends BaseActions> {
  private abilities: AbilityItem<S, A, S>[] = [];
  private instanceOf: InstanceOfFn<S, S>;

  constructor(options?: Partial<AbilityOptions<S, A>>) {
    this.instanceOf = options?.instanceOf || defaultInstanceOfFn;
  }

  allow<M extends S, T extends S>(
    model: ModelInputType<M>,
    actions: ActionInputType<A> | ManageKey,
    targets: TargetInputType<T> | AllKey,
    condition?: ConditionInputType<M, T>
  ) {
    const conditionFn = Utilities.toConditionFunction(condition);

    const actionsArr = Array.isArray(actions) ? actions : [actions];
    const targetsArr = Array.isArray(targets) ? targets : [targets];

    actionsArr.forEach((action) => {
      targetsArr.forEach((target) => {
        this.abilities.push({
          model,
          action,
          target,
          condition: conditionFn as ConditionFn<S, S> | undefined,
        });
      });
    });
  }

  can<P extends S, T extends S>(
    performer: P,
    action: ActionInputType<A>,
    target: T | ConstructorTypeOf<T>
  ) {
    return (
      this.abilities
        // Check performer is instance of the model
        .filter((ability) => this.instanceOf(performer, ability.model))
        // Check the target matches or target is the right instance
        .filter((ability) => {
          return (
            ability.target === "$all" ||
            target === ability.target ||
            this.instanceOf(target, ability.target)
          );
        })
        // Check the action matches
        .filter((ability) => {
          return ability.action === "$manage" || action === ability.action;
        })
        // Check the condition matches, if there is one
        .filter((ability) => {
          // Condition function was given but the target is a class constructor
          if (ability.condition && Utilities.isConstructor(target))
            throw new ClassConstructorTypeError(
              "Condition given but target is a class constructor"
            );
          else if (ability.condition)
            return ability.condition(performer, target as T);
          return true;
        }).length > 0
    );
  }

  cannot<P extends S, T extends S>(
    performer: P,
    action: ActionInputType<A>,
    target: T | ConstructorTypeOf<T>
  ) {
    return !this.can(performer, action, target);
  }
}
