'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isObject = require('is-plain-obj');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var ClassConstructorTypeError = /** @class */ (function (_super) {
    __extends(ClassConstructorTypeError, _super);
    function ClassConstructorTypeError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ClassConstructorTypeError";
        return _this;
    }
    return ClassConstructorTypeError;
}(Error));

/**
 * Gets a parameter on `obj`, if it is a function it evaluates it.
 */
var get = function (obj, key) {
    if (typeof obj[key] === "function")
        return obj[key]();
    else
        return obj[key];
};
/**
 * Returns true if the `partial` object is partially equal to the `target`
 * object (i.e. every key in `partial` exists on `target` and are equal to
 * each other). Does a deep search of the object if deep is enabled.
 */
var isPartiallyEqual = function (target, partial, deep) {
    if (deep === void 0) { deep = true; }
    if (!deep)
        return Object.keys(partial).every(function (key) { return get(target, key) === partial[key]; });
    return Object.keys(partial).every(function (key) {
        var targetVal = get(target, key);
        if (targetVal !== undefined && isObject__default['default'](partial[key])) {
            return isPartiallyEqual(targetVal, partial[key]);
        }
        return targetVal === partial[key];
    });
};
/**
 * Creates a condition function from a target object partial.
 */
var createConditionFn = function (partial) {
    return function (performer, target) { return isPartiallyEqual(target, partial, true); };
};
/**
 * Checks if the given function is a constructor function (i.e. a class type).
 */
function isConstructor(func) {
    return ((func &&
        typeof func === "function" &&
        func.prototype &&
        func.prototype.constructor) === func);
}
/**
 * Converts a condition input to a condition function.
 */
var toConditionFunction = function (condition) {
    var conditionFn = isObject__default['default'](condition)
        ? createConditionFn(condition)
        : condition;
    return conditionFn;
};

var defaultInstanceOfFn = function (instance, model) {
    return instance instanceof model;
};
var Ability = /** @class */ (function () {
    function Ability(options) {
        this.abilities = [];
        this.inabilities = [];
        this.instanceOf = (options === null || options === void 0 ? void 0 : options.instanceOf) || defaultInstanceOfFn;
    }
    Ability.prototype.allow = function (model, actions, targets, condition) {
        var _this = this;
        var conditionFn = toConditionFunction(condition);
        var actionsArr = Array.isArray(actions) ? actions : [actions];
        var targetsArr = Array.isArray(targets) ? targets : [targets];
        actionsArr.forEach(function (action) {
            targetsArr.forEach(function (target) {
                _this.abilities.push({
                    model: model,
                    action: action,
                    target: target,
                    condition: conditionFn,
                });
            });
        });
    };
    Ability.prototype.disallow = function (model, actions, targets, condition) {
        var _this = this;
        var conditionFn = toConditionFunction(condition);
        var actionsArr = Array.isArray(actions) ? actions : [actions];
        var targetsArr = Array.isArray(targets) ? targets : [targets];
        actionsArr.forEach(function (action) {
            targetsArr.forEach(function (target) {
                _this.inabilities.push({
                    model: model,
                    action: action,
                    target: target,
                    condition: conditionFn,
                });
            });
        });
    };
    Ability.prototype.filterAbilityList = function (abilityList, performer, action, target) {
        var _this = this;
        return (abilityList
            // Check performer is instance of the model
            .filter(function (ability) { return _this.instanceOf(performer, ability.model); })
            // Check the target matches or target is the right instance
            .filter(function (ability) {
            return (ability.target === "$all" ||
                target === ability.target ||
                _this.instanceOf(target, ability.target));
        })
            // Check the action matches
            .filter(function (ability) {
            return ability.action === "$manage" || action === ability.action;
        })
            // Check the condition matches, if there is one
            .filter(function (ability) {
            // Condition function was given but the target is a class constructor
            if (ability.condition && isConstructor(target))
                throw new ClassConstructorTypeError("Condition given but target is a class constructor");
            else if (ability.condition)
                return ability.condition(performer, target);
            return true;
        }));
    };
    Ability.prototype.can = function (performer, action, target) {
        var hasMatchingAbilities = this.filterAbilityList(this.abilities, performer, action, target).length >
            0;
        var hasMatchingInabilities = this.filterAbilityList(this.inabilities, performer, action, target)
            .length > 0;
        return hasMatchingAbilities && !hasMatchingInabilities;
    };
    Ability.prototype.cannot = function (performer, action, target) {
        return !this.can(performer, action, target);
    };
    return Ability;
}());

/**
 * Returns true if some of the conditions pass.
 */
var Or = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (performer, target) {
        return conditions.some(function (condition) {
            var conditionFn = toConditionFunction(condition);
            return conditionFn(performer, target);
        });
    };
};
/**
 * Returns true if all the conditions pass.
 */
var And = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (performer, target) {
        return conditions.every(function (condition) {
            var conditionFn = toConditionFunction(condition);
            return conditionFn(performer, target);
        });
    };
};
/**
 * Returns the negation of the condition.
 */
var Not = function (condition) {
    return function (performer, target) {
        var conditionFn = toConditionFunction(condition);
        return !conditionFn(performer, target);
    };
};

exports.Ability = Ability;
exports.And = And;
exports.Not = Not;
exports.Or = Or;
