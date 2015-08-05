/**
 * Cech complex builder
 */
function Cech() {
  this.cells;
  this.N;
  this.neighbors;
  this.S;
}

/**
 * Build Cech complex
 *
 * @param  {Array} cells
 * @return {Array}
 */
Cech.prototype.complex = function(cells, maxK) {
  this.cells = cells;
  this.N = this.cells.length;

  var S = [
    this.sim0(),
    this.sim1()
  ];

  // build k-simplices
  this.S = this.simK(S, maxK);

  return this.S;
};

/**
 * Build 0-simplices
 *
 * @return {Array}
 */
Cech.prototype.sim0 = function() {
  var S0 = [];

  for (var i = 0; i < this.N; i++) {
    S0.push([i]);
  }

  return S0;
};

/**
 * Build 1-simplices and neighborhood matrix
 *
 * @return {Array}
 */
Cech.prototype.sim1 = function() {
  var S1 = [];

  this.neighbors = [];

  for (i = 0, l = this.cells.length; i < l; i++) {
    this.neighbors.push([]);
  }

  for (var i = 0, l = this.N - 1; i < l; i++) {
    this.neighbors.push([]);
    for (var j = i + 1; j < this.N; j++) {
      if (this.intersects(this.cells[i], this.cells[j])) {
        S1.push([i, j]);
        this.neighbors[i].push(j);
      }
    }
  }

  return S1;
};

/**
 * Build k-simplices
 *
 * @param  {Array} S
 * @return {Array}
 */
Cech.prototype.simK = function(S, maxK) {
  var k = 2;
  var i;
  var j;
  var l;
  var u;
  var candidates;
  var Sk;

  while (1) {
    Sk = []; // collection of k-simplices
    for (i = 0; i < this.N; i++) {
      candidates = this.getCandidates(this.neighbors, S[0][i][0], k); // set of candidates
      for (j = 0, l = candidates.length; j < l; j++) {
        u = candidates[j];
        // verfy if set of candidates can create k-simplex
        if (this.verify(u)) {
          Sk.push(u);
        }
      }
    }

    if (Sk.length) {
      S.push(Sk);
      k++;
    } else {
      break;
    }

    if (typeof maxK !== 'undefined') {
      if (k > maxK) {
        break;
      }
    }
  }

  return S;
};

/**
 * verify if given cell can create a k-simplex
 *
 * @param  {Array} u
 * @return {boolean}
 */
Cech.prototype.verify = function(u) {
  var k = u.length;
  var uCells = [];
  var i;
  var j;
  var l;

  for (i = 0; i < k; i++) {
    uCells.push(this.cells[u[i]]);
  }

  var smallest = this.getSmallestCell(uCells);

  // check if smallest cell is inside all other cells from u
  var inside = true;
  for (i = 0; i < k; i++) {
    var cell = uCells[i];
    if (!this.isCellInsideCell(smallest, cell)) {
      inside = false;
      break;
    }
  }

  if (inside) {
    return true;
  } else {

    // get list of all intersections
    var X = [];
    for (i = 0, l = k - 1; i < l; i++) {
      for (j = 1; j < k; j++) {
        var inter = this.intersection(uCells[i], uCells[j]);
        if (inter) {
          X = X.concat(inter);
        }
      }
    }

    i = X.length;
    // check if exists Xij inside all cells
    while (i--) {
      var point = X[i];
      var exists = true;
      j = uCells.length;
      while (j--) {
        var cell = uCells[j];
        if (!this.isPointInsideCell(point, cell)) {
          exists = false;
          break;
        }
      }
      if (exists) {
        return true;
      }
    }
  }
};

/**
 * get smallest cell
 *
 * @param  {Array} cells
 * @return {Array}
 */
Cech.prototype.getSmallestCell = function(cells) {
  var min = Number.MAX_VALUE;
  var minCell = null;
  var cell;

  for (var i = 0, l = cells.length; i < l; i++) {
    cell = cells[i];
    if (cell[1] < min) {
      min = cell[1];
      minCell = cell;
    }
  }

  return minCell;
};

/**
 * get candidates for a k-simplex
 *
 * @param  {Array} neighbors
 * @param  {number} v
 * @param  {number} k
 * @return {Array}
 */
Cech.prototype.getCandidates = function(neighbors, v, k) {
  var candidates = [];
  var comb = this.combinations(neighbors[v], k);
  for (var i = 0, l = comb.length; i < l; i++) {
    var item = comb[i];
    candidates.push([v].concat(item));
  }
  return candidates;
};

/**
 * check if two cells intersects
 *
 * @param  {Array} p
 * @param  {Array} q
 * @return {boolean}
 */
Cech.prototype.intersects = function(p, q, d) {
  if (typeof d === 'undefined') {
    d = this.dist(p[0], q[0]);
  }

  // Circles do not overlap
  if (d > p[1] + q[1]) {
    return false;
  }
  // One circle contains the other
  if (d < Math.abs(p[1] - q[1])) {
    return false;
  }
  // These are the same circle
  if (d === 0 && p[1] === q[1]) {
    return false;
  }

  return true;
};

/**
 * check is cell inside another cell
 *
 * @param  {Array} cellA
 * @param  {Array} cellB
 * @return {boolean}
 */
Cech.prototype.isCellInsideCell = function(cellA, cellB) {
  return this.dist(cellA[0], cellB[0]) <= Math.abs(cellA[1] - cellB[1]);
};

/**
 * check is point inside a cell
 *
 * @param  {Array} point
 * @param  {Array} cell
 * @return {boolean}
 */
Cech.prototype.isPointInsideCell = function(point, cell) {
  return this.dist(point, cell[0]) <= cell[1];
};

/**
 * euclidean distance
 *
 * @param  {Array} p
 * @param  {Array} q
 * @return {number}
 */
Cech.prototype.dist = function(p, q) {
  var sum = 0;
  var i = p.length;
  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }
  return Math.sqrt(sum);
};

/**
 * compute combinations
 *
 * @param  {Array} items
 * @param  {number} size
 * @return {Array.<Array>}
 */
Cech.prototype.combinations = function(items, size) {
  var output = [];

  var fn = function(items, size, start, initial, output) {
    if (initial.length >= size) {
      output.push(initial);
    } else {
      for (var i = start; i < items.length; ++i) {
        fn(items, size, i + 1, initial.concat(items[i]), output);
      }
    }
  };

  fn(items, size, 0, [], output);

  return output;
};

/**
 * [function description]
 *
 * @param  {Array} p
 * @param  {Array} q
 * @return {Array}
 */
Cech.prototype.intersection = function(p, q) {
  var d = this.dist(p[0], q[0]);

  if (!this.intersects(p, q, d)) {
    return [];
  }

  // Find distances of dimensions from the first point
  var a = (Math.pow(p[1], 2) - Math.pow(q[1], 2) + Math.pow(d, 2)) / (2 * d);
  var h = Math.sqrt(Math.pow(p[1], 2) - Math.pow(a, 2));

  // Determine point on the line between centers perpendicular to intersects
  var point = [
    p[0][0] + a * (q[0][0] - p[0][0]) / d,
    p[0][1] + a * (q[0][1] - p[0][1]) / d
  ];

  // Calculate intersection points
  return [[
    point[0] + h * (q[0][1] - p[0][1]) / d,
    point[1] - h * (q[0][0] - p[0][0]) / d
  ], [
    point[0] - h * (q[0][1] - p[0][1]) / d,
    point[1] + h * (q[0][0] - p[0][0]) / d
  ]];
};

// export
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Cech;
}
