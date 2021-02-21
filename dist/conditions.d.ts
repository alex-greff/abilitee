import { ConditionFn, ConditionInputType } from "./types";
/**
 * Returns true if some of the conditions pass.
 */
export declare const Or: <P, T>(...conditions: ConditionInputType<P, T>[]) => ConditionFn<P, T>;
/**
 * Returns true if all the conditions pass.
 */
export declare const And: <P, T>(...conditions: ConditionInputType<P, T>[]) => ConditionFn<P, T>;
/**
 * Returns the negation of the condition.
 */
export declare const Not: <P, T>(condition: ConditionInputType<P, T>) => ConditionFn<P, T>;
