import isObject from "is-plain-obj";
import {
  ConditionFn,
  ConditionInputType,
  DeepPartial,
  TargetPartial,
} from "./types";

/**
 * Gets a parameter on `obj`, if it is a function it evaluates it.
 */
const get = (obj: { [k: string]: any }, key: any) => {
  if (typeof obj[key] === "function") return obj[key]();
  else return obj[key];
};

/**
 * Returns true if the `partial` object is partially equal to the `target`
 * object (i.e. every key in `partial` exists on `target` and are equal to
 * each other). Does a deep search of the object if deep is enabled.
 */
const isPartiallyEqual = <T extends { [k: string]: any }>(
  target: T,
  partial: DeepPartial<T>,
  deep = true
): boolean => {
  if (!deep)
    return Object.keys(partial).every(
      (key) => get(target, key) === partial[key]
    );

  return Object.keys(partial).every((key) => {
    const targetVal = get(target, key);
    if (targetVal !== undefined && isObject(partial[key])) {
      return isPartiallyEqual(targetVal, partial[key]!);
    }

    return targetVal === partial[key];
  });
};

/**
 * Creates a condition function from a target object partial.
 */
const createConditionFn = <M, T>(
  partial: TargetPartial<T>
): ConditionFn<M, T> => {
  return (performer: M, target: T) => isPartiallyEqual(target, partial, true);
};

/**
 * Checks if the given function is a constructor function (i.e. a class type).
 */
export function isConstructor(func: any) {
  return (
    (func &&
      typeof func === "function" &&
      func.prototype &&
      func.prototype.constructor) === func
  );
}

/**
 * Converts a condition input to a condition function.
 */
export const toConditionFunction = <M, T>(
  condition: ConditionInputType<M, T> | undefined
): ConditionFn<M, T> => {
  const conditionFn = isObject(condition)
    ? createConditionFn<M, T>(condition as TargetPartial<T>)
    : (condition as ConditionFn<M, T>);
  return conditionFn;
};
