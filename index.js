/**
 * Tolstoy — ascetic graph structure
 *
 * @module  tolstoy
 */


/**
 * @constructor
 *
 * @param {Iterable} list Initial structure, whether nodes or connections
 */
function Graph (arg) {
	if (!(this instanceof Graph)) return new Graph(arg);

	this.constructor(arg);
}

/**
 * Separated constructor
 * To let it able to be called separately from inheritants
 */
Graph.prototype.constructor = function (list) {
	//set of nodes
	this.nodes = new Set();

	//set of connections for nodes
	this.edges = new Map();

	//have to keep these separately to reduce calculations on .disconnect(a) etc.
	this.inputs = new Map();
	this.outputs = new Map();

	//passed other graph
	if (list instanceof Graph) {
		var self = this;
		list.nodes.forEach(function (node) {
			self.add(node);
		});
		list.edges.forEach(function (toSet, from) {
			toSet.forEach(function (to) {
				self.connect(from, to);
			});
		});
	}
	else if (list) {
		//array-like arg
		if  (list.length) {
			for (var i = 0, l = list.length; i < l; i++) {
				var item = list[i];

				//[1,2], [2,3], [3,1]
				if (item instanceof Array) {
					this.add(item[0]);
					this.add(item[1]);
					this.connect(item[0], item[1]);
				}
				//1, 2, 3
				else {
					this.add(item);
				}
			};
		}
		//single arg
		else {
			this.add(list);
		}
	}
}


/**
 * Add a new node
 *
 * @param {*} a Anything as a node object
 *
 * @return {Graph} self reference, to chain
 */
Graph.prototype.add = function (a) {
	if (this.nodes.has(a)) return this;

	//save node
	this.nodes.add(a);

	//create set of connection for the node a
	this.edges.set(a, new Set());

	//create set of directed connections for the node a
	this.inputs.set(a, new Set());
	this.outputs.set(a, new Set());

	return this;
};


/**
 * Delete node
 *
 * @return {Boolean} Result of operation
 */
Graph.prototype.delete = function (a) {
	if (!this.nodes.has(a)) return false;

	//disconnect all pointing nodes
	this.inputs.get(a).forEach(function (b) {
		this.disconnect(b, a);
	}, this);

	//disconnect all outward nodes
	this.disconnect(a);

	//remove any reference
	this.nodes.delete(a);
	this.edges.delete(a);
	this.inputs.delete(a);
	this.outputs.delete(a);

	return true;
};


/**
 * Clear graph
 *
 * return undefined
 */
Graph.prototype.clear = function () {
	this.nodes.forEach(this.delete, this);
};


/**
 * Whether graph has node
 *
 * @return {Boolean} Result
 */
Graph.prototype.has = function (node) {
	return this.nodes.has(node);
};


/**
 * Iterator by nodes
 */
Graph.prototype.forEach = function (fn, ctx) {
	return this.nodes.forEach(fn, ctx);
};


/**
 * Connect node a to node b
 *
 * @return {Graph} Self
 */
Graph.prototype.connect = function (a, b) {
	if (!this.has(a) || !this.has(b)) return this;
	if (this.isConnected(a, b)) return this;

	//save the connections
	this.edges.get(a).add(b);
	this.edges.get(b).add(a);
	this.outputs.get(a).add(b);
	this.inputs.get(b).add(a);

	return this;
};


/**
 * Disconnect node a from node b, one-direction
 *
 * @return {Boolean} Result of operation
 */
Graph.prototype.disconnect = function (a, b) {
	if (!this.edges.has(a)) return false;

	//if no b - disconnect node outputs
	if (arguments.length < 2) {
		this.outputs.get(a).forEach(function (b) {
			this.disconnect(a, b);
		}, this);
		return true;
	}

	if (!this.edges.has(b)) return false;
	if (!this.isConnected(a, b)) return false;

	//delete connection
	this.edges.get(a).delete(b);
	this.outputs.get(a).delete(b);
	this.inputs.get(b).delete(a);

	return true;
};


/**
 * Simple connection checker
 */
Graph.prototype.isConnected = function (a, b) {
	if (!this.has(a) || !this.has(b)) return false;
	return this.outputs.get(a).has(b);
};


/**
 * Serialize to JSON
 */
Graph.prototype.toJSON = function () {
	var result = {
		//serialized objects
		nodes: [],

		//ids with connections, based on position in nodes
		edges: []
	};

	var idxMap = new Map();
	var i = 0;
	this.nodes.forEach(function (node) {
		idxMap.set(node, i++);
	});

	this.nodes.forEach(function (node) {
		var idx = idxMap.get(node);

		//nodes are like [2,3,4], by indexes
		result.nodes[idx] = node;

		result.edges[idx] = [];

		//edges and inputs are like [[1,2], [2,3], ...], where numbers are node's idxes
		this.edges.get(node).forEach(function (target) {
			result.edges[idx].push(idxMap.get(target));
		});
	}, this);

	idxMap.clear();

	return result;
};


/**
 * Deserialize from JSON
 */
Graph.prototype.fromJSON = function (obj) {
	if (!obj.nodes) return;

	for (var i = 0; i < obj.nodes.length; i++) {
		this.add(obj.nodes[i]);
	}

	for (var i = 0; i < obj.edges.length; i++) {
		this.connect(obj.nodes[i], obj.nodes[obj.edges[i]]);
	}

	return this;
};


module.exports = Graph;