//경도 위도 두 지점 거리 계산 m 단위
function calcDistance(lat1, lon1, lat2, lon2)
{
  var theta = lon1 - lon2;
  dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1))
        * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return Number(dist*1000).toFixed(2);
}

function deg2rad(deg) {
  return (deg * Math.PI / 180);
}
function rad2deg(rad) {
  return (rad * 180 / Math.PI);
}

module.exports = calcDistance;