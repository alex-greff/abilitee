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
export declare type AllKey = "$all";
export declare type ManageKey = "$manage";
export declare type ConditionFn<P, T> = (performer: P, target: T) => boolean;
export declare type InstanceOfFn<P, M> = (performer: P | ConstructorTypeOf<P>, model: ConstructorTypeOf<M>) => boolean;
export declare type TargetPartial<T> = DeepPartial<T>;
export declare type ModelInputType<M> = ConstructorTypeOf<M>;
export declare type ActionInputType<A> = A | A[];
export declare type TargetInputType<T> = ConstructorTypeOf<T>;
export declare type ConditionInputType<M, T> = ConditionFn<M, T> | TargetPartial<T>;
export interface AbilityItem<M extends BaseSubjects, A extends BaseActions, T extends BaseSubjects> {
    model: ModelInputType<M>;
    action: ActionInputType<A> | ManageKey;
    target: TargetInputType<T> | AllKey;
    condition: ConditionFn<M, T> | undefined;
}
