import { BaseActions, ConstructorTypeOf, BaseSubjects, ModelInputType, ActionInputType, TargetInputType, ConditionInputType, InstanceOfFn, ManageKey, AllKey } from "./types";
interface AbilityOptions<S, A> {
    instanceOf: InstanceOfFn<S, S>;
}
export declare class Ability<S extends BaseSubjects, A extends BaseActions> {
    private abilities;
    private instanceOf;
    constructor(options?: Partial<AbilityOptions<S, A>>);
    allow<M extends S, T extends S>(model: ModelInputType<M>, actions: ActionInputType<A> | ManageKey, targets: TargetInputType<T> | AllKey, condition?: ConditionInputType<M, T>): void;
    can<P extends S, T extends S>(performer: P, action: ActionInputType<A>, target: T | ConstructorTypeOf<T>): boolean;
    cannot<P extends S, T extends S>(performer: P, action: ActionInputType<A>, target: T | ConstructorTypeOf<T>): boolean;
}
export {};
