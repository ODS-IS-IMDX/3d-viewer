const METER_DISTANCE = 3000;

window.convert = function(lat = 0, lng = 0, distance = METER_DISTANCE) {
  const turf = require("@turf/turf");
  const point = turf.point([lng, lat]);
  const buffer = turf.buffer(point, distance, { units: "meters" });
  const bbox = turf.bbox(buffer);

  const [left, bottom, right, top] = bbox;

  const location = {
    lat,
    lng,
    zoom: 17,
    bounds: { top, left, right, bottom },
  };

  return location;
}
