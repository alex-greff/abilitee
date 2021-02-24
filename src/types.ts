export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ConstructorTypeOf<M> = { new (...args: any[]): M };
export type IsConstructorFunc<T, Y = true, N = false> = T extends {
  new (): any;
}
  ? Y
  : N;
export type StripConstructors<T> = Pick<
  T,
  { [K in keyof T]: IsConstructorFunc<T[K], never, K> }[keyof T]
>;

export type BaseSubjects = object;
export type BaseActions = string;
export type BaseScope = string;

export type AllKey = "$all";
export type ManageKey = "$manage";
export type GlobalScope = "$global";

export type ConditionFn<P, T> = (performer: P, target: T) => boolean;
export type InstanceOfFn<P, M> = (
  performer: P | ConstructorTypeOf<P>,
  model: ConstructorTypeOf<M>
) => boolean;

export type TargetPartial<T> = DeepPartial<T>;

export type ModelInputType<M> = ConstructorTypeOf<M>;
export type ActionInputType<A> = (A | ManageKey) | (A | ManageKey)[];
export type TargetInputType<T> = ConstructorTypeOf<T> | AllKey;
export type ScopeInputType<C> = (C | GlobalScope) | (C | GlobalScope)[];
export type ConditionInputType<M, T> = ConditionFn<M, T> | TargetPartial<T>;

export interface AbilityItem<
  M extends BaseSubjects,
  A extends BaseActions,
  T extends BaseSubjects,
  C extends BaseScope
> {
  model: ModelInputType<M>;
  action: A | ManageKey;
  target: TargetInputType<T> | AllKey;
  scope: C | GlobalScope;
  condition: ConditionFn<M, T> | undefined;
}
