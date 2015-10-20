Generic graph structure with ascetic API.

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


## Principles

* Tolstoy does not provide a framework of graph calculations, or rendering facilities — the whole purpose of the project is to provide maximally minimal familiar structure to work with graphs, providing minimally possible set of methods.
* Tolstoy does not try to purport the theoretical purity in sense of directed/undirected/multi/simple graph etc. It provides a basic tiny class to extend on demand to implement any kind of graph-like structure.
* Tolstoy uses ES6 structures beneath, so you may need to polyfill them with [babel](https://babeljs.io/docs/setup/) etc.
* API is as close as possible to native structures like [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Structures should be felt naturally.
* Tolstoy is a temporary solution, akin to [xtend](https://npmjs.org/package/xtend), till there is no native implementation of _Graph_ in node/browsers. As only there is one, tolstoy is going to be replaced with polyfill.