/**
 * Evented version of a graph
 *
 * @module tolstoy/evented
 */

module.exports = require('inherits')(require('./'), require('events'));