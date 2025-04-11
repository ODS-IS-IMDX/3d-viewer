# datahub-unit-converter
Module to convert units from metric / latlon to the target measurement and coordinate system using Site CCRS information

## Usage

All returned values are a [MathJS Unit](https://mathjs.org/docs/datatypes/units.html) so you will want to use either the `toNumeric` or `toString` methods for display

> NOTE: Because we use MathJS to handle all unit conversions, internally we strip the unit abbreviation of non-alphanumeric values. The only time this will affect you is when using the `toString` method because the printed unit abbreviation will have the non-alphanumeric characters stripped. For example `us-ft` will become `usft`

*Code Example*

```javascript
// when converting meters to us-ft the unit abbreviation will have the `-` stripped
console.log(convert.length('3.048006096 m').toString()) // > 10 usft
```

```javascript
// To convert standard quantities you must specify an outputMeasurementSystem
const outputMeasurementSystem = { ... }

// To convert a position you must specify transform or parameters and geoidHeight
const transform = { ... }
const parameters = { ... }
const geoidHeight = 0 // value in meters

const convert = new UnitConverter({
  outputMeasurementSystem,
  transform,
  parameters,
  geoidHeight
})

// convert a position with default input unit (dd, dd, m)
const { x, y, z } = convert.position(32.1839414, -140.8990672, 16.471)
// convert a length with default input unit (m)
convert.length(3.376)
// convert a length with input unit specified
convert.length('10.837 ft')
// convert an area with the default input unit (m2)
convert.area(36.818)
// convert an area with with input unit specified
convert.area('36.818 m2')
// convert a volume with the default input unit (m3)
convert.volume(1178.215)
// convert a volume with with input unit specified
convert.volume('1178.215 m3')
// convert a mass with with input unit specified
convert.mass('74.11 kg')
// convert a density
convert.density('1.03 kg/m3')
```

## Test Report

PASS  lib/position.spec.js
PASS  lib/unit-converter.spec.js

File               |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-------------------|----------|----------|----------|----------|-------------------|
All files          |    94.27 |    83.08 |    85.71 |    94.84 |                   |
 constants.js      |      100 |      100 |      100 |      100 |                   |
 index.js          |        0 |        0 |        0 |        0 |                   |
 position.js       |    76.92 |    66.67 |     62.5 |    78.38 |... ,8,10,53,92,93 |
 unit-converter.js |      100 |    90.91 |      100 |      100 |    20,100,128,211 |

```
Test Suites: 2 passed, 2 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        3.125s
Ran all test suites.
```