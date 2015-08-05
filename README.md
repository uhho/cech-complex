# Cech complex in JavaScript

Small library for building generalized Cech Complex as described in the following paper:
[*"Construction of the generalized Cech complex"*](https://hal.archives-ouvertes.fr/hal-01069775v2)
by Ngoc Khuyen Le, Philippe Martins, Laurent Decreusefond, Anais Vergne.

Generalized Cech Comples is a ["good cover"](https://en.wikipedia.org/wiki/Cover_%28topology%29) where each cell has different radius (as opposed to standard Cech complex, where radius is always the same).
This approach is very useful for analysing coverage of wireless networks, sensors, etc.

## Installation

```bash
npm install cech-complex
```

or in browser

```bash
bower install cech-complex
```

## Usage
```js
var Cech = require('cech-complex');
var cech = new Cech();

var cells = [
  [[0, 0], 10], // [ [x, y], radius ]
  [[1, 1], 10],
  // ...
];

var simplices = cech.complex(cells);
/*
[
  [[0], [1], ... ], // 0-simplex (points)
  [[0,1], [0,5], ...], // 1-simplex (edges)
  [[0,1,5], [0,1,9], ...], // 2-simplex (triangles)
  ... // 3-simplex (tetrahedrons)
]
*/

```

For faster computation you can limit the number of simplices dimensions:
```js
var simplices = cech.comples(cells, 2); // build up to 2-simplex
```

## Test

To test, install `mocha` globally and run following command:
```bash
npm test
```

## Future releases
- computing vertices index
- cycles and boundaries
- betti numbers
