import { BaseActions, ConstructorTypeOf, BaseSubjects, ModelInputType, ActionInputType, TargetInputType, ConditionInputType, InstanceOfFn, ScopeInputType, BaseScope, GlobalScope } from "./types";
interface AbilityOptions<S, A> {
    instanceOf: InstanceOfFn<S, S>;
}
export declare class Ability<S extends BaseSubjects, A extends BaseActions, BC extends BaseScope = GlobalScope> {
    private abilities;
    private inabilities;
    private instanceOf;
    constructor(options?: Partial<AbilityOptions<S, A>>);
    private addToAbilityList;
    allow<M extends S, T extends S, C extends BC>(model: ModelInputType<M>, actions: ActionInputType<A>, targets: TargetInputType<T>, scopes: ScopeInputType<C>, condition?: ConditionInputType<M, T>): void;
    allow<M extends S, T extends S>(model: ModelInputType<M>, actions: ActionInputType<A>, targets: TargetInputType<T>, condition?: ConditionInputType<M, T>): void;
    disallow<M extends S, T extends S, C extends BC>(model: ModelInputType<M>, actions: ActionInputType<A>, targets: TargetInputType<T>, scopes: ScopeInputType<C>, condition?: ConditionInputType<M, T>): void;
    disallow<M extends S, T extends S>(model: ModelInputType<M>, actions: ActionInputType<A>, targets: TargetInputType<T>, condition?: ConditionInputType<M, T>): void;
    private filterAbilityList;
    can<P extends S, T extends S, C extends BC>(performer: P, action: A, target: T | ConstructorTypeOf<T>, scope?: ScopeInputType<C>): boolean;
    cannot<P extends S, T extends S, C extends BC>(performer: P, action: A, target: T | ConstructorTypeOf<T>, scope?: ScopeInputType<C>): boolean;
}
export {};
