
export type ConstructorTypeOf<M> = { new(...args: any[]): M };
export type IsConstructorFunc<T, Y = true, N = false> = T extends { new(): any } ? Y : N;
export type StripConstructors<T> = Pick<T, { [K in keyof T]: IsConstructorFunc<T[K], never, K>}[keyof T]>;

// export type Subjects<M> = { new (): M } | M;
// export type Subjects = ConstructorTypeOf<any> | any;
export type Subjects = object;

export type Actions = string;