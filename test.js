var assert = require('assert');
var Graph = require('./');


describe('Leo Tolstoy', function () {
	it('Create from connections', function () {
		var graph = new Graph([[1, 2], [2, 1], [2, 3]]);

		assert.equal(graph.nodes.size, 3);
		assert.equal(graph.edges.size, 3);
		assert.equal(graph.outputs.get(2).size, 2);
		assert.equal(graph.inputs.get(3).size, 1);
	});

	it('Create from nodes', function () {
		var graph = new Graph([1, 2, 3]);
		assert.equal(graph.nodes.size, 3);
		assert.equal(graph.edges.size, 3);
	});

	it('Create from other graph', function () {
		var graph0 = new Graph([1, 2, 3, [1,2]]);
		var graph = new Graph(graph0);
		assert.equal(graph.nodes.size, 3);
		assert.equal(graph.edges.size, 3);
		assert.equal(graph.isConnected(1,2), true);
	});

	it('Should remove all on clear', function () {
		var graph = new Graph([[1,1], [1,2], [2,3], [3,1]]);

		assert.equal(graph.edges.get(1).size, 3);
		assert.equal(graph.inputs.get(1).size, 2);
		assert.equal(graph.outputs.get(1).size, 2);

		graph.clear();

		assert.equal(graph.nodes.size, 0);
		assert.equal(graph.edges.size, 0);
		assert.equal(graph.inputs.size, 0);
		assert.equal(graph.outputs.size, 0);
	});

	it('toJSON', function () {
		var graph = new Graph(['a', 'b', 'c']);
		graph.connect('a','b');
		graph.connect('b','c');
		graph.connect('c','a');

		var result = graph.toJSON();

		assert.deepEqual(result, { nodes: ['a','b','c'], edges: [[1,2], [0,2], [1,0]] });
	});

	it('fromJSON', function () {
		var graph = new Graph(['a', 'b', 'c']);
		graph.connect('a','b');
		graph.connect('b','c');
		graph.connect('c','a');

		var structure = { nodes: ['a','b','c'], edges: [[1,2], [0,2], [1,0]] };

		assert.deepEqual(graph.fromJSON(structure).toJSON(), structure)
	});
});