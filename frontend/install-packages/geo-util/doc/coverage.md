# Code Quality Report  
Tue Aug 20 2024 15:32:43 GMT+0900 (Japan Standard Time)  
  
## Tests
    
**GeoUtil**  
  
**GeoUtil#getCenter**  
✔ 1) returns the center (1 ms)  
  
**GeographicTilingScheme**  
  
**constants**  
✔ 2) ELLIPSOID_MAX_RADIUS: equals 6378137 (0 ms)  
  
**metersToDegrees**  
✔ 3) should convert meters to decimal degrees (0 ms)  
✔ 4) DEPRECATED: should convert meters to decimal degrees (0 ms)  
  
**degreesToMeters**  
✔ 5) should convert meters to decimal degrees (0 ms)  
  
**getLevelMaximumGeometricError**  
✔ 6) should calculate the maximum geometric error at the given level (1 ms)  
  
**positionToTileXY**  
✔ 7) [XYZ format] should calculate the tile origin for lat=37.8238667 lon=-122.3681195 level=14} (0 ms)  
✔ 8) [XYZ format] should calculate the tile origin for { lat: 37.8247935561, lon: -122.3671948879, level: 16 } (0 ms)  
✔ 9) [TMS format] should calculate the tile origin for { lat: 37.8247935561, lon: -122.3671948879, level: 16 } (0 ms)  
  
**tileXYToRectangle**  
✔ 10) [XYZ format] should calculate the tile rectangle for the tile (1 ms)  
✔ 11) [TMS format | x=5245 y=11634] should calculate the tile rectangle for the tile (1 ms)  
✔ 12) [TMS format | x=83935 y=186155] should calculate the tile rectangle for the tile (0 ms)  
  
**tileXYToNativeRectangle**  
✔ 13) [TMS format | x=83935 y=186155] should calculate the tile rectangle for the tile (0 ms)  
✔ 14) [TMS format | x=83935 y=186155] should calculate the tile rectangle for the tile (1 ms)  
✔ 15) [TMS format | x=83935 y=186155] should calculate the tile rectangle for the tile even if xy are strings (0 ms)  
  
**tilesForPositionsAtLevel**  
✔ 16) [DEPRECATED - positional args | XYZ format] should calculate the tiles needed to cover a set of positions (1 ms)  
✔ 17) [DEPRECATED - positional args | XYZ format] should calculate the tiles needed to cover a set of positions (2 ms)  
✔ 18) [XYZ format] should calculate the tiles needed to cover a set of positions (2 ms)  
✔ 19) [XYZ format | useBbbox=false] should calculate the tiles needed to cover a set of positions but NOT the entire bbox (0 ms)  
  
**rectangleForPositionsAtLevel**  
✔ 20) [XYZ format] should calculate the bounding rectangle in radians for a set of positions with a buffer applied (1 ms)  
  
**nativeRectangleForPositionsAtLevel**  
✔ 21) [XYZ format] TI - should calculate the bounding rectangle in degrees for a set of positions with NO buffer (0 ms)  
✔ 22) [XYZ format] TI - should calculate the bounding rectangle in degrees for a set of positions with a buffer applied (0 ms)  
✔ 23) [XYZ format] Koriyama - should calculate the bounding rectangle in degrees for a set of positions with NO buffer (0 ms)  
  
**tilePixelToPosition**  
✔ 24) should return the geographic x,y in radians for the given pixel of a 256x256 tile (0 ms)  
  
**tilePixelToNativePosition**  
✔ 25) should return the geographic x,y in latlon for the given pixel of a 256x256 tile (1 ms)  
  
**JGD2011Util**  
  
**JGD2011Util#getLatLonByXY**  
✔ 26) test for EPSG:6669 (0 ms)  
✔ 27) test for EPSG:6670 (1 ms)  
✔ 28) test for EPSG:6671 (0 ms)  
✔ 29) test for EPSG:6672 (0 ms)  
✔ 30) test for EPSG:6673 (0 ms)  
✔ 31) test for EPSG:6674 (0 ms)  
✔ 32) test for EPSG:6675 (1 ms)  
✔ 33) test for EPSG:6676 (1 ms)  
✔ 34) test for EPSG:6677 (0 ms)  
✔ 35) test for EPSG:6678 (1 ms)  
✔ 36) test for EPSG:6679 (0 ms)  
✔ 37) test for EPSG:6680 (1 ms)  
✔ 38) test for EPSG:6681 (0 ms)  
✔ 39) test for EPSG:6682 (1 ms)  
✔ 40) test for EPSG:6683 (0 ms)  
✔ 41) test for EPSG:6684 (0 ms)  
✔ 42) test for EPSG:6685 (0 ms)  
✔ 43) test for EPSG:6686 (1 ms)  
✔ 44) test for EPSG:6687 (0 ms)  
  
**JGD2011Util#getGeoidHeight**  
✔ 45) call getGeoidHeight succeed 1 (77 ms)  
✔ 46) call getGeoidHeight succeed 2 (12 ms)  
✔ 47) call getGeoidHeight succeed 3 (20 ms)  
✔ 48) call getGeoidHeight succeed 4 (19 ms)  
✔ 49) call getGeoidHeight succeed 5 (24 ms)  
✔ 50) call getGeoidHeight succeed 6 (18 ms)  
✔ 51) call getGeoidHeight succeed 7 (21 ms)  
✔ 52) call getGeoidHeight succeed 8 (19 ms)  
✔ 53) call getGeoidHeight succeed 9 (22 ms)  
✔ 54) call getGeoidHeight succeed 10 (19 ms)  
✔ 55) call getGeoidHeight succeed 11 (31 ms)  
✔ 56) call getGeoidHeight succeed 12 (2 ms)  
✔ 57) call getGeoidHeight succeed 13 (3 ms)  
✔ 58) call getGeoidHeight succeed 14 (4 ms)  
✔ 59) call getGeoidHeight succeed 15 (2 ms)  
✔ 60) call getGeoidHeight succeed 16 (8 ms)  
  
**StereaUtil**  
  
**StereaUtil#getProj4**  
✔ 61) returns the proj4 string from lat/lon (1 ms)  
  
**StereaUtil#getCoord**  
✔ 62) returns the projected coordinate (1 ms)  
  
**StereaUtil#getLatLon**  
✔ 63) returns the lat lon coordinate (0 ms)  
  
**UtmUtil**  
  
**UtmUtil#getZone**  
✔ 64) returns the UTM zone from lat/lon (0 ms)  
✔ 65) throws an error on invalid lat/lon (1 ms)  
  
**UtmUtil#getProj4**  
✔ 66) returns the proj4 string (0 ms)  
✔ 67) throws an error on invalid utm zone (0 ms)  
  
**UtmUtil#getCoord**  
✔ 68) returns the UTM coordinate (1 ms)  
✔ 69) returns the UTM coordinate of given zone (0 ms)  
  
**UtmUtil#getLatLon**  
✔ 70) returns the lat/lon coordinate (1 ms)  
  
**UtmUtil#getCustomProj4**  
✔ 71) returns proj4 string for any given lat/lon (0 ms)  
  
**UtmUtil#getEPSGCode**  
✔ 72) returns ESPG code for any given lat/lon (0 ms)  
  
  
72 tests  
0 tests failed  
0 tests skipped  
  
Test duration: 333 ms  
  
  
## Leaks  
The following global variable leaks were detected:AggregateError, globalThis, FinalizationRegistry, WeakRef, DOMException, AbortController, AbortSignal, Event, EventTarget, TransformStream, TransformStreamDefaultController, WritableStream, WritableStreamDefaultController, WritableStreamDefaultWriter, ReadableStream, ReadableStreamDefaultReader, ReadableStreamBYOBReader, ReadableStreamBYOBRequest, ReadableByteStreamController, ReadableStreamDefaultController, ByteLengthQueuingStrategy, CountQueuingStrategy, TextEncoderStream, TextDecoderStream, CompressionStream, DecompressionStream, structuredClone, atob, btoa, BroadcastChannel, MessageChannel, MessagePort, MessageEvent, Blob, File, Performance, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceObserver, PerformanceObserverEntryList, PerformanceResourceTiming, performance, fetch, FormData, Headers, Request, Response, crypto, Crypto, CryptoKey, SubtleCrypto, CustomEvent  
  
  
## Coverage  
Threshold: 0%  
Coverage: 99.98% (33/163275)  
  
