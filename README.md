# google-panorama-zoom-level

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Find the best zoom level for StreetView panoramas based on the specified maximum texture dimension. This is useful to avoid WebGL texture limits on low-end hardware.

Example:

```js
var level = require('google-panorama-zoom-level')

level(4096) // -> 3
level(2048) // -> 2
```

A typical usage with WebGL capabilities:

```js
var level = require('google-panorama-zoom-level')
var gl = require('webgl-context')()

var maxSize = gl.getParameteri(gl.MAX_TEXTURE_SIZE)
var zoom = level(maxSize)
```

## Usage

[![NPM](https://nodei.co/npm/google-panorama-zoom-level.png)](https://www.npmjs.com/package/google-panorama-zoom-level)

#### `zoom = level(maxSize)`

Returns the best zoom level for the given `maxSize` texture dimension. A stitched StreetView panoramic image at that zoom level will be equal or less than `maxSize`.

## See Also

- [google-panorama-by-tiles](https://github.com/Jam3/google-panorama-by-tiles)
- [google-panorama-by-id](https://github.com/Jam3/google-panorama-by-id)
- [google-panorama-by-location](https://github.com/Jam3/google-panorama-by-location)
- [google-panorama-equirectangular](https://github.com/mattdesl/google-panorama-equirectangular)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/google-panorama-zoom-level/blob/master/LICENSE.md) for details.
