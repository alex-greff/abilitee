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

export type AllKey = "$all";
export type ManageKey = "$manage";

export type ConditionFn<P, T> = (performer: P, target: T) => boolean;
export type InstanceOfFn<P, M> = (
  performer: P | ConstructorTypeOf<P>,
  model: ConstructorTypeOf<M>
) => boolean;

export type TargetPartial<T> = DeepPartial<T>;

export type ModelInputType<M> = ConstructorTypeOf<M>;
export type ActionInputType<A> = A | A[];
export type TargetInputType<T> = ConstructorTypeOf<T>;
export type ConditionInputType<M, T> = ConditionFn<M, T> | TargetPartial<T>;

export interface AbilityItem<
  M extends BaseSubjects,
  A extends BaseActions,
  T extends BaseSubjects
> {
  model: ModelInputType<M>;
  action: ActionInputType<A> | ManageKey;
  target: TargetInputType<T> | AllKey;
  condition: ConditionFn<M, T> | undefined;
}
