import { ConditionFn, ConditionInputType, DeepPartial } from "./types";
/**
 * Checks if the given function is a constructor function (i.e. a class type).
 */
export declare function isConstructor(func: any): boolean;
/**
 * Converts a condition input to a condition function.
 */
export declare const toConditionFunction: <M, T>(condition: ConditionFn<M, T> | DeepPartial<T> | undefined) => ConditionFn<M, T>;
