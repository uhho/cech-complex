var canvas = document.getElementById('canvas');
paper.setup(canvas);
var width = paper.view.size.width;
var height = paper.view.size.height;
var strokeColor = new paper.Color(116 / 255, 25 / 255, 125 / 255, 0.2);
var fillColor = new paper.Color(116 / 255, 25 / 255, 125 / 255, 0.1);
var cech = new Cech();

var cellR = 90;
var a = generateData(200, 200, 160, 11, cellR);
var b = generateData(200, 200, 120, 9, cellR);
var c = generateData(440, 200, 140, 9, cellR);
var d = generateData(440, 200, 100, 7, cellR);
var cells = a.concat(b, c, d);

var l = cells.length;
var cell;
var variance = 20;
while (l--) {
  cell = cells[l];
  cell[0][0] = Math.max(
    0,
    cell[0][0] + (Math.random() * variance) - variance / 2
  );
  cell[0][1] = Math.max(
    0,
    cell[0][1] + (Math.random() * variance) - variance / 2
  );
}
draw(cells);

/******************************************************************************/

function draw(cells) {
  paper.project.clear();
  var S = cech.complex(cells, 2);
  drawCircles(cells);
  drawLines(S[1]);
  for (var i = 2, l = S.length; i < l; i++) {
    drawFaces(S[i], l);
  }

  paper.view.draw();
}

function drawCircles(cells) {
  var circles = [];

  for (var i = 0, l = cells.length; i < l; i++) {
    var cell = cells[i];
    var point = new paper.Group({
      children: [
        new paper.Path.Circle({radius: 2,　fillColor: fillColor}),
        new paper.Path.Circle({radius: cell[1],　strokeColor: '#ddd'})
      ],
      position: cell[0]
    });
    circles.push(point);
  }
  return circles;
}

function drawLines(S) {
  var lines = [];

  for (var i = 0, l = S.length; i < l; i++) {
    var comb = cech.combinations(S[i], 2);
    for (var j = 0; j < comb.length; j++) {
      var pointA = cells[comb[j][0]][0];
      var pointB = cells[comb[j][1]][0];
      var line = new paper.Path.Line({
        from: pointA,
        to: pointB,
        strokeColor: strokeColor
      });
      lines.push(line);
    }
  }
  return lines;
}

function drawFaces(S, max) {
  var faces = [];

  for (var i = 0, l = S.length; i < l; i++) {
    var comb = cech.combinations(S[i], 3);
    for (var j = 0; j < comb.length; j++) {
      var face = new paper.Path({
        segments: [
          cells[comb[j][0]][0],
          cells[comb[j][1]][0],
          cells[comb[j][2]][0]
        ],
        closed: true,
        fillColor: fillColor,
        strokeColor: strokeColor
      });
      faces.push(face);
    }
  }

  return faces;
}

function generateData(h, k, R, len, r) {
  var cells = [];
  var step = (2 * Math.PI / len) + Math.random() * 0.1;
  var twoPI = 2 * Math.PI;

  for (var theta = 0; theta < twoPI; theta += step) {
    var x = h + R * Math.cos(theta);
    x += (Math.random() * 20) - 10;
    var y = k - R * Math.sin(theta);
    y += (Math.random() * 20) - 10;

    cells.push([[x, y], r]);
  }

  return cells;
}
