export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type ConstructorTypeOf<M> = {
    new (...args: any[]): M;
};
export declare type IsConstructorFunc<T, Y = true, N = false> = T extends {
    new (): any;
} ? Y : N;
export declare type StripConstructors<T> = Pick<T, {
    [K in keyof T]: IsConstructorFunc<T[K], never, K>;
}[keyof T]>;
export declare type BaseSubjects = object;
export declare type BaseActions = string;
export declare type BaseScope = string;
export declare type AllKey = "$all";
export declare type ManageKey = "$manage";
export declare type GlobalScope = "$global";
export declare type ConditionFn<P, T> = (performer: P, target: T) => boolean;
export declare type InstanceOfFn<P, M> = (performer: P | ConstructorTypeOf<P>, model: ConstructorTypeOf<M>) => boolean;
export declare type TargetPartial<T> = DeepPartial<T>;
export declare type ModelInputType<M> = ConstructorTypeOf<M>;
export declare type ActionInputType<A> = (A | ManageKey) | (A | ManageKey)[];
export declare type TargetInputType<T> = ConstructorTypeOf<T> | AllKey;
export declare type ScopeInputType<C> = (C | GlobalScope) | (C | GlobalScope)[];
export declare type ConditionInputType<M, T> = ConditionFn<M, T> | TargetPartial<T>;
export interface AbilityItem<M extends BaseSubjects, A extends BaseActions, T extends BaseSubjects, C extends BaseScope> {
    model: ModelInputType<M>;
    action: A | ManageKey;
    target: TargetInputType<T> | AllKey;
    scope: C | GlobalScope;
    condition: ConditionFn<M, T> | undefined;
}
