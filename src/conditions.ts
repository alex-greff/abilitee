import { ConditionFn, ConditionInputType } from "./types";
import * as Utilities from "./utilities";

/**
 * Returns true if some of the conditions pass.
 */
export const Or = <P, T>(
  ...conditions: ConditionInputType<P, T>[]
): ConditionFn<P, T> => {
  return (performer, target) => {
    return conditions.some((condition) => {
      const conditionFn = Utilities.toConditionFunction(condition)!;
      return conditionFn(performer, target);
    });
  };
};

/**
 * Returns true if all the conditions pass.
 */
export const And = <P, T>(
  ...conditions: ConditionInputType<P, T>[]
): ConditionFn<P, T> => {
  return (performer, target) => {
    return conditions.every((condition) => {
      const conditionFn = Utilities.toConditionFunction(condition)!;
      return conditionFn(performer, target);
    });
  };
};

/**
 * Returns the negation of the condition.
 */
export const Not = <P, T>(
  condition: ConditionInputType<P, T>
): ConditionFn<P, T> => {
  return (performer, target) => {
    const conditionFn = Utilities.toConditionFunction(condition)!;
    return !conditionFn(performer, target);
  };
};
