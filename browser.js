var base64 = require('base-64');

var zpipe = require("zpipe");

var jsonpClient = require('jsonp-client');

var callback;

module.exports = function depthmapByPanoID(panoID, cb) {

  if (!panoID) {
    throw new TypeError('must provide a panoID');
  }

  if (!cb) {
    throw new TypeError('must provide a callback');
  }

  callback = cb;

  var url = "http://maps.google.com/cbk?output=json&cb_client=maps_sv&v=4&dm=1&pm=1&ph=1&hl=en&panoid=" + panoID;

  jsonpClient(addCallback(url), function(err, data) {

    if (err) {

      console.log(err);
      return;

    } else {

      decodeDepth(data);

    }
  });
  
}




function decodeDepth(data) {

  var decoded = decode(data.model.depth_map);
  var depthMap = parse(decoded);

  var canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');

  var w = depthMap.width;
  var h = depthMap.height;

  canvas.setAttribute('width', w);
  canvas.setAttribute('height', h);

  var image = context.getImageData(0, 0, w, h);
  var y = 0

  while (y < h) {

    var x = 0

    while (x < w) {

      var c = depthMap.depthMap[y * w + x] / 50 * 255;
      image.data[4 * (y * w + x)] = c;
      image.data[4 * (y * w + x) + 1] = c;
      image.data[4 * (y * w + x) + 2] = c;
      image.data[4 * (y * w + x) + 3] = 255;
      x++

    }
    y++
  }

  context.putImageData(image, 0, 0);

  callback(canvas)


}

function parse(depthmap) {

  var depthMapData;
  var header;
  var data;
  var depthMap;

  depthMapData = new DataView(depthmap.buffer);
  header = parseHeader(depthMapData);
  data = parsePlanes(header, depthMapData);

  depthMap = computeDepthMap(header, data.indices, data.planes);

  return depthMap;

}

function parseHeader(depthMap) {

  return {

    headerSize: depthMap.getUint8(0),
    numberOfPlanes: depthMap.getUint16(1, true),
    width: depthMap.getUint16(3, true),
    height: depthMap.getUint16(5, true),
    offset: depthMap.getUint16(7, true)
  };

}

function parsePlanes(header, depthMap) {

  var planes = [],
    indices = [],
    i,
    n = [0, 0, 0],
    d,
    byteOffset;

  for (i = 0; i < header.width * header.height; ++i) {
    indices.push(depthMap.getUint8(header.offset + i));
  }

  for (i = 0; i < header.numberOfPlanes; ++i) {
    byteOffset = header.offset + header.width * header.height + i * 4 * 4;
    n[0] = depthMap.getFloat32(byteOffset, true);
    n[1] = depthMap.getFloat32(byteOffset + 4, true);
    n[2] = depthMap.getFloat32(byteOffset + 8, true);
    d = depthMap.getFloat32(byteOffset + 12, true);
    planes.push({
      n: n.slice(0),
      d: d
    });
  }

  return {
    planes: planes,
    indices: indices
  };
}

function computeDepthMap(header, indices, planes) {
  var depthMap = null,
    x, y,
    planeIdx,
    phi, theta,
    v = [0, 0, 0],
    w = header.width,
    h = header.height,
    plane, t, p;

  depthMap = new Float32Array(w * h);

  var sin_theta = new Float32Array(h);
  var cos_theta = new Float32Array(h);
  var sin_phi = new Float32Array(w);
  var cos_phi = new Float32Array(w);

  for (y = 0; y < h; ++y) {
    theta = (h - y - 0.5) / h * Math.PI;
    sin_theta[y] = Math.sin(theta);
    cos_theta[y] = Math.cos(theta);
  }
  for (x = 0; x < w; ++x) {
    phi = (w - x - 0.5) / w * 2 * Math.PI + Math.PI / 2;
    sin_phi[x] = Math.sin(phi);
    cos_phi[x] = Math.cos(phi);
  }

  for (y = 0; y < h; ++y) {
    for (x = 0; x < w; ++x) {
      planeIdx = indices[y * w + x];

      v[0] = sin_theta[y] * cos_phi[x];
      v[1] = sin_theta[y] * sin_phi[x];
      v[2] = cos_theta[y];

      if (planeIdx > 0) {
        plane = planes[planeIdx];

        t = Math.abs(plane.d / (v[0] * plane.n[0] + v[1] * plane.n[1] + v[2] * plane.n[2]));
        depthMap[y * w + (w - x - 1)] = t;
      } else {
        depthMap[y * w + (w - x - 1)] = 9999999999999999999.;
      }
    }
  }

  return {
    width: w,
    height: h,
    depthMap: depthMap
  };
}

function decode(rawDepthMap) {

  var compressedDepthMapData;
  var depthMap;
  var decompressedDepthMap;

  // Append '=' in order to make the length of the array a multiple of 4
  while (rawDepthMap.length % 4 != 0) {

    rawDepthMap += '=';

  }
  // Replace '-' by '+' and '_' by '/'
  rawDepthMap = rawDepthMap.replace(/-/g, '+');
  rawDepthMap = rawDepthMap.replace(/_/g, '/');

  // Decode and decompress data
  compressedDepthMapData = base64.decode(rawDepthMap);
  decompressedDepthMap = zpipe.inflate(compressedDepthMapData);

  // Convert output of decompressor to Uint8Array
  depthMap = new Uint8Array(decompressedDepthMap.length);

  for (var i = 0; i < decompressedDepthMap.length; ++i) {

    depthMap[i] = decompressedDepthMap.charCodeAt(i);

  }
  return depthMap;
}


function addCallback(url) {
  // The URL already has a callback
  if (url.match(/callback=[a-z]/i)) {
    return url;
  }
  return url + ("&callback=cb" + Math.random()).replace('.', '');
}

