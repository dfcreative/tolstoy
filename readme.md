Graph structure with ascetic API.

## Usage

[![npm install tolstoy](https://nodei.co/npm/tolstoy.png?mini=true)](https://npmjs.org/package/tolstoy/)

```js
var Graph = require('tolstoy');

//create from a set of edges
var graph = new Graph([[a, b], [b, a], [a, c], ...]);

//create from a set of nodes
var graph = new Graph([a, b, c]);

//add node
graph.add(a).add(b);

//delete and disconnect a node
graph.delete(b);

//remove all nodes with their connections
graph.clear();

//test whether node exists
graph.has(a);

//iterate over all nodes
graph.forEach(function (node) {});

//connect node a to b, b to c
graph.connect(a, b).connect(b, c);

//disconnect node b from a, or from all output nodes, if undefined
//if you need to disconnect all inputs, use `delete(a)` and then `add(a)`.
graph.disconnect(b, a?);

//default serialization
graph.toJSON();
graph.fromJSON(obj);

//set of nodes
graph.nodes;

//map of node’s connected nodes, undirected
graph.edges;

//map of node's input nodes
graph.inputs;

//map of node's output nodes
graph.outputs;
```

There is also an evented version of graph, inheriting `EventEmitter`, which may be more suitable for some practical cases. It can be used, for example, to extend graph as so:

```js
var Graph = require('tolstoy/evented');

/**
 * Graph of connected streams
 */
class StreamGraph extends Graph {
	constructor (arg) {
		super(arg);

		//create writable stream as a main output
		this.output = new Writable();
	}

	/**
	 * Redefine connect method to really connect subsequent nodes
	 *
	 * @param {Stream} streamA Source stream
	 * @param {Stream} streamB Target stream
	 */
	connect (streamA, streamB) {
		super.connect(streamA, streamB);

		streamA.pipe(streamB);

		this.emit('connected', streamA, streamB);
	}
}
```

## Use-cases

* A base for [audio-graph](https://github.com/audio-lab/graph).
* A base for any kind of specific graph, to delegate stuctural work.
* A state machine, like [st8](https://github.com/dfcreative/st8).
* A model to scaffold data for graph renderer.
* Simple serialization, deserialization.


## Principles

* It does not provide a framework of graph calculations, or rendering facilities — the whole purpose of the project is to provide maximally minimal familiar structure to work with graphs, providing minimally possible set of methods.
* It does not try to purport the theoretical purity in sense of directed/undirected/multi/simple graph etc. It provides a basic tiny class to extend on demand to implement any kind of graph-like structure.
* Tolstoy uses ES6 structures beneath, so you may need to polyfill them with [babel](https://babeljs.io/docs/setup/) etc.
* API is as close as possible to native structures like [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Structures should be felt naturally.