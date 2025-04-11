'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.array.for-each');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es6.regexp.split');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.to-string');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.array.index-of');
require('core-js/modules/es6.object.assign');
var assert = require('assert');
var mathjs = require('mathjs');
var proj4 = _interopDefault(require('proj4'));
require('core-js/modules/es6.array.map');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var USFT_TO_METERS = 1200 / 3937;
var USYD_TO_METERS = USFT_TO_METERS * 3;

/**
 * transformPoint - Apply tranformation matrix to a point
 *
 * @param {array} matrix the transformation matrix
 * @param {array} point  [x, y, z]
 * @return {array} [x, y, z]
 */


var transformPoint = function transformPoint(matrix, point) {
  var x = matrix[0][0] * point[0] + matrix[0][1] * point[1] + matrix[0][2] * point[2] + matrix[0][3] * 1;
  var y = matrix[1][0] * point[0] + matrix[1][1] * point[1] + matrix[1][2] * point[2] + matrix[1][3] * 1;
  var z = matrix[2][0] * point[0] + matrix[2][1] * point[1] + matrix[2][2] * point[2] + matrix[2][3] * 1;
  return {
    x: x,
    y: y,
    z: z
  };
};

var getProj4FromZone = function getProj4FromZone(zone) {
  var isSouth = zone.substr(-1, 1).toLowerCase() === 's';

  if (zone < 1 || zone > 60) {
    throw new Error('UTM zone invalid');
  }

  if (isSouth) {
    return "+proj=utm +zone=".concat(zone, " +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
  } else {
    return "+proj=utm +zone=".concat(zone, " +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
  }
};

var UnitConverter =
/*#__PURE__*/
function () {
  /**
   *
   * @param {object} params
   * @param {object} params.outputMeasurementSystem The output measurementSystem to be used
   * @param {object} [params.inputMeasurementSystem] The input measurementSystem to be used
   * @param {object} [params.matrix] The transform matrix. If not set `parameters` must be set
   * @param {object} [params.parameters] The transform parameters. If not set `matrix` must be set
   * @param {object} [params.geoidHeight] The geoid height to apply. Only used when transforming using parameters.
   */
  function UnitConverter() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UnitConverter);

    Object.assign(this, {
      inputMeasurementSystem: UnitConverter.defaultInputMeasurementSystem,
      inputZRef: 'ellipsoid',
      // ignored when using matrix transformation
      outputZRef: 'geoid',
      // ignored when using matrix transformation
      geoidHeight: 0
    }, params); // map this.transform to this.matrix

    if (this.transform && !this.matrix) {
      this.matrix = this.transform;
    }

    assert.strict.equal(_typeof(this.inputMeasurementSystem), 'object');
    assert.strict.equal(_typeof(this.outputMeasurementSystem), 'object');
    assert.strict.ok(['ellipsoid', 'geoid'].indexOf(this.inputZRef) !== -1, 'inputZRef must be oneof "ellipsoid" or "geoid"');
    assert.strict.ok(['ellipsoid', 'geoid'].indexOf(this.outputZRef) !== -1, 'outputZRef must be oneof "ellipsoid" or "geoid"'); // expose unit for testing

    this.unit = mathjs.unit;
  }

  _createClass(UnitConverter, [{
    key: "reverse",
    value: function reverse() {
      var params = Object.assign({}, this, {
        inputMeasurementSystem: this.outputMeasurementSystem,
        outputMeasurementSystem: this.inputMeasurementSystem,
        inputZRef: this.outputZRef,
        outputZRef: this.inputZRef
      });
      return new UnitConverter(params);
    }
  }, {
    key: "position",
    value: function position(x, y, z) {
      var matrix = this.matrix,
          parameters = this.parameters;
      assert.strict.equal(!!matrix || !!parameters, true, 'To convert a position you must specify either a transform matrix or parameters'); // matrix if present takes precendence over parameters and geoidHeight

      if (matrix && Object.keys(matrix).length > 0) {
        return this._applyMatrixToPoint.apply(this, arguments);
      }

      return this._applyParametersAndGeoidToPoint.apply(this, arguments);
    }
  }, {
    key: "_applyParametersAndGeoidToPoint",
    value: function _applyParametersAndGeoidToPoint(x, y, z) {
      assert.strict.equal(_typeof(this.parameters), 'object', 'Missing transform parameters');
      var xfinal, yfinal;
      var inputMeasurementSystem = this.inputMeasurementSystem,
          outputMeasurementSystem = this.outputMeasurementSystem,
          parameters = this.parameters,
          _this$geoidHeight = this.geoidHeight,
          geoidHeight = _this$geoidHeight === void 0 ? 0 : _this$geoidHeight,
          inputZRef = this.inputZRef,
          outputZRef = this.outputZRef;

      var inputXYUnit = this._cleanUnit(inputMeasurementSystem.position);

      var inputZUnit = this._cleanUnit(inputMeasurementSystem.length);

      var outputXYUnit = this._cleanUnit(outputMeasurementSystem.position);

      var outputZUnit = this._cleanUnit(outputMeasurementSystem.length);

      var _this$_parseValue = this._parseValue(x, inputXYUnit),
          xraw = _this$_parseValue.value;

      var _this$_parseValue2 = this._parseValue(y, inputXYUnit),
          yraw = _this$_parseValue2.value;

      var _this$_parseValue3 = this._parseValue(z, inputZUnit),
          zraw = _this$_parseValue3.value,
          zunit = _this$_parseValue3.unit;

      if (inputXYUnit === outputXYUnit) {
        xfinal = mathjs.unit(xraw, outputXYUnit).toNumeric();
        yfinal = mathjs.unit(yraw, outputXYUnit).toNumeric();
      } else if (inputXYUnit === 'dd' && outputXYUnit !== 'dd') {
        // Convert from WGS84 -> LOCAL
        var lon = xraw;
        var lat = yraw; // Convert from WGS84 to the specified projection

        var inproj = 'EPSG:4326';
        var outproj = parameters.projection.proj4;
        var coord = proj4(inproj, outproj).forward([lon, lat]);
        xfinal = coord[0];
        yfinal = coord[1];
      } else if (inputXYUnit !== 'dd' && outputXYUnit === 'dd') {
        // Convert from LOCAL => WGS84
        // 1. convert from WGS84 to the specified projection and apply the geoid height
        var _inproj = parameters.projection.proj4;
        var _outproj = 'EPSG:4326';

        var _coord = proj4(_inproj, _outproj).forward([xraw, yraw]);

        xfinal = _coord[0];
        yfinal = _coord[1];
      } // Adjust the Z
      // z value should be in meters before applying the geoid height


      var zmeter = mathjs.unit(zraw, zunit).to('m').toNumeric(); // Apply the geoid height (to get the ellipsoid/orthometric height)
      // This value is always in meters

      var zfinalm = this._applyGeoidHeight(zmeter, geoidHeight, inputZRef, outputZRef); // Convert zfinalm to output unit


      var zfinal = mathjs.unit(zfinalm, 'm').to(outputZUnit).toNumeric();
      return {
        x: mathjs.unit(xfinal, outputXYUnit),
        y: mathjs.unit(yfinal, outputXYUnit),
        z: mathjs.unit(zfinal, outputZUnit)
      };
    }
  }, {
    key: "_applyMatrixToPoint",
    value: function _applyMatrixToPoint(x, y, z) {
      assert.strict.equal(_typeof(this.matrix), 'object', 'Missing transform matrix');
      var xfinal, yfinal, zfinal;
      var inputMeasurementSystem = this.inputMeasurementSystem,
          outputMeasurementSystem = this.outputMeasurementSystem,
          matrix = this.matrix;
      var utmZone = matrix.utmZone;

      var inputXYUnit = this._cleanUnit(inputMeasurementSystem.position);

      var inputZUnit = this._cleanUnit(inputMeasurementSystem.length);

      var outputXYUnit = this._cleanUnit(outputMeasurementSystem.position);

      var outputZUnit = this._cleanUnit(outputMeasurementSystem.length);

      var _this$_parseValue4 = this._parseValue(x, inputXYUnit),
          xraw = _this$_parseValue4.value;

      var _this$_parseValue5 = this._parseValue(y, inputXYUnit),
          yraw = _this$_parseValue5.value;

      var _this$_parseValue6 = this._parseValue(z, inputZUnit),
          zraw = _this$_parseValue6.value,
          zunit = _this$_parseValue6.unit;

      if (inputXYUnit === outputXYUnit) {
        xfinal = mathjs.unit(xraw, outputXYUnit).toNumeric();
        yfinal = mathjs.unit(yraw, outputXYUnit).toNumeric();
        zfinal = mathjs.unit(zraw, zunit).to(outputZUnit).toNumeric();
      } else if (inputXYUnit === 'dd' && outputXYUnit !== 'dd') {
        // Convert from WGS84 -> LOCAL
        // 1. z value should be in meters (and assumed to be already height above ellipsoid)
        var zmeter = mathjs.unit(zraw, zunit).to('m').toNumeric();
        var lon = xraw;
        var lat = yraw; // 2. convert from WGS84 to UTM

        var inproj = 'EPSG:4326';
        var outproj = getProj4FromZone(utmZone);
        var coord = proj4(inproj, outproj).forward([lon, lat]);
        var xutm = coord[0];
        var yutm = coord[1]; // 3. convert from UTM to LOCAL

        var utm2local = matrix.utm2local;
        var res = transformPoint(utm2local, [xutm, yutm, zmeter]);
        xfinal = res.x;
        yfinal = res.y;
        zfinal = res.z;
      } else if (inputXYUnit !== 'dd' && outputXYUnit === 'dd') {
        // Convert from LOCAL -> WGS84
        // 1. convert from LOCAL to UTM
        var local2utm = matrix.local2utm;

        var _position$transformPo = transformPoint(local2utm, [xraw, yraw, zraw]),
            _xutm = _position$transformPo.x,
            _yutm = _position$transformPo.y,
            _zmeter = _position$transformPo.z; // 2. convert from UTM to WGS84
        // const inproj = position.getProj4FromCoords(lat, lon)


        var _inproj2 = getProj4FromZone(utmZone);

        var _outproj2 = 'EPSG:4326';

        var _coord2 = proj4(_inproj2, _outproj2).forward([_xutm, _yutm]);

        xfinal = _coord2[0];
        yfinal = _coord2[1]; // 3. convert z to output unit

        zfinal = mathjs.unit(_zmeter, 'm').to(outputZUnit).toNumeric();
      }

      return {
        x: mathjs.unit(xfinal, outputXYUnit),
        y: mathjs.unit(yfinal, outputXYUnit),
        z: mathjs.unit(zfinal, outputZUnit)
      };
    }
  }, {
    key: "value",
    value: function value(quantity, _value) {
      var input = this._wrapInput(quantity, _value);

      var targetUnit = this.outputMeasurementSystem[quantity];
      targetUnit = this._cleanUnit(targetUnit);
      return input.to(targetUnit);
    }
  }, {
    key: "_wrapInput",
    value: function _wrapInput(quantity, value) {
      var parsed = this._parseValue(value, this.inputMeasurementSystem[quantity]);

      var inputUnit = parsed.unit;
      value = parsed.value;
      return mathjs.unit(value, inputUnit);
    }
  }, {
    key: "_parseValue",
    value: function _parseValue(value, defaultUnit) {
      var unit = defaultUnit; // check to see if we are dealing with a string that contains units

      if (typeof value === 'string') {
        var parts = value.split(' ');
        value = parseFloat(parts.shift()); // first part will always be the value
        // this check allows us to support string value with no unit

        if (parts.length) {
          unit = parts.join(''); // remaining part is the unit
        }
      }

      unit = this._cleanUnit(unit);
      return {
        value: value,
        unit: unit
      };
    }
  }, {
    key: "_cleanUnit",
    value: function _cleanUnit(unit) {
      // mathjs unit must contain alphanumeric or / only
      return unit.replace(/[-_]/gi, '');
    }
  }, {
    key: "_applyGeoidHeight",
    value: function _applyGeoidHeight(zmeter, geoidHeight, inputZRef, outputZRef) {
      if (inputZRef === 'ellipsoid' && outputZRef === 'geoid') {
        // Compute the orthometric height
        // The formula is H = h - N, where H is orthometric height, h is ellipsoid height, and N is geoid height
        return zmeter - geoidHeight; // return the orthometric height
      } else if (inputZRef === 'geoid' && outputZRef === 'ellipsoid') {
        // Compute the ellipsoid height
        // The formula is h = H + N, where H is orthometric height, h is ellipsoid height, and N is geoid height
        return zmeter + geoidHeight; // return the ellipsoid height
      } // inputZRef and outputZRef are the same so do nothing


      return zmeter;
    }
  }], [{
    key: "defaultInputMeasurementSystem",
    get: function get() {
      return {
        position: 'dd',
        length: 'm',
        area: 'm2',
        volume: 'm3',
        mass: 'tonne',
        density: 'tonne/m3'
      };
    }
  }]);

  return UnitConverter;
}(); // setup convenience methods for simple unit transformation
['length', 'area', 'volume', 'mass', 'density'].forEach(function (method) {
  UnitConverter.prototype[method] = function () {
    return this.value.apply(this, [method].concat(Array.prototype.slice.call(arguments)));
  };
}); // setup new units ///////////////////////////////////////

mathjs.createUnit('dd');
mathjs.createUnit('usft', {
  definition: "".concat(USFT_TO_METERS, " m"),
  aliases: ['ftus']
});
mathjs.createUnit('usft2', {
  definition: "".concat(Math.pow(USFT_TO_METERS, 2), " m2"),
  aliases: ['ussqft', 'sqftus']
});
mathjs.createUnit('usft3', {
  definition: "".concat(Math.pow(USFT_TO_METERS, 3), " m3"),
  aliases: ['uscuft', 'cuftus']
});
mathjs.createUnit('usyd', {
  definition: "".concat(USYD_TO_METERS, " m"),
  aliases: ['ydus']
});
mathjs.createUnit('usyd2', {
  definition: "".concat(Math.pow(USYD_TO_METERS, 2), " m2"),
  aliases: ['ussqyd', 'sqydus']
});
mathjs.createUnit('usyd3', {
  definition: "".concat(Math.pow(USYD_TO_METERS, 3), " m3"),
  aliases: ['uscuyd', 'cuydus']
});

exports.default = UnitConverter;
//# sourceMappingURL=datahub-unit-converter.cjs.js.map
