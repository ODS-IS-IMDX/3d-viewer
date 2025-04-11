# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [v1.1.6]
- feat(GeographicTilingScheme): update `tilesForPositionsAtLevel` to optionally return only
  the tiles at the specified positions instead of all tiles in the bbox

## [v1.1.5]
- fix(utm_util): utm zones less than 10 would return incorrect EPSG code

## [v1.1.4]
- feature(GeographicTilingScheme): add `degreesToMeters` static method
- feature(GeographicTilingScheme): deprecated instance methods `toRadians` `toDegrees` and `metersToDegrees` in favor of static methods

## [v1.1.3]
- fix(GeographicTilingScheme): `tileXYToRectangle` convert string x, y, and level values to integers

## [v1.1.2]
- fix(GeographicTilingScheme): `tilesForPositionsAtLevel` was only returning the tiles on each corner. It    now returns all tiles in between as well.

## [v1.1.1]
- feat(GeographicTilingScheme): support for tmsY on all methods
- feat(GeographicTilingScheme): add `tilePixelToPosition` and `tilePixelToNativePosition` methods

## [v1.1.0]
### Added
- GeographicTilingScheme to help with tile pyramid calculations
### Changed
- Use standard.js for formatting and linting
- Use husky.js for autoformatting

## [v1.0.6]
### Added
- inverse coordinate calcuations for utm & sterea

## [v1.0.5]
### Added
- geoUtil for common geographical utility functions

## [v1.0.4]
### Added
- stereaUtil for oblique stereographic projections

## [v1.0.3]
### Changed
- fixed index.js

## [v1.0.2]
### Added
- changelog

### Changed
- fixed index.js

## [v1.0.1]
### Added
- initial commit
