# Changelog

### v1.0.7
- fix: bug with epsg code calculation for UTM zones less than 10

### v1.0.6
- fix: add support for `wgs84+ellipsoid` -> `wgs84+orthometric` conversion
- feature: add `reverse` method

### v1.0.5
- add new custom units: `usft2`, `usft3`, `usyd`, `usyd2`, `usyd3`

### v1.0.4
- update default unit for density to `tonne/m3`
- update default unit for mass to `tonne`

### v1.0.3
- add support for string values that don't contain a unit

### v1.0.2
- before calling `applyMatrixToPoint` make sure `matrix` is not an empty object. If it is, call `_applyParametersAndGeoidToPoint`

### v1.0.1
- Support `transform` parameter as alias for `matrix`

### v1.0.0
- First version
