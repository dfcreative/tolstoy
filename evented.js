/**
 * Evented version of a graph
 *
 * @module tolstoy/evented
 */

var Graph = require('./');
var Emitter = require('events').EventEmitter;
var inherits = require('inherits');
var extend = require('xtend/mutable');

var proto = Graph.prototype;

inherits(Graph, Emitter);

extend(Graph.prototype, proto);

module.exports = Graph;