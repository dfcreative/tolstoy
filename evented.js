/**
 * Evented version of a graph
 */

var Graph = require('./');
var Emitter = require('events');
var inherits = require('inherits');


inherits(Graph, Emitter);


