const addon = require('../build/calc-napi');

/**
 * @typedef {Object} CalcNapi
 * @property {function(): string} getVersion
 * @property {function(): any} getUsage
 * @property {function(number, number): string} add
 * @property {function(number, number): string} sub
 * @property {function(number, number): string} mul
 * @property {function(number, number): string} divx
 * @property {function(number): string} sqr
 */

/**
 * @type {{ new(namedUser: string): CalcNapi }}
 */
exports.CalcNapi = addon.CalcNapi;
