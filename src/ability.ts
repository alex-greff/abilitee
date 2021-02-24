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
  ScopeInputType,
  BaseScope,
  GlobalScope,
} from "./types";
import * as Utilities from "./utilities";

interface AbilityOptions<S, A> {
  instanceOf: InstanceOfFn<S, S>;
}

const defaultInstanceOfFn = (instance: any, model: any) =>
  instance instanceof model;

export class Ability<
  S extends BaseSubjects,
  A extends BaseActions,
  BC extends BaseScope = GlobalScope
> {
  private abilities: AbilityItem<S, A, S, BC>[] = [];
  private inabilities: AbilityItem<S, A, S, BC>[] = [];
  private instanceOf: InstanceOfFn<S, S>;

  constructor(options?: Partial<AbilityOptions<S, A>>) {
    this.instanceOf = options?.instanceOf || defaultInstanceOfFn;
  }

  private addToAbilityList<M extends S, T extends S, C extends BC>(
    abilityList: AbilityItem<S, A, S, C>[],
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    scopes?: ScopeInputType<C>,
    condition?: ConditionInputType<M, T>
  ): void {
    scopes = scopes === undefined ? "$global" : scopes;

    const conditionFn = Utilities.toConditionFunction(condition);

    const actionsArr = Array.isArray(actions) ? actions : [actions];
    const targetsArr = Array.isArray(targets) ? targets : [targets];
    const scopeArr = Array.isArray(scopes) ? scopes : [scopes];

    actionsArr.forEach((action) => {
      targetsArr.forEach((target) => {
        scopeArr.forEach((scope) => {
          abilityList.push({
            model,
            action,
            target,
            scope,
            condition: conditionFn as ConditionFn<S, S> | undefined,
          });
        });
      });
    });
  }

  allow<M extends S, T extends S, C extends BC>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    scopes: ScopeInputType<C>,
    condition?: ConditionInputType<M, T>
  ): void;
  allow<M extends S, T extends S>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    condition?: ConditionInputType<M, T>
  ): void;
  allow<M extends S, T extends S, C extends BC>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    scopes?: ScopeInputType<C>,
    condition?: ConditionInputType<M, T>
  ): void {
    // Overload handling
    if (
      !(Utilities.isString(scopes) || Array.isArray(scopes)) &&
      condition === undefined
    ) {
      condition = scopes;
      scopes = undefined;
    }

    this.addToAbilityList(
      this.abilities,
      model,
      actions,
      targets,
      scopes,
      condition
    );
  }

  disallow<M extends S, T extends S, C extends BC>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    scopes: ScopeInputType<C>,
    condition?: ConditionInputType<M, T>
  ): void;
  disallow<M extends S, T extends S>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    condition?: ConditionInputType<M, T>
  ): void;
  disallow<M extends S, T extends S, C extends BC>(
    model: ModelInputType<M>,
    actions: ActionInputType<A>,
    targets: TargetInputType<T>,
    scopes?: ScopeInputType<C>,
    condition?: ConditionInputType<M, T>
  ): void {
    // Overload handling
    if (
      !(Utilities.isString(scopes) || Array.isArray(scopes)) &&
      condition === undefined
    ) {
      condition = scopes;
      scopes = undefined;
    }

    this.addToAbilityList(
      this.inabilities,
      model,
      actions,
      targets,
      scopes,
      condition
    );
  }

  private filterAbilityList<P extends S, T extends S, C extends BC>(
    abilityList: AbilityItem<S, A, S, C>[],
    performer: P,
    action: A,
    target: T | ConstructorTypeOf<T>,
    scope: ScopeInputType<C>
  ): [AbilityItem<S, A, S, C>[], boolean] {
    let hasManageAbility = false;

    const filteredList = abilityList
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
      // Check scope matches
      .filter((ability) => {
        // Ignore scope if target is $all
        return ability.target === "$all" || ability.scope === scope;
      })
      // Check the action matches
      .filter((ability) => {
        hasManageAbility = hasManageAbility || ability.action === "$manage";
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
      });

    return [filteredList, hasManageAbility];
  }

  can<P extends S, T extends S, C extends BC>(
    performer: P,
    action: A,
    target: T | ConstructorTypeOf<T>,
    scope: ScopeInputType<C> = "$global"
  ) {
    const [matchingAbilities, hasManageAbility] = this.filterAbilityList(
      this.abilities,
      performer,
      action,
      target,
      scope
    );
    const [matchingInabilities, _] = this.filterAbilityList(
      this.inabilities,
      performer,
      action,
      target,
      scope
    );

    const hasMatchingAbilities = matchingAbilities.length > 0;
    const hasMatchingInabilities = matchingInabilities.length > 0;

    // Automatically accept if one of the abilities has a "$manage" action
    return (
      hasManageAbility || (hasMatchingAbilities && !hasMatchingInabilities)
    );
  }

  cannot<P extends S, T extends S, C extends BC>(
    performer: P,
    action: A,
    target: T | ConstructorTypeOf<T>,
    scope: ScopeInputType<C> = "$global"
  ) {
    return !this.can(performer, action, target, scope);
  }
}
