var Cech = require('../lib/cech.js');

describe('Cech', function() {
  var cells = [
    [[0, 0], 3],
    [[0, 1], 3],
    [[1, 0], 3],
    [[1, 1], 3]
  ];

  describe('complex', function() {
    it('should create correct Cech complex', function(done) {
      var cech = new Cech();
      cech.complex(cells);
      cech.S[3].should.eql([[0, 1, 2, 3]]);
      cech.S.length.should.eql(4);
      done();
    });
  });
});
