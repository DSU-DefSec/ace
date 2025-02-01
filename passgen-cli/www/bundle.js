/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/fs.js":
/*!*******************!*\
  !*** ./src/fs.js ***!
  \*******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _zenfs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zenfs/core */ "./src/node_modules/@zenfs/core/dist/index.js");
/* harmony import */ var _zenfs_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @zenfs/dom */ "./src/node_modules/@zenfs/dom/dist/index.js");



await (0,_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.configure)({
    mounts: {
        "/": _zenfs_dom__WEBPACK_IMPORTED_MODULE_1__.WebStorage
    },
	addDevices: true,
});

const decoder = new TextDecoder();

const stdio = {};

let err_buffer = "";
let out_buffer = "";

const old_writeSync = _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.fs.writeSync;
stdio.writeSync = (fd, buf) => {
    if(fd == 1) {
        out_buffer += decoder.decode(buf);
        if(out_buffer.includes("\n")) {
            let line = out_buffer.split("\n", 1)[0];
            console.log(line);
            out_buffer = out_buffer.slice(line.length+1);
        }
        return buf.length;
    } else if(fd == 2) {
        err_buffer += decoder.decode(buf);
        if(err_buffer.includes("\n")) {
            let line = err_buffer.split("\n", 1)[0];
            console.error(line);
            err_buffer = err_buffer.slice(line.length+1);
        }
        return buf.length;
    } else {
        return old_writeSync(fd, buf);
    }
};

const old_write = _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.fs.write;
stdio.write = (fd, buf, offset, length, position, callback) => {
    if(fd == 1) {
        out_buffer += decoder.decode(buf.slice(offset, offset+length));
        if(out_buffer.includes("\n")) {
            let line = out_buffer.split("\n", 1)[0];
            console.log(line);
            out_buffer = out_buffer.slice(line.length+1);
        }
        callback(null, length, buf);
    } else if(fd == 2) {
        err_buffer += decoder.decode(buf.slice(offset, offset+length));
        if(err_buffer.includes("\n")) {
            let line = err_buffer.split("\n", 1)[0];
            console.error(line);
            err_buffer = err_buffer.slice(line.length+1);
        }
        callback(null, length, buf);
    } else {
        return old_write(fd, buf, offset, length, position, callback);
    }
}

const old_read = _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.fs.read;
stdio.read = (fd, buffer, offset, length, position, callback) => {
    if(fd == 0) {
        // console.log(decoder.decode(buf.slice(offset, offset+length)));
        const err = new Error("stdin is closed");
        err.code = "EBADF";
        callback(err, 0, buffer);
    } else {
        return old_read(fd, buffer, offset, length, position, callback);
    }
}

const handler = {
    get(target, property) {
        return stdio[property] || target[property];
    }
}

globalThis.fs = new Proxy(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.fs, handler);

// let file = await fs.open("/test.txt", "w");

// await file.write("Hello, World!\n");

// await file.close();


// fs.writeFileSync('/test.txt', 'This will persist across reloads!');

// const contents = fs.readFileSync('/test.txt', 'utf-8');
// console.log(contents);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/node_modules/abort-controller/browser.js":
/*!******************************************************!*\
  !*** ./src/node_modules/abort-controller/browser.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
/*globals self, window */


/*eslint-disable @mysticatea/prettier */
const { AbortController, AbortSignal } =
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    /* otherwise */ undefined
/*eslint-enable @mysticatea/prettier */

module.exports = AbortController
module.exports.AbortSignal = AbortSignal
module.exports["default"] = AbortController


/***/ }),

/***/ "./src/node_modules/base64-js/index.js":
/*!*********************************************!*\
  !*** ./src/node_modules/base64-js/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./src/node_modules/buffer/index.js":
/*!******************************************!*\
  !*** ./src/node_modules/buffer/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./src/node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./src/node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./src/node_modules/eventemitter3/index.js":
/*!*************************************************!*\
  !*** ./src/node_modules/eventemitter3/index.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./src/node_modules/events/events.js":
/*!*******************************************!*\
  !*** ./src/node_modules/events/events.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./src/node_modules/ieee754/index.js":
/*!*******************************************!*\
  !*** ./src/node_modules/ieee754/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./src/node_modules/process/browser.js":
/*!*********************************************!*\
  !*** ./src/node_modules/process/browser.js ***!
  \*********************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js":
/*!***********************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { SymbolDispose } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { AbortError, codes } = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { isNodeStream, isWebStream, kControllerErrorFunction } = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const eos = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
const { ERR_INVALID_ARG_TYPE } = codes
let addAbortListener

// This method is inlined here for readable-stream
// It also does not allow for signal to not exist on the stream
// https://github.com/nodejs/node/pull/36061#discussion_r533718029
const validateAbortSignal = (signal, name) => {
  if (typeof signal !== 'object' || !('aborted' in signal)) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
  }
}
module.exports.addAbortSignal = function addAbortSignal(signal, stream) {
  validateAbortSignal(signal, 'signal')
  if (!isNodeStream(stream) && !isWebStream(stream)) {
    throw new ERR_INVALID_ARG_TYPE('stream', ['ReadableStream', 'WritableStream', 'Stream'], stream)
  }
  return module.exports.addAbortSignalNoValidate(signal, stream)
}
module.exports.addAbortSignalNoValidate = function (signal, stream) {
  if (typeof signal !== 'object' || !('aborted' in signal)) {
    return stream
  }
  const onAbort = isNodeStream(stream)
    ? () => {
        stream.destroy(
          new AbortError(undefined, {
            cause: signal.reason
          })
        )
      }
    : () => {
        stream[kControllerErrorFunction](
          new AbortError(undefined, {
            cause: signal.reason
          })
        )
      }
  if (signal.aborted) {
    onAbort()
  } else {
    addAbortListener = addAbortListener || (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").addAbortListener)
    const disposable = addAbortListener(signal, onAbort)
    eos(stream, disposable[SymbolDispose])
  }
  return stream
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/buffer_list.js":
/*!******************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/buffer_list.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { Buffer } = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const { inspect } = __webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
module.exports = class BufferList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  push(v) {
    const entry = {
      data: v,
      next: null
    }
    if (this.length > 0) this.tail.next = entry
    else this.head = entry
    this.tail = entry
    ++this.length
  }
  unshift(v) {
    const entry = {
      data: v,
      next: this.head
    }
    if (this.length === 0) this.tail = entry
    this.head = entry
    ++this.length
  }
  shift() {
    if (this.length === 0) return
    const ret = this.head.data
    if (this.length === 1) this.head = this.tail = null
    else this.head = this.head.next
    --this.length
    return ret
  }
  clear() {
    this.head = this.tail = null
    this.length = 0
  }
  join(s) {
    if (this.length === 0) return ''
    let p = this.head
    let ret = '' + p.data
    while ((p = p.next) !== null) ret += s + p.data
    return ret
  }
  concat(n) {
    if (this.length === 0) return Buffer.alloc(0)
    const ret = Buffer.allocUnsafe(n >>> 0)
    let p = this.head
    let i = 0
    while (p) {
      TypedArrayPrototypeSet(ret, p.data, i)
      i += p.data.length
      p = p.next
    }
    return ret
  }

  // Consumes a specified amount of bytes or characters from the buffered data.
  consume(n, hasStrings) {
    const data = this.head.data
    if (n < data.length) {
      // `slice` is the same for buffers and strings.
      const slice = data.slice(0, n)
      this.head.data = data.slice(n)
      return slice
    }
    if (n === data.length) {
      // First chunk is a perfect match.
      return this.shift()
    }
    // Result spans more than one buffer.
    return hasStrings ? this._getString(n) : this._getBuffer(n)
  }
  first() {
    return this.head.data
  }
  *[SymbolIterator]() {
    for (let p = this.head; p; p = p.next) {
      yield p.data
    }
  }

  // Consumes a specified amount of characters from the buffered data.
  _getString(n) {
    let ret = ''
    let p = this.head
    let c = 0
    do {
      const str = p.data
      if (n > str.length) {
        ret += str
        n -= str.length
      } else {
        if (n === str.length) {
          ret += str
          ++c
          if (p.next) this.head = p.next
          else this.head = this.tail = null
        } else {
          ret += StringPrototypeSlice(str, 0, n)
          this.head = p
          p.data = StringPrototypeSlice(str, n)
        }
        break
      }
      ++c
    } while ((p = p.next) !== null)
    this.length -= c
    return ret
  }

  // Consumes a specified amount of bytes from the buffered data.
  _getBuffer(n) {
    const ret = Buffer.allocUnsafe(n)
    const retLen = n
    let p = this.head
    let c = 0
    do {
      const buf = p.data
      if (n > buf.length) {
        TypedArrayPrototypeSet(ret, buf, retLen - n)
        n -= buf.length
      } else {
        if (n === buf.length) {
          TypedArrayPrototypeSet(ret, buf, retLen - n)
          ++c
          if (p.next) this.head = p.next
          else this.head = this.tail = null
        } else {
          TypedArrayPrototypeSet(ret, new Uint8Array(buf.buffer, buf.byteOffset, n), retLen - n)
          this.head = p
          p.data = buf.slice(n)
        }
        break
      }
      ++c
    } while ((p = p.next) !== null)
    this.length -= c
    return ret
  }

  // Make sure the linked list only shows the minimal necessary information.
  [Symbol.for('nodejs.util.inspect.custom')](_, options) {
    return inspect(this, {
      ...options,
      // Only inspect one level.
      depth: 0,
      // It should not recurse.
      customInspect: false
    })
  }
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/compose.js":
/*!**************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/compose.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { pipeline } = __webpack_require__(/*! ./pipeline */ "./src/node_modules/readable-stream/lib/internal/streams/pipeline.js")
const Duplex = __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
const { destroyer } = __webpack_require__(/*! ./destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const {
  isNodeStream,
  isReadable,
  isWritable,
  isWebStream,
  isTransformStream,
  isWritableStream,
  isReadableStream
} = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const {
  AbortError,
  codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const eos = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
module.exports = function compose(...streams) {
  if (streams.length === 0) {
    throw new ERR_MISSING_ARGS('streams')
  }
  if (streams.length === 1) {
    return Duplex.from(streams[0])
  }
  const orgStreams = [...streams]
  if (typeof streams[0] === 'function') {
    streams[0] = Duplex.from(streams[0])
  }
  if (typeof streams[streams.length - 1] === 'function') {
    const idx = streams.length - 1
    streams[idx] = Duplex.from(streams[idx])
  }
  for (let n = 0; n < streams.length; ++n) {
    if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
      // TODO(ronag): Add checks for non streams.
      continue
    }
    if (
      n < streams.length - 1 &&
      !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))
    ) {
      throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], 'must be readable')
    }
    if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
      throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], 'must be writable')
    }
  }
  let ondrain
  let onfinish
  let onreadable
  let onclose
  let d
  function onfinished(err) {
    const cb = onclose
    onclose = null
    if (cb) {
      cb(err)
    } else if (err) {
      d.destroy(err)
    } else if (!readable && !writable) {
      d.destroy()
    }
  }
  const head = streams[0]
  const tail = pipeline(streams, onfinished)
  const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head))
  const readable = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail))

  // TODO(ronag): Avoid double buffering.
  // Implement Writable/Readable/Duplex traits.
  // See, https://github.com/nodejs/node/pull/33515.
  d = new Duplex({
    // TODO (ronag): highWaterMark?
    writableObjectMode: !!(head !== null && head !== undefined && head.writableObjectMode),
    readableObjectMode: !!(tail !== null && tail !== undefined && tail.readableObjectMode),
    writable,
    readable
  })
  if (writable) {
    if (isNodeStream(head)) {
      d._write = function (chunk, encoding, callback) {
        if (head.write(chunk, encoding)) {
          callback()
        } else {
          ondrain = callback
        }
      }
      d._final = function (callback) {
        head.end()
        onfinish = callback
      }
      head.on('drain', function () {
        if (ondrain) {
          const cb = ondrain
          ondrain = null
          cb()
        }
      })
    } else if (isWebStream(head)) {
      const writable = isTransformStream(head) ? head.writable : head
      const writer = writable.getWriter()
      d._write = async function (chunk, encoding, callback) {
        try {
          await writer.ready
          writer.write(chunk).catch(() => {})
          callback()
        } catch (err) {
          callback(err)
        }
      }
      d._final = async function (callback) {
        try {
          await writer.ready
          writer.close().catch(() => {})
          onfinish = callback
        } catch (err) {
          callback(err)
        }
      }
    }
    const toRead = isTransformStream(tail) ? tail.readable : tail
    eos(toRead, () => {
      if (onfinish) {
        const cb = onfinish
        onfinish = null
        cb()
      }
    })
  }
  if (readable) {
    if (isNodeStream(tail)) {
      tail.on('readable', function () {
        if (onreadable) {
          const cb = onreadable
          onreadable = null
          cb()
        }
      })
      tail.on('end', function () {
        d.push(null)
      })
      d._read = function () {
        while (true) {
          const buf = tail.read()
          if (buf === null) {
            onreadable = d._read
            return
          }
          if (!d.push(buf)) {
            return
          }
        }
      }
    } else if (isWebStream(tail)) {
      const readable = isTransformStream(tail) ? tail.readable : tail
      const reader = readable.getReader()
      d._read = async function () {
        while (true) {
          try {
            const { value, done } = await reader.read()
            if (!d.push(value)) {
              return
            }
            if (done) {
              d.push(null)
              return
            }
          } catch {
            return
          }
        }
      }
    }
  }
  d._destroy = function (err, callback) {
    if (!err && onclose !== null) {
      err = new AbortError()
    }
    onreadable = null
    ondrain = null
    onfinish = null
    if (onclose === null) {
      callback(err)
    } else {
      onclose = callback
      if (isNodeStream(tail)) {
        destroyer(tail, err)
      }
    }
  }
  return d
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js":
/*!**************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/destroy.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */

const {
  aggregateTwoErrors,
  codes: { ERR_MULTIPLE_CALLBACK },
  AbortError
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { Symbol } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const kDestroy = Symbol('kDestroy')
const kConstruct = Symbol('kConstruct')
function checkError(err, w, r) {
  if (err) {
    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
    err.stack // eslint-disable-line no-unused-expressions

    if (w && !w.errored) {
      w.errored = err
    }
    if (r && !r.errored) {
      r.errored = err
    }
  }
}

// Backwards compat. cb() is undocumented and unused in core but
// unfortunately might be used by modules.
function destroy(err, cb) {
  const r = this._readableState
  const w = this._writableState
  // With duplex streams we use the writable side for state.
  const s = w || r
  if ((w !== null && w !== undefined && w.destroyed) || (r !== null && r !== undefined && r.destroyed)) {
    if (typeof cb === 'function') {
      cb()
    }
    return this
  }

  // We set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks
  checkError(err, w, r)
  if (w) {
    w.destroyed = true
  }
  if (r) {
    r.destroyed = true
  }

  // If still constructing then defer calling _destroy.
  if (!s.constructed) {
    this.once(kDestroy, function (er) {
      _destroy(this, aggregateTwoErrors(er, err), cb)
    })
  } else {
    _destroy(this, err, cb)
  }
  return this
}
function _destroy(self, err, cb) {
  let called = false
  function onDestroy(err) {
    if (called) {
      return
    }
    called = true
    const r = self._readableState
    const w = self._writableState
    checkError(err, w, r)
    if (w) {
      w.closed = true
    }
    if (r) {
      r.closed = true
    }
    if (typeof cb === 'function') {
      cb(err)
    }
    if (err) {
      process.nextTick(emitErrorCloseNT, self, err)
    } else {
      process.nextTick(emitCloseNT, self)
    }
  }
  try {
    self._destroy(err || null, onDestroy)
  } catch (err) {
    onDestroy(err)
  }
}
function emitErrorCloseNT(self, err) {
  emitErrorNT(self, err)
  emitCloseNT(self)
}
function emitCloseNT(self) {
  const r = self._readableState
  const w = self._writableState
  if (w) {
    w.closeEmitted = true
  }
  if (r) {
    r.closeEmitted = true
  }
  if ((w !== null && w !== undefined && w.emitClose) || (r !== null && r !== undefined && r.emitClose)) {
    self.emit('close')
  }
}
function emitErrorNT(self, err) {
  const r = self._readableState
  const w = self._writableState
  if ((w !== null && w !== undefined && w.errorEmitted) || (r !== null && r !== undefined && r.errorEmitted)) {
    return
  }
  if (w) {
    w.errorEmitted = true
  }
  if (r) {
    r.errorEmitted = true
  }
  self.emit('error', err)
}
function undestroy() {
  const r = this._readableState
  const w = this._writableState
  if (r) {
    r.constructed = true
    r.closed = false
    r.closeEmitted = false
    r.destroyed = false
    r.errored = null
    r.errorEmitted = false
    r.reading = false
    r.ended = r.readable === false
    r.endEmitted = r.readable === false
  }
  if (w) {
    w.constructed = true
    w.destroyed = false
    w.closed = false
    w.closeEmitted = false
    w.errored = null
    w.errorEmitted = false
    w.finalCalled = false
    w.prefinished = false
    w.ended = w.writable === false
    w.ending = w.writable === false
    w.finished = w.writable === false
  }
}
function errorOrDestroy(stream, err, sync) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.

  const r = stream._readableState
  const w = stream._writableState
  if ((w !== null && w !== undefined && w.destroyed) || (r !== null && r !== undefined && r.destroyed)) {
    return this
  }
  if ((r !== null && r !== undefined && r.autoDestroy) || (w !== null && w !== undefined && w.autoDestroy))
    stream.destroy(err)
  else if (err) {
    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
    err.stack // eslint-disable-line no-unused-expressions

    if (w && !w.errored) {
      w.errored = err
    }
    if (r && !r.errored) {
      r.errored = err
    }
    if (sync) {
      process.nextTick(emitErrorNT, stream, err)
    } else {
      emitErrorNT(stream, err)
    }
  }
}
function construct(stream, cb) {
  if (typeof stream._construct !== 'function') {
    return
  }
  const r = stream._readableState
  const w = stream._writableState
  if (r) {
    r.constructed = false
  }
  if (w) {
    w.constructed = false
  }
  stream.once(kConstruct, cb)
  if (stream.listenerCount(kConstruct) > 1) {
    // Duplex
    return
  }
  process.nextTick(constructNT, stream)
}
function constructNT(stream) {
  let called = false
  function onConstruct(err) {
    if (called) {
      errorOrDestroy(stream, err !== null && err !== undefined ? err : new ERR_MULTIPLE_CALLBACK())
      return
    }
    called = true
    const r = stream._readableState
    const w = stream._writableState
    const s = w || r
    if (r) {
      r.constructed = true
    }
    if (w) {
      w.constructed = true
    }
    if (s.destroyed) {
      stream.emit(kDestroy, err)
    } else if (err) {
      errorOrDestroy(stream, err, true)
    } else {
      process.nextTick(emitConstructNT, stream)
    }
  }
  try {
    stream._construct((err) => {
      process.nextTick(onConstruct, err)
    })
  } catch (err) {
    process.nextTick(onConstruct, err)
  }
}
function emitConstructNT(stream) {
  stream.emit(kConstruct)
}
function isRequest(stream) {
  return (stream === null || stream === undefined ? undefined : stream.setHeader) && typeof stream.abort === 'function'
}
function emitCloseLegacy(stream) {
  stream.emit('close')
}
function emitErrorCloseLegacy(stream, err) {
  stream.emit('error', err)
  process.nextTick(emitCloseLegacy, stream)
}

// Normalize destroy for legacy.
function destroyer(stream, err) {
  if (!stream || isDestroyed(stream)) {
    return
  }
  if (!err && !isFinished(stream)) {
    err = new AbortError()
  }

  // TODO: Remove isRequest branches.
  if (isServerRequest(stream)) {
    stream.socket = null
    stream.destroy(err)
  } else if (isRequest(stream)) {
    stream.abort()
  } else if (isRequest(stream.req)) {
    stream.req.abort()
  } else if (typeof stream.destroy === 'function') {
    stream.destroy(err)
  } else if (typeof stream.close === 'function') {
    // TODO: Don't lose err?
    stream.close()
  } else if (err) {
    process.nextTick(emitErrorCloseLegacy, stream, err)
  } else {
    process.nextTick(emitCloseLegacy, stream)
  }
  if (!stream.destroyed) {
    stream[kIsDestroyed] = true
  }
}
module.exports = {
  construct,
  destroyer,
  destroy,
  undestroy,
  errorOrDestroy
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js":
/*!*************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/duplex.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototype inheritance, this class
// prototypically inherits from Readable, and then parasitically from
// Writable.



const {
  ObjectDefineProperties,
  ObjectGetOwnPropertyDescriptor,
  ObjectKeys,
  ObjectSetPrototypeOf
} = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
module.exports = Duplex
const Readable = __webpack_require__(/*! ./readable */ "./src/node_modules/readable-stream/lib/internal/streams/readable.js")
const Writable = __webpack_require__(/*! ./writable */ "./src/node_modules/readable-stream/lib/internal/streams/writable.js")
ObjectSetPrototypeOf(Duplex.prototype, Readable.prototype)
ObjectSetPrototypeOf(Duplex, Readable)
{
  const keys = ObjectKeys(Writable.prototype)
  // Allow the keys array to be GC'ed.
  for (let i = 0; i < keys.length; i++) {
    const method = keys[i]
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method]
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options)
  Readable.call(this, options)
  Writable.call(this, options)
  if (options) {
    this.allowHalfOpen = options.allowHalfOpen !== false
    if (options.readable === false) {
      this._readableState.readable = false
      this._readableState.ended = true
      this._readableState.endEmitted = true
    }
    if (options.writable === false) {
      this._writableState.writable = false
      this._writableState.ending = true
      this._writableState.ended = true
      this._writableState.finished = true
    }
  } else {
    this.allowHalfOpen = true
  }
}
ObjectDefineProperties(Duplex.prototype, {
  writable: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writable')
  },
  writableHighWaterMark: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableHighWaterMark')
  },
  writableObjectMode: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableObjectMode')
  },
  writableBuffer: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableBuffer')
  },
  writableLength: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableLength')
  },
  writableFinished: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableFinished')
  },
  writableCorked: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableCorked')
  },
  writableEnded: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableEnded')
  },
  writableNeedDrain: {
    __proto__: null,
    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableNeedDrain')
  },
  destroyed: {
    __proto__: null,
    get() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false
      }
      return this._readableState.destroyed && this._writableState.destroyed
    },
    set(value) {
      // Backward compatibility, the user is explicitly
      // managing destroyed.
      if (this._readableState && this._writableState) {
        this._readableState.destroyed = value
        this._writableState.destroyed = value
      }
    }
  }
})
let webStreamsAdapters

// Lazy to avoid circular references
function lazyWebStreams() {
  if (webStreamsAdapters === undefined) webStreamsAdapters = {}
  return webStreamsAdapters
}
Duplex.fromWeb = function (pair, options) {
  return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options)
}
Duplex.toWeb = function (duplex) {
  return lazyWebStreams().newReadableWritablePairFromDuplex(duplex)
}
let duplexify
Duplex.from = function (body) {
  if (!duplexify) {
    duplexify = __webpack_require__(/*! ./duplexify */ "./src/node_modules/readable-stream/lib/internal/streams/duplexify.js")
  }
  return duplexify(body, 'body')
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/duplexify.js":
/*!****************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/duplexify.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */

;('use strict')
const bufferModule = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const {
  isReadable,
  isWritable,
  isIterable,
  isNodeStream,
  isReadableNodeStream,
  isWritableNodeStream,
  isDuplexNodeStream,
  isReadableStream,
  isWritableStream
} = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const eos = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
const {
  AbortError,
  codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { destroyer } = __webpack_require__(/*! ./destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const Duplex = __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
const Readable = __webpack_require__(/*! ./readable */ "./src/node_modules/readable-stream/lib/internal/streams/readable.js")
const Writable = __webpack_require__(/*! ./writable */ "./src/node_modules/readable-stream/lib/internal/streams/writable.js")
const { createDeferredPromise } = __webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const from = __webpack_require__(/*! ./from */ "./src/node_modules/readable-stream/lib/internal/streams/from.js")
const Blob = globalThis.Blob || bufferModule.Blob
const isBlob =
  typeof Blob !== 'undefined'
    ? function isBlob(b) {
        return b instanceof Blob
      }
    : function isBlob(b) {
        return false
      }
const AbortController = globalThis.AbortController || (__webpack_require__(/*! abort-controller */ "./src/node_modules/abort-controller/browser.js").AbortController)
const { FunctionPrototypeCall } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")

// This is needed for pre node 17.
class Duplexify extends Duplex {
  constructor(options) {
    super(options)

    // https://github.com/nodejs/node/pull/34385

    if ((options === null || options === undefined ? undefined : options.readable) === false) {
      this._readableState.readable = false
      this._readableState.ended = true
      this._readableState.endEmitted = true
    }
    if ((options === null || options === undefined ? undefined : options.writable) === false) {
      this._writableState.writable = false
      this._writableState.ending = true
      this._writableState.ended = true
      this._writableState.finished = true
    }
  }
}
module.exports = function duplexify(body, name) {
  if (isDuplexNodeStream(body)) {
    return body
  }
  if (isReadableNodeStream(body)) {
    return _duplexify({
      readable: body
    })
  }
  if (isWritableNodeStream(body)) {
    return _duplexify({
      writable: body
    })
  }
  if (isNodeStream(body)) {
    return _duplexify({
      writable: false,
      readable: false
    })
  }
  if (isReadableStream(body)) {
    return _duplexify({
      readable: Readable.fromWeb(body)
    })
  }
  if (isWritableStream(body)) {
    return _duplexify({
      writable: Writable.fromWeb(body)
    })
  }
  if (typeof body === 'function') {
    const { value, write, final, destroy } = fromAsyncGen(body)
    if (isIterable(value)) {
      return from(Duplexify, value, {
        // TODO (ronag): highWaterMark?
        objectMode: true,
        write,
        final,
        destroy
      })
    }
    const then = value === null || value === undefined ? undefined : value.then
    if (typeof then === 'function') {
      let d
      const promise = FunctionPrototypeCall(
        then,
        value,
        (val) => {
          if (val != null) {
            throw new ERR_INVALID_RETURN_VALUE('nully', 'body', val)
          }
        },
        (err) => {
          destroyer(d, err)
        }
      )
      return (d = new Duplexify({
        // TODO (ronag): highWaterMark?
        objectMode: true,
        readable: false,
        write,
        final(cb) {
          final(async () => {
            try {
              await promise
              process.nextTick(cb, null)
            } catch (err) {
              process.nextTick(cb, err)
            }
          })
        },
        destroy
      }))
    }
    throw new ERR_INVALID_RETURN_VALUE('Iterable, AsyncIterable or AsyncFunction', name, value)
  }
  if (isBlob(body)) {
    return duplexify(body.arrayBuffer())
  }
  if (isIterable(body)) {
    return from(Duplexify, body, {
      // TODO (ronag): highWaterMark?
      objectMode: true,
      writable: false
    })
  }
  if (
    isReadableStream(body === null || body === undefined ? undefined : body.readable) &&
    isWritableStream(body === null || body === undefined ? undefined : body.writable)
  ) {
    return Duplexify.fromWeb(body)
  }
  if (
    typeof (body === null || body === undefined ? undefined : body.writable) === 'object' ||
    typeof (body === null || body === undefined ? undefined : body.readable) === 'object'
  ) {
    const readable =
      body !== null && body !== undefined && body.readable
        ? isReadableNodeStream(body === null || body === undefined ? undefined : body.readable)
          ? body === null || body === undefined
            ? undefined
            : body.readable
          : duplexify(body.readable)
        : undefined
    const writable =
      body !== null && body !== undefined && body.writable
        ? isWritableNodeStream(body === null || body === undefined ? undefined : body.writable)
          ? body === null || body === undefined
            ? undefined
            : body.writable
          : duplexify(body.writable)
        : undefined
    return _duplexify({
      readable,
      writable
    })
  }
  const then = body === null || body === undefined ? undefined : body.then
  if (typeof then === 'function') {
    let d
    FunctionPrototypeCall(
      then,
      body,
      (val) => {
        if (val != null) {
          d.push(val)
        }
        d.push(null)
      },
      (err) => {
        destroyer(d, err)
      }
    )
    return (d = new Duplexify({
      objectMode: true,
      writable: false,
      read() {}
    }))
  }
  throw new ERR_INVALID_ARG_TYPE(
    name,
    [
      'Blob',
      'ReadableStream',
      'WritableStream',
      'Stream',
      'Iterable',
      'AsyncIterable',
      'Function',
      '{ readable, writable } pair',
      'Promise'
    ],
    body
  )
}
function fromAsyncGen(fn) {
  let { promise, resolve } = createDeferredPromise()
  const ac = new AbortController()
  const signal = ac.signal
  const value = fn(
    (async function* () {
      while (true) {
        const _promise = promise
        promise = null
        const { chunk, done, cb } = await _promise
        process.nextTick(cb)
        if (done) return
        if (signal.aborted)
          throw new AbortError(undefined, {
            cause: signal.reason
          })
        ;({ promise, resolve } = createDeferredPromise())
        yield chunk
      }
    })(),
    {
      signal
    }
  )
  return {
    value,
    write(chunk, encoding, cb) {
      const _resolve = resolve
      resolve = null
      _resolve({
        chunk,
        done: false,
        cb
      })
    },
    final(cb) {
      const _resolve = resolve
      resolve = null
      _resolve({
        done: true,
        cb
      })
    },
    destroy(err, cb) {
      ac.abort()
      cb(err)
    }
  }
}
function _duplexify(pair) {
  const r = pair.readable && typeof pair.readable.read !== 'function' ? Readable.wrap(pair.readable) : pair.readable
  const w = pair.writable
  let readable = !!isReadable(r)
  let writable = !!isWritable(w)
  let ondrain
  let onfinish
  let onreadable
  let onclose
  let d
  function onfinished(err) {
    const cb = onclose
    onclose = null
    if (cb) {
      cb(err)
    } else if (err) {
      d.destroy(err)
    }
  }

  // TODO(ronag): Avoid double buffering.
  // Implement Writable/Readable/Duplex traits.
  // See, https://github.com/nodejs/node/pull/33515.
  d = new Duplexify({
    // TODO (ronag): highWaterMark?
    readableObjectMode: !!(r !== null && r !== undefined && r.readableObjectMode),
    writableObjectMode: !!(w !== null && w !== undefined && w.writableObjectMode),
    readable,
    writable
  })
  if (writable) {
    eos(w, (err) => {
      writable = false
      if (err) {
        destroyer(r, err)
      }
      onfinished(err)
    })
    d._write = function (chunk, encoding, callback) {
      if (w.write(chunk, encoding)) {
        callback()
      } else {
        ondrain = callback
      }
    }
    d._final = function (callback) {
      w.end()
      onfinish = callback
    }
    w.on('drain', function () {
      if (ondrain) {
        const cb = ondrain
        ondrain = null
        cb()
      }
    })
    w.on('finish', function () {
      if (onfinish) {
        const cb = onfinish
        onfinish = null
        cb()
      }
    })
  }
  if (readable) {
    eos(r, (err) => {
      readable = false
      if (err) {
        destroyer(r, err)
      }
      onfinished(err)
    })
    r.on('readable', function () {
      if (onreadable) {
        const cb = onreadable
        onreadable = null
        cb()
      }
    })
    r.on('end', function () {
      d.push(null)
    })
    d._read = function () {
      while (true) {
        const buf = r.read()
        if (buf === null) {
          onreadable = d._read
          return
        }
        if (!d.push(buf)) {
          return
        }
      }
    }
  }
  d._destroy = function (err, callback) {
    if (!err && onclose !== null) {
      err = new AbortError()
    }
    onreadable = null
    ondrain = null
    onfinish = null
    if (onclose === null) {
      callback(err)
    } else {
      onclose = callback
      destroyer(w, err)
      destroyer(r, err)
    }
  }
  return d
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js":
/*!********************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).

;('use strict')
const { AbortError, codes } = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes
const { kEmptyObject, once } = __webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const { validateAbortSignal, validateFunction, validateObject, validateBoolean } = __webpack_require__(/*! ../validators */ "./src/node_modules/readable-stream/lib/internal/validators.js")
const { Promise, PromisePrototypeThen, SymbolDispose } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const {
  isClosed,
  isReadable,
  isReadableNodeStream,
  isReadableStream,
  isReadableFinished,
  isReadableErrored,
  isWritable,
  isWritableNodeStream,
  isWritableStream,
  isWritableFinished,
  isWritableErrored,
  isNodeStream,
  willEmitClose: _willEmitClose,
  kIsClosedPromise
} = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
let addAbortListener
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function'
}
const nop = () => {}
function eos(stream, options, callback) {
  var _options$readable, _options$writable
  if (arguments.length === 2) {
    callback = options
    options = kEmptyObject
  } else if (options == null) {
    options = kEmptyObject
  } else {
    validateObject(options, 'options')
  }
  validateFunction(callback, 'callback')
  validateAbortSignal(options.signal, 'options.signal')
  callback = once(callback)
  if (isReadableStream(stream) || isWritableStream(stream)) {
    return eosWeb(stream, options, callback)
  }
  if (!isNodeStream(stream)) {
    throw new ERR_INVALID_ARG_TYPE('stream', ['ReadableStream', 'WritableStream', 'Stream'], stream)
  }
  const readable =
    (_options$readable = options.readable) !== null && _options$readable !== undefined
      ? _options$readable
      : isReadableNodeStream(stream)
  const writable =
    (_options$writable = options.writable) !== null && _options$writable !== undefined
      ? _options$writable
      : isWritableNodeStream(stream)
  const wState = stream._writableState
  const rState = stream._readableState
  const onlegacyfinish = () => {
    if (!stream.writable) {
      onfinish()
    }
  }

  // TODO (ronag): Improve soft detection to include core modules and
  // common ecosystem modules that do properly emit 'close' but fail
  // this generic check.
  let willEmitClose =
    _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable
  let writableFinished = isWritableFinished(stream, false)
  const onfinish = () => {
    writableFinished = true
    // Stream should not be destroyed here. If it is that
    // means that user space is doing something differently and
    // we cannot trust willEmitClose.
    if (stream.destroyed) {
      willEmitClose = false
    }
    if (willEmitClose && (!stream.readable || readable)) {
      return
    }
    if (!readable || readableFinished) {
      callback.call(stream)
    }
  }
  let readableFinished = isReadableFinished(stream, false)
  const onend = () => {
    readableFinished = true
    // Stream should not be destroyed here. If it is that
    // means that user space is doing something differently and
    // we cannot trust willEmitClose.
    if (stream.destroyed) {
      willEmitClose = false
    }
    if (willEmitClose && (!stream.writable || writable)) {
      return
    }
    if (!writable || writableFinished) {
      callback.call(stream)
    }
  }
  const onerror = (err) => {
    callback.call(stream, err)
  }
  let closed = isClosed(stream)
  const onclose = () => {
    closed = true
    const errored = isWritableErrored(stream) || isReadableErrored(stream)
    if (errored && typeof errored !== 'boolean') {
      return callback.call(stream, errored)
    }
    if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
      if (!isReadableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
    }
    if (writable && !writableFinished) {
      if (!isWritableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
    }
    callback.call(stream)
  }
  const onclosed = () => {
    closed = true
    const errored = isWritableErrored(stream) || isReadableErrored(stream)
    if (errored && typeof errored !== 'boolean') {
      return callback.call(stream, errored)
    }
    callback.call(stream)
  }
  const onrequest = () => {
    stream.req.on('finish', onfinish)
  }
  if (isRequest(stream)) {
    stream.on('complete', onfinish)
    if (!willEmitClose) {
      stream.on('abort', onclose)
    }
    if (stream.req) {
      onrequest()
    } else {
      stream.on('request', onrequest)
    }
  } else if (writable && !wState) {
    // legacy streams
    stream.on('end', onlegacyfinish)
    stream.on('close', onlegacyfinish)
  }

  // Not all streams will emit 'close' after 'aborted'.
  if (!willEmitClose && typeof stream.aborted === 'boolean') {
    stream.on('aborted', onclose)
  }
  stream.on('end', onend)
  stream.on('finish', onfinish)
  if (options.error !== false) {
    stream.on('error', onerror)
  }
  stream.on('close', onclose)
  if (closed) {
    process.nextTick(onclose)
  } else if (
    (wState !== null && wState !== undefined && wState.errorEmitted) ||
    (rState !== null && rState !== undefined && rState.errorEmitted)
  ) {
    if (!willEmitClose) {
      process.nextTick(onclosed)
    }
  } else if (
    !readable &&
    (!willEmitClose || isReadable(stream)) &&
    (writableFinished || isWritable(stream) === false)
  ) {
    process.nextTick(onclosed)
  } else if (
    !writable &&
    (!willEmitClose || isWritable(stream)) &&
    (readableFinished || isReadable(stream) === false)
  ) {
    process.nextTick(onclosed)
  } else if (rState && stream.req && stream.aborted) {
    process.nextTick(onclosed)
  }
  const cleanup = () => {
    callback = nop
    stream.removeListener('aborted', onclose)
    stream.removeListener('complete', onfinish)
    stream.removeListener('abort', onclose)
    stream.removeListener('request', onrequest)
    if (stream.req) stream.req.removeListener('finish', onfinish)
    stream.removeListener('end', onlegacyfinish)
    stream.removeListener('close', onlegacyfinish)
    stream.removeListener('finish', onfinish)
    stream.removeListener('end', onend)
    stream.removeListener('error', onerror)
    stream.removeListener('close', onclose)
  }
  if (options.signal && !closed) {
    const abort = () => {
      // Keep it because cleanup removes it.
      const endCallback = callback
      cleanup()
      endCallback.call(
        stream,
        new AbortError(undefined, {
          cause: options.signal.reason
        })
      )
    }
    if (options.signal.aborted) {
      process.nextTick(abort)
    } else {
      addAbortListener = addAbortListener || (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").addAbortListener)
      const disposable = addAbortListener(options.signal, abort)
      const originalCallback = callback
      callback = once((...args) => {
        disposable[SymbolDispose]()
        originalCallback.apply(stream, args)
      })
    }
  }
  return cleanup
}
function eosWeb(stream, options, callback) {
  let isAborted = false
  let abort = nop
  if (options.signal) {
    abort = () => {
      isAborted = true
      callback.call(
        stream,
        new AbortError(undefined, {
          cause: options.signal.reason
        })
      )
    }
    if (options.signal.aborted) {
      process.nextTick(abort)
    } else {
      addAbortListener = addAbortListener || (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").addAbortListener)
      const disposable = addAbortListener(options.signal, abort)
      const originalCallback = callback
      callback = once((...args) => {
        disposable[SymbolDispose]()
        originalCallback.apply(stream, args)
      })
    }
  }
  const resolverFn = (...args) => {
    if (!isAborted) {
      process.nextTick(() => callback.apply(stream, args))
    }
  }
  PromisePrototypeThen(stream[kIsClosedPromise].promise, resolverFn, resolverFn)
  return nop
}
function finished(stream, opts) {
  var _opts
  let autoCleanup = false
  if (opts === null) {
    opts = kEmptyObject
  }
  if ((_opts = opts) !== null && _opts !== undefined && _opts.cleanup) {
    validateBoolean(opts.cleanup, 'cleanup')
    autoCleanup = opts.cleanup
  }
  return new Promise((resolve, reject) => {
    const cleanup = eos(stream, opts, (err) => {
      if (autoCleanup) {
        cleanup()
      }
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
module.exports = eos
module.exports.finished = finished


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/from.js":
/*!***********************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/from.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */

const { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { Buffer } = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = (__webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js").codes)
function from(Readable, iterable, opts) {
  let iterator
  if (typeof iterable === 'string' || iterable instanceof Buffer) {
    return new Readable({
      objectMode: true,
      ...opts,
      read() {
        this.push(iterable)
        this.push(null)
      }
    })
  }
  let isAsync
  if (iterable && iterable[SymbolAsyncIterator]) {
    isAsync = true
    iterator = iterable[SymbolAsyncIterator]()
  } else if (iterable && iterable[SymbolIterator]) {
    isAsync = false
    iterator = iterable[SymbolIterator]()
  } else {
    throw new ERR_INVALID_ARG_TYPE('iterable', ['Iterable'], iterable)
  }
  const readable = new Readable({
    objectMode: true,
    highWaterMark: 1,
    // TODO(ronag): What options should be allowed?
    ...opts
  })

  // Flag to protect against _read
  // being called before last iteration completion.
  let reading = false
  readable._read = function () {
    if (!reading) {
      reading = true
      next()
    }
  }
  readable._destroy = function (error, cb) {
    PromisePrototypeThen(
      close(error),
      () => process.nextTick(cb, error),
      // nextTick is here in case cb throws
      (e) => process.nextTick(cb, e || error)
    )
  }
  async function close(error) {
    const hadError = error !== undefined && error !== null
    const hasThrow = typeof iterator.throw === 'function'
    if (hadError && hasThrow) {
      const { value, done } = await iterator.throw(error)
      await value
      if (done) {
        return
      }
    }
    if (typeof iterator.return === 'function') {
      const { value } = await iterator.return()
      await value
    }
  }
  async function next() {
    for (;;) {
      try {
        const { value, done } = isAsync ? await iterator.next() : iterator.next()
        if (done) {
          readable.push(null)
        } else {
          const res = value && typeof value.then === 'function' ? await value : value
          if (res === null) {
            reading = false
            throw new ERR_STREAM_NULL_VALUES()
          } else if (readable.push(res)) {
            continue
          } else {
            reading = false
          }
        }
      } catch (err) {
        readable.destroy(err)
      }
      break
    }
  }
  return readable
}
module.exports = from


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/legacy.js":
/*!*************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/legacy.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { ArrayIsArray, ObjectSetPrototypeOf } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { EventEmitter: EE } = __webpack_require__(/*! events */ "./src/node_modules/events/events.js")
function Stream(opts) {
  EE.call(this, opts)
}
ObjectSetPrototypeOf(Stream.prototype, EE.prototype)
ObjectSetPrototypeOf(Stream, EE)
Stream.prototype.pipe = function (dest, options) {
  const source = this
  function ondata(chunk) {
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause()
    }
  }
  source.on('data', ondata)
  function ondrain() {
    if (source.readable && source.resume) {
      source.resume()
    }
  }
  dest.on('drain', ondrain)

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend)
    source.on('close', onclose)
  }
  let didOnEnd = false
  function onend() {
    if (didOnEnd) return
    didOnEnd = true
    dest.end()
  }
  function onclose() {
    if (didOnEnd) return
    didOnEnd = true
    if (typeof dest.destroy === 'function') dest.destroy()
  }

  // Don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup()
    if (EE.listenerCount(this, 'error') === 0) {
      this.emit('error', er)
    }
  }
  prependListener(source, 'error', onerror)
  prependListener(dest, 'error', onerror)

  // Remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata)
    dest.removeListener('drain', ondrain)
    source.removeListener('end', onend)
    source.removeListener('close', onclose)
    source.removeListener('error', onerror)
    dest.removeListener('error', onerror)
    source.removeListener('end', cleanup)
    source.removeListener('close', cleanup)
    dest.removeListener('close', cleanup)
  }
  source.on('end', cleanup)
  source.on('close', cleanup)
  dest.on('close', cleanup)
  dest.emit('pipe', source)

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest
}
function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn)

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn)
  else if (ArrayIsArray(emitter._events[event])) emitter._events[event].unshift(fn)
  else emitter._events[event] = [fn, emitter._events[event]]
}
module.exports = {
  Stream,
  prependListener
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/operators.js":
/*!****************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/operators.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const AbortController = globalThis.AbortController || (__webpack_require__(/*! abort-controller */ "./src/node_modules/abort-controller/browser.js").AbortController)
const {
  codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
  AbortError
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { validateAbortSignal, validateInteger, validateObject } = __webpack_require__(/*! ../validators */ "./src/node_modules/readable-stream/lib/internal/validators.js")
const kWeakHandler = (__webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js").Symbol)('kWeak')
const kResistStopPropagation = (__webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js").Symbol)('kResistStopPropagation')
const { finished } = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
const staticCompose = __webpack_require__(/*! ./compose */ "./src/node_modules/readable-stream/lib/internal/streams/compose.js")
const { addAbortSignalNoValidate } = __webpack_require__(/*! ./add-abort-signal */ "./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js")
const { isWritable, isNodeStream } = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const { deprecate } = __webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const {
  ArrayPrototypePush,
  Boolean,
  MathFloor,
  Number,
  NumberIsNaN,
  Promise,
  PromiseReject,
  PromiseResolve,
  PromisePrototypeThen,
  Symbol
} = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const kEmpty = Symbol('kEmpty')
const kEof = Symbol('kEof')
function compose(stream, options) {
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  if (isNodeStream(stream) && !isWritable(stream)) {
    throw new ERR_INVALID_ARG_VALUE('stream', stream, 'must be writable')
  }
  const composedStream = staticCompose(this, stream)
  if (options !== null && options !== undefined && options.signal) {
    // Not validating as we already validated before
    addAbortSignalNoValidate(options.signal, composedStream)
  }
  return composedStream
}
function map(fn, options) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  let concurrency = 1
  if ((options === null || options === undefined ? undefined : options.concurrency) != null) {
    concurrency = MathFloor(options.concurrency)
  }
  let highWaterMark = concurrency - 1
  if ((options === null || options === undefined ? undefined : options.highWaterMark) != null) {
    highWaterMark = MathFloor(options.highWaterMark)
  }
  validateInteger(concurrency, 'options.concurrency', 1)
  validateInteger(highWaterMark, 'options.highWaterMark', 0)
  highWaterMark += concurrency
  return async function* map() {
    const signal = (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").AbortSignalAny)(
      [options === null || options === undefined ? undefined : options.signal].filter(Boolean)
    )
    const stream = this
    const queue = []
    const signalOpt = {
      signal
    }
    let next
    let resume
    let done = false
    let cnt = 0
    function onCatch() {
      done = true
      afterItemProcessed()
    }
    function afterItemProcessed() {
      cnt -= 1
      maybeResume()
    }
    function maybeResume() {
      if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
        resume()
        resume = null
      }
    }
    async function pump() {
      try {
        for await (let val of stream) {
          if (done) {
            return
          }
          if (signal.aborted) {
            throw new AbortError()
          }
          try {
            val = fn(val, signalOpt)
            if (val === kEmpty) {
              continue
            }
            val = PromiseResolve(val)
          } catch (err) {
            val = PromiseReject(err)
          }
          cnt += 1
          PromisePrototypeThen(val, afterItemProcessed, onCatch)
          queue.push(val)
          if (next) {
            next()
            next = null
          }
          if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
            await new Promise((resolve) => {
              resume = resolve
            })
          }
        }
        queue.push(kEof)
      } catch (err) {
        const val = PromiseReject(err)
        PromisePrototypeThen(val, afterItemProcessed, onCatch)
        queue.push(val)
      } finally {
        done = true
        if (next) {
          next()
          next = null
        }
      }
    }
    pump()
    try {
      while (true) {
        while (queue.length > 0) {
          const val = await queue[0]
          if (val === kEof) {
            return
          }
          if (signal.aborted) {
            throw new AbortError()
          }
          if (val !== kEmpty) {
            yield val
          }
          queue.shift()
          maybeResume()
        }
        await new Promise((resolve) => {
          next = resolve
        })
      }
    } finally {
      done = true
      if (resume) {
        resume()
        resume = null
      }
    }
  }.call(this)
}
function asIndexedPairs(options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  return async function* asIndexedPairs() {
    let index = 0
    for await (const val of this) {
      var _options$signal
      if (
        options !== null &&
        options !== undefined &&
        (_options$signal = options.signal) !== null &&
        _options$signal !== undefined &&
        _options$signal.aborted
      ) {
        throw new AbortError({
          cause: options.signal.reason
        })
      }
      yield [index++, val]
    }
  }.call(this)
}
async function some(fn, options = undefined) {
  for await (const unused of filter.call(this, fn, options)) {
    return true
  }
  return false
}
async function every(fn, options = undefined) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }
  // https://en.wikipedia.org/wiki/De_Morgan%27s_laws
  return !(await some.call(
    this,
    async (...args) => {
      return !(await fn(...args))
    },
    options
  ))
}
async function find(fn, options) {
  for await (const result of filter.call(this, fn, options)) {
    return result
  }
  return undefined
}
async function forEach(fn, options) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }
  async function forEachFn(value, options) {
    await fn(value, options)
    return kEmpty
  }
  // eslint-disable-next-line no-unused-vars
  for await (const unused of map.call(this, forEachFn, options));
}
function filter(fn, options) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }
  async function filterFn(value, options) {
    if (await fn(value, options)) {
      return value
    }
    return kEmpty
  }
  return map.call(this, filterFn, options)
}

// Specific to provide better error to reduce since the argument is only
// missing if the stream has no items in it - but the code is still appropriate
class ReduceAwareErrMissingArgs extends ERR_MISSING_ARGS {
  constructor() {
    super('reduce')
    this.message = 'Reduce of an empty stream requires an initial value'
  }
}
async function reduce(reducer, initialValue, options) {
  var _options$signal2
  if (typeof reducer !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('reducer', ['Function', 'AsyncFunction'], reducer)
  }
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  let hasInitialValue = arguments.length > 1
  if (
    options !== null &&
    options !== undefined &&
    (_options$signal2 = options.signal) !== null &&
    _options$signal2 !== undefined &&
    _options$signal2.aborted
  ) {
    const err = new AbortError(undefined, {
      cause: options.signal.reason
    })
    this.once('error', () => {}) // The error is already propagated
    await finished(this.destroy(err))
    throw err
  }
  const ac = new AbortController()
  const signal = ac.signal
  if (options !== null && options !== undefined && options.signal) {
    const opts = {
      once: true,
      [kWeakHandler]: this,
      [kResistStopPropagation]: true
    }
    options.signal.addEventListener('abort', () => ac.abort(), opts)
  }
  let gotAnyItemFromStream = false
  try {
    for await (const value of this) {
      var _options$signal3
      gotAnyItemFromStream = true
      if (
        options !== null &&
        options !== undefined &&
        (_options$signal3 = options.signal) !== null &&
        _options$signal3 !== undefined &&
        _options$signal3.aborted
      ) {
        throw new AbortError()
      }
      if (!hasInitialValue) {
        initialValue = value
        hasInitialValue = true
      } else {
        initialValue = await reducer(initialValue, value, {
          signal
        })
      }
    }
    if (!gotAnyItemFromStream && !hasInitialValue) {
      throw new ReduceAwareErrMissingArgs()
    }
  } finally {
    ac.abort()
  }
  return initialValue
}
async function toArray(options) {
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  const result = []
  for await (const val of this) {
    var _options$signal4
    if (
      options !== null &&
      options !== undefined &&
      (_options$signal4 = options.signal) !== null &&
      _options$signal4 !== undefined &&
      _options$signal4.aborted
    ) {
      throw new AbortError(undefined, {
        cause: options.signal.reason
      })
    }
    ArrayPrototypePush(result, val)
  }
  return result
}
function flatMap(fn, options) {
  const values = map.call(this, fn, options)
  return async function* flatMap() {
    for await (const val of values) {
      yield* val
    }
  }.call(this)
}
function toIntegerOrInfinity(number) {
  // We coerce here to align with the spec
  // https://github.com/tc39/proposal-iterator-helpers/issues/169
  number = Number(number)
  if (NumberIsNaN(number)) {
    return 0
  }
  if (number < 0) {
    throw new ERR_OUT_OF_RANGE('number', '>= 0', number)
  }
  return number
}
function drop(number, options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  number = toIntegerOrInfinity(number)
  return async function* drop() {
    var _options$signal5
    if (
      options !== null &&
      options !== undefined &&
      (_options$signal5 = options.signal) !== null &&
      _options$signal5 !== undefined &&
      _options$signal5.aborted
    ) {
      throw new AbortError()
    }
    for await (const val of this) {
      var _options$signal6
      if (
        options !== null &&
        options !== undefined &&
        (_options$signal6 = options.signal) !== null &&
        _options$signal6 !== undefined &&
        _options$signal6.aborted
      ) {
        throw new AbortError()
      }
      if (number-- <= 0) {
        yield val
      }
    }
  }.call(this)
}
function take(number, options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }
  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }
  number = toIntegerOrInfinity(number)
  return async function* take() {
    var _options$signal7
    if (
      options !== null &&
      options !== undefined &&
      (_options$signal7 = options.signal) !== null &&
      _options$signal7 !== undefined &&
      _options$signal7.aborted
    ) {
      throw new AbortError()
    }
    for await (const val of this) {
      var _options$signal8
      if (
        options !== null &&
        options !== undefined &&
        (_options$signal8 = options.signal) !== null &&
        _options$signal8 !== undefined &&
        _options$signal8.aborted
      ) {
        throw new AbortError()
      }
      if (number-- > 0) {
        yield val
      }

      // Don't get another item from iterator in case we reached the end
      if (number <= 0) {
        return
      }
    }
  }.call(this)
}
module.exports.streamReturningOperators = {
  asIndexedPairs: deprecate(asIndexedPairs, 'readable.asIndexedPairs will be removed in a future version.'),
  drop,
  filter,
  flatMap,
  map,
  take,
  compose
}
module.exports.promiseReturningOperators = {
  every,
  forEach,
  reduce,
  toArray,
  some,
  find
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/passthrough.js":
/*!******************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/passthrough.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



const { ObjectSetPrototypeOf } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
module.exports = PassThrough
const Transform = __webpack_require__(/*! ./transform */ "./src/node_modules/readable-stream/lib/internal/streams/transform.js")
ObjectSetPrototypeOf(PassThrough.prototype, Transform.prototype)
ObjectSetPrototypeOf(PassThrough, Transform)
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options)
  Transform.call(this, options)
}
PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk)
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/pipeline.js":
/*!***************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/pipeline.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).

;('use strict')
const { ArrayIsArray, Promise, SymbolAsyncIterator, SymbolDispose } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const eos = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
const { once } = __webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const destroyImpl = __webpack_require__(/*! ./destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const Duplex = __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
const {
  aggregateTwoErrors,
  codes: {
    ERR_INVALID_ARG_TYPE,
    ERR_INVALID_RETURN_VALUE,
    ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED,
    ERR_STREAM_PREMATURE_CLOSE
  },
  AbortError
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { validateFunction, validateAbortSignal } = __webpack_require__(/*! ../validators */ "./src/node_modules/readable-stream/lib/internal/validators.js")
const {
  isIterable,
  isReadable,
  isReadableNodeStream,
  isNodeStream,
  isTransformStream,
  isWebStream,
  isReadableStream,
  isReadableFinished
} = __webpack_require__(/*! ./utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const AbortController = globalThis.AbortController || (__webpack_require__(/*! abort-controller */ "./src/node_modules/abort-controller/browser.js").AbortController)
let PassThrough
let Readable
let addAbortListener
function destroyer(stream, reading, writing) {
  let finished = false
  stream.on('close', () => {
    finished = true
  })
  const cleanup = eos(
    stream,
    {
      readable: reading,
      writable: writing
    },
    (err) => {
      finished = !err
    }
  )
  return {
    destroy: (err) => {
      if (finished) return
      finished = true
      destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED('pipe'))
    },
    cleanup
  }
}
function popCallback(streams) {
  // Streams should never be an empty array. It should always contain at least
  // a single stream. Therefore optimize for the average case instead of
  // checking for length === 0 as well.
  validateFunction(streams[streams.length - 1], 'streams[stream.length - 1]')
  return streams.pop()
}
function makeAsyncIterable(val) {
  if (isIterable(val)) {
    return val
  } else if (isReadableNodeStream(val)) {
    // Legacy streams are not Iterable.
    return fromReadable(val)
  }
  throw new ERR_INVALID_ARG_TYPE('val', ['Readable', 'Iterable', 'AsyncIterable'], val)
}
async function* fromReadable(val) {
  if (!Readable) {
    Readable = __webpack_require__(/*! ./readable */ "./src/node_modules/readable-stream/lib/internal/streams/readable.js")
  }
  yield* Readable.prototype[SymbolAsyncIterator].call(val)
}
async function pumpToNode(iterable, writable, finish, { end }) {
  let error
  let onresolve = null
  const resume = (err) => {
    if (err) {
      error = err
    }
    if (onresolve) {
      const callback = onresolve
      onresolve = null
      callback()
    }
  }
  const wait = () =>
    new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      } else {
        onresolve = () => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      }
    })
  writable.on('drain', resume)
  const cleanup = eos(
    writable,
    {
      readable: false
    },
    resume
  )
  try {
    if (writable.writableNeedDrain) {
      await wait()
    }
    for await (const chunk of iterable) {
      if (!writable.write(chunk)) {
        await wait()
      }
    }
    if (end) {
      writable.end()
      await wait()
    }
    finish()
  } catch (err) {
    finish(error !== err ? aggregateTwoErrors(error, err) : err)
  } finally {
    cleanup()
    writable.off('drain', resume)
  }
}
async function pumpToWeb(readable, writable, finish, { end }) {
  if (isTransformStream(writable)) {
    writable = writable.writable
  }
  // https://streams.spec.whatwg.org/#example-manual-write-with-backpressure
  const writer = writable.getWriter()
  try {
    for await (const chunk of readable) {
      await writer.ready
      writer.write(chunk).catch(() => {})
    }
    await writer.ready
    if (end) {
      await writer.close()
    }
    finish()
  } catch (err) {
    try {
      await writer.abort(err)
      finish(err)
    } catch (err) {
      finish(err)
    }
  }
}
function pipeline(...streams) {
  return pipelineImpl(streams, once(popCallback(streams)))
}
function pipelineImpl(streams, callback, opts) {
  if (streams.length === 1 && ArrayIsArray(streams[0])) {
    streams = streams[0]
  }
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams')
  }
  const ac = new AbortController()
  const signal = ac.signal
  const outerSignal = opts === null || opts === undefined ? undefined : opts.signal

  // Need to cleanup event listeners if last stream is readable
  // https://github.com/nodejs/node/issues/35452
  const lastStreamCleanup = []
  validateAbortSignal(outerSignal, 'options.signal')
  function abort() {
    finishImpl(new AbortError())
  }
  addAbortListener = addAbortListener || (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").addAbortListener)
  let disposable
  if (outerSignal) {
    disposable = addAbortListener(outerSignal, abort)
  }
  let error
  let value
  const destroys = []
  let finishCount = 0
  function finish(err) {
    finishImpl(err, --finishCount === 0)
  }
  function finishImpl(err, final) {
    var _disposable
    if (err && (!error || error.code === 'ERR_STREAM_PREMATURE_CLOSE')) {
      error = err
    }
    if (!error && !final) {
      return
    }
    while (destroys.length) {
      destroys.shift()(error)
    }
    ;(_disposable = disposable) === null || _disposable === undefined ? undefined : _disposable[SymbolDispose]()
    ac.abort()
    if (final) {
      if (!error) {
        lastStreamCleanup.forEach((fn) => fn())
      }
      process.nextTick(callback, error, value)
    }
  }
  let ret
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i]
    const reading = i < streams.length - 1
    const writing = i > 0
    const end = reading || (opts === null || opts === undefined ? undefined : opts.end) !== false
    const isLastStream = i === streams.length - 1
    if (isNodeStream(stream)) {
      if (end) {
        const { destroy, cleanup } = destroyer(stream, reading, writing)
        destroys.push(destroy)
        if (isReadable(stream) && isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      }

      // Catch stream errors that occur after pipe/pump has completed.
      function onError(err) {
        if (err && err.name !== 'AbortError' && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
          finish(err)
        }
      }
      stream.on('error', onError)
      if (isReadable(stream) && isLastStream) {
        lastStreamCleanup.push(() => {
          stream.removeListener('error', onError)
        })
      }
    }
    if (i === 0) {
      if (typeof stream === 'function') {
        ret = stream({
          signal
        })
        if (!isIterable(ret)) {
          throw new ERR_INVALID_RETURN_VALUE('Iterable, AsyncIterable or Stream', 'source', ret)
        }
      } else if (isIterable(stream) || isReadableNodeStream(stream) || isTransformStream(stream)) {
        ret = stream
      } else {
        ret = Duplex.from(stream)
      }
    } else if (typeof stream === 'function') {
      if (isTransformStream(ret)) {
        var _ret
        ret = makeAsyncIterable((_ret = ret) === null || _ret === undefined ? undefined : _ret.readable)
      } else {
        ret = makeAsyncIterable(ret)
      }
      ret = stream(ret, {
        signal
      })
      if (reading) {
        if (!isIterable(ret, true)) {
          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable', `transform[${i - 1}]`, ret)
        }
      } else {
        var _ret2
        if (!PassThrough) {
          PassThrough = __webpack_require__(/*! ./passthrough */ "./src/node_modules/readable-stream/lib/internal/streams/passthrough.js")
        }

        // If the last argument to pipeline is not a stream
        // we must create a proxy stream so that pipeline(...)
        // always returns a stream which can be further
        // composed through `.pipe(stream)`.

        const pt = new PassThrough({
          objectMode: true
        })

        // Handle Promises/A+ spec, `then` could be a getter that throws on
        // second use.
        const then = (_ret2 = ret) === null || _ret2 === undefined ? undefined : _ret2.then
        if (typeof then === 'function') {
          finishCount++
          then.call(
            ret,
            (val) => {
              value = val
              if (val != null) {
                pt.write(val)
              }
              if (end) {
                pt.end()
              }
              process.nextTick(finish)
            },
            (err) => {
              pt.destroy(err)
              process.nextTick(finish, err)
            }
          )
        } else if (isIterable(ret, true)) {
          finishCount++
          pumpToNode(ret, pt, finish, {
            end
          })
        } else if (isReadableStream(ret) || isTransformStream(ret)) {
          const toRead = ret.readable || ret
          finishCount++
          pumpToNode(toRead, pt, finish, {
            end
          })
        } else {
          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable or Promise', 'destination', ret)
        }
        ret = pt
        const { destroy, cleanup } = destroyer(ret, false, true)
        destroys.push(destroy)
        if (isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      }
    } else if (isNodeStream(stream)) {
      if (isReadableNodeStream(ret)) {
        finishCount += 2
        const cleanup = pipe(ret, stream, finish, {
          end
        })
        if (isReadable(stream) && isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      } else if (isTransformStream(ret) || isReadableStream(ret)) {
        const toRead = ret.readable || ret
        finishCount++
        pumpToNode(toRead, stream, finish, {
          end
        })
      } else if (isIterable(ret)) {
        finishCount++
        pumpToNode(ret, stream, finish, {
          end
        })
      } else {
        throw new ERR_INVALID_ARG_TYPE(
          'val',
          ['Readable', 'Iterable', 'AsyncIterable', 'ReadableStream', 'TransformStream'],
          ret
        )
      }
      ret = stream
    } else if (isWebStream(stream)) {
      if (isReadableNodeStream(ret)) {
        finishCount++
        pumpToWeb(makeAsyncIterable(ret), stream, finish, {
          end
        })
      } else if (isReadableStream(ret) || isIterable(ret)) {
        finishCount++
        pumpToWeb(ret, stream, finish, {
          end
        })
      } else if (isTransformStream(ret)) {
        finishCount++
        pumpToWeb(ret.readable, stream, finish, {
          end
        })
      } else {
        throw new ERR_INVALID_ARG_TYPE(
          'val',
          ['Readable', 'Iterable', 'AsyncIterable', 'ReadableStream', 'TransformStream'],
          ret
        )
      }
      ret = stream
    } else {
      ret = Duplex.from(stream)
    }
  }
  if (
    (signal !== null && signal !== undefined && signal.aborted) ||
    (outerSignal !== null && outerSignal !== undefined && outerSignal.aborted)
  ) {
    process.nextTick(abort)
  }
  return ret
}
function pipe(src, dst, finish, { end }) {
  let ended = false
  dst.on('close', () => {
    if (!ended) {
      // Finish if the destination closes before the source has completed.
      finish(new ERR_STREAM_PREMATURE_CLOSE())
    }
  })
  src.pipe(dst, {
    end: false
  }) // If end is true we already will have a listener to end dst.

  if (end) {
    // Compat. Before node v10.12.0 stdio used to throw an error so
    // pipe() did/does not end() stdio destinations.
    // Now they allow it but "secretly" don't close the underlying fd.

    function endFn() {
      ended = true
      dst.end()
    }
    if (isReadableFinished(src)) {
      // End the destination if the source has already ended.
      process.nextTick(endFn)
    } else {
      src.once('end', endFn)
    }
  } else {
    finish()
  }
  eos(
    src,
    {
      readable: true,
      writable: false
    },
    (err) => {
      const rState = src._readableState
      if (
        err &&
        err.code === 'ERR_STREAM_PREMATURE_CLOSE' &&
        rState &&
        rState.ended &&
        !rState.errored &&
        !rState.errorEmitted
      ) {
        // Some readable streams will emit 'close' before 'end'. However, since
        // this is on the readable side 'end' should still be emitted if the
        // stream has been ended and no error emitted. This should be allowed in
        // favor of backwards compatibility. Since the stream is piped to a
        // destination this should not result in any observable difference.
        // We don't need to check if this is a writable premature close since
        // eos will only fail with premature close on the reading side for
        // duplex streams.
        src.once('end', finish).once('error', finish)
      } else {
        finish(err)
      }
    }
  )
  return eos(
    dst,
    {
      readable: false,
      writable: true
    },
    finish
  )
}
module.exports = {
  pipelineImpl,
  pipeline
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/readable.js":
/*!***************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/readable.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

;('use strict')
const {
  ArrayPrototypeIndexOf,
  NumberIsInteger,
  NumberIsNaN,
  NumberParseInt,
  ObjectDefineProperties,
  ObjectKeys,
  ObjectSetPrototypeOf,
  Promise,
  SafeSet,
  SymbolAsyncDispose,
  SymbolAsyncIterator,
  Symbol
} = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
module.exports = Readable
Readable.ReadableState = ReadableState
const { EventEmitter: EE } = __webpack_require__(/*! events */ "./src/node_modules/events/events.js")
const { Stream, prependListener } = __webpack_require__(/*! ./legacy */ "./src/node_modules/readable-stream/lib/internal/streams/legacy.js")
const { Buffer } = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const { addAbortSignal } = __webpack_require__(/*! ./add-abort-signal */ "./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js")
const eos = __webpack_require__(/*! ./end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
let debug = (__webpack_require__(/*! ../../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").debuglog)('stream', (fn) => {
  debug = fn
})
const BufferList = __webpack_require__(/*! ./buffer_list */ "./src/node_modules/readable-stream/lib/internal/streams/buffer_list.js")
const destroyImpl = __webpack_require__(/*! ./destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const { getHighWaterMark, getDefaultHighWaterMark } = __webpack_require__(/*! ./state */ "./src/node_modules/readable-stream/lib/internal/streams/state.js")
const {
  aggregateTwoErrors,
  codes: {
    ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED,
    ERR_OUT_OF_RANGE,
    ERR_STREAM_PUSH_AFTER_EOF,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT
  },
  AbortError
} = __webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { validateObject } = __webpack_require__(/*! ../validators */ "./src/node_modules/readable-stream/lib/internal/validators.js")
const kPaused = Symbol('kPaused')
const { StringDecoder } = __webpack_require__(/*! string_decoder */ "./src/node_modules/string_decoder/lib/string_decoder.js")
const from = __webpack_require__(/*! ./from */ "./src/node_modules/readable-stream/lib/internal/streams/from.js")
ObjectSetPrototypeOf(Readable.prototype, Stream.prototype)
ObjectSetPrototypeOf(Readable, Stream)
const nop = () => {}
const { errorOrDestroy } = destroyImpl
const kObjectMode = 1 << 0
const kEnded = 1 << 1
const kEndEmitted = 1 << 2
const kReading = 1 << 3
const kConstructed = 1 << 4
const kSync = 1 << 5
const kNeedReadable = 1 << 6
const kEmittedReadable = 1 << 7
const kReadableListening = 1 << 8
const kResumeScheduled = 1 << 9
const kErrorEmitted = 1 << 10
const kEmitClose = 1 << 11
const kAutoDestroy = 1 << 12
const kDestroyed = 1 << 13
const kClosed = 1 << 14
const kCloseEmitted = 1 << 15
const kMultiAwaitDrain = 1 << 16
const kReadingMore = 1 << 17
const kDataEmitted = 1 << 18

// TODO(benjamingr) it is likely slower to do it this way than with free functions
function makeBitMapDescriptor(bit) {
  return {
    enumerable: false,
    get() {
      return (this.state & bit) !== 0
    },
    set(value) {
      if (value) this.state |= bit
      else this.state &= ~bit
    }
  }
}
ObjectDefineProperties(ReadableState.prototype, {
  objectMode: makeBitMapDescriptor(kObjectMode),
  ended: makeBitMapDescriptor(kEnded),
  endEmitted: makeBitMapDescriptor(kEndEmitted),
  reading: makeBitMapDescriptor(kReading),
  // Stream is still being constructed and cannot be
  // destroyed until construction finished or failed.
  // Async construction is opt in, therefore we start as
  // constructed.
  constructed: makeBitMapDescriptor(kConstructed),
  // A flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  sync: makeBitMapDescriptor(kSync),
  // Whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  needReadable: makeBitMapDescriptor(kNeedReadable),
  emittedReadable: makeBitMapDescriptor(kEmittedReadable),
  readableListening: makeBitMapDescriptor(kReadableListening),
  resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
  // True if the error was already emitted and should not be thrown again.
  errorEmitted: makeBitMapDescriptor(kErrorEmitted),
  emitClose: makeBitMapDescriptor(kEmitClose),
  autoDestroy: makeBitMapDescriptor(kAutoDestroy),
  // Has it been destroyed.
  destroyed: makeBitMapDescriptor(kDestroyed),
  // Indicates whether the stream has finished destroying.
  closed: makeBitMapDescriptor(kClosed),
  // True if close has been emitted or would have been emitted
  // depending on emitClose.
  closeEmitted: makeBitMapDescriptor(kCloseEmitted),
  multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
  // If true, a maybeReadMore has been scheduled.
  readingMore: makeBitMapDescriptor(kReadingMore),
  dataEmitted: makeBitMapDescriptor(kDataEmitted)
})
function ReadableState(options, stream, isDuplex) {
  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")

  // Bit map field to store ReadableState more effciently with 1 bit per field
  // instead of a V8 slot per field.
  this.state = kEmitClose | kAutoDestroy | kConstructed | kSync
  // Object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away.
  if (options && options.objectMode) this.state |= kObjectMode
  if (isDuplex && options && options.readableObjectMode) this.state |= kObjectMode

  // The point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  this.highWaterMark = options
    ? getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex)
    : getDefaultHighWaterMark(false)

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift().
  this.buffer = new BufferList()
  this.length = 0
  this.pipes = []
  this.flowing = null
  this[kPaused] = null

  // Should close be emitted on destroy. Defaults to true.
  if (options && options.emitClose === false) this.state &= ~kEmitClose

  // Should .destroy() be called after 'end' (and potentially 'finish').
  if (options && options.autoDestroy === false) this.state &= ~kAutoDestroy

  // Indicates whether the stream has errored. When true no further
  // _read calls, 'data' or 'readable' events should occur. This is needed
  // since when autoDestroy is disabled we need a way to tell whether the
  // stream has failed.
  this.errored = null

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = (options && options.defaultEncoding) || 'utf8'

  // Ref the piped dest which we need a drain event on it
  // type: null | Writable | Set<Writable>.
  this.awaitDrainWriters = null
  this.decoder = null
  this.encoding = null
  if (options && options.encoding) {
    this.decoder = new StringDecoder(options.encoding)
    this.encoding = options.encoding
  }
}
function Readable(options) {
  if (!(this instanceof Readable)) return new Readable(options)

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5.
  const isDuplex = this instanceof __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
  this._readableState = new ReadableState(options, this, isDuplex)
  if (options) {
    if (typeof options.read === 'function') this._read = options.read
    if (typeof options.destroy === 'function') this._destroy = options.destroy
    if (typeof options.construct === 'function') this._construct = options.construct
    if (options.signal && !isDuplex) addAbortSignal(options.signal, this)
  }
  Stream.call(this, options)
  destroyImpl.construct(this, () => {
    if (this._readableState.needReadable) {
      maybeReadMore(this, this._readableState)
    }
  })
}
Readable.prototype.destroy = destroyImpl.destroy
Readable.prototype._undestroy = destroyImpl.undestroy
Readable.prototype._destroy = function (err, cb) {
  cb(err)
}
Readable.prototype[EE.captureRejectionSymbol] = function (err) {
  this.destroy(err)
}
Readable.prototype[SymbolAsyncDispose] = function () {
  let error
  if (!this.destroyed) {
    error = this.readableEnded ? null : new AbortError()
    this.destroy(error)
  }
  return new Promise((resolve, reject) => eos(this, (err) => (err && err !== error ? reject(err) : resolve(null))))
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  return readableAddChunk(this, chunk, encoding, false)
}

// Unshift should *always* be something directly out of read().
Readable.prototype.unshift = function (chunk, encoding) {
  return readableAddChunk(this, chunk, encoding, true)
}
function readableAddChunk(stream, chunk, encoding, addToFront) {
  debug('readableAddChunk', chunk)
  const state = stream._readableState
  let err
  if ((state.state & kObjectMode) === 0) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding
      if (state.encoding !== encoding) {
        if (addToFront && state.encoding) {
          // When unshifting, if state.encoding is set, we have to save
          // the string in the BufferList with the state encoding.
          chunk = Buffer.from(chunk, encoding).toString(state.encoding)
        } else {
          chunk = Buffer.from(chunk, encoding)
          encoding = ''
        }
      }
    } else if (chunk instanceof Buffer) {
      encoding = ''
    } else if (Stream._isUint8Array(chunk)) {
      chunk = Stream._uint8ArrayToBuffer(chunk)
      encoding = ''
    } else if (chunk != null) {
      err = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk)
    }
  }
  if (err) {
    errorOrDestroy(stream, err)
  } else if (chunk === null) {
    state.state &= ~kReading
    onEofChunk(stream, state)
  } else if ((state.state & kObjectMode) !== 0 || (chunk && chunk.length > 0)) {
    if (addToFront) {
      if ((state.state & kEndEmitted) !== 0) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT())
      else if (state.destroyed || state.errored) return false
      else addChunk(stream, state, chunk, true)
    } else if (state.ended) {
      errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF())
    } else if (state.destroyed || state.errored) {
      return false
    } else {
      state.state &= ~kReading
      if (state.decoder && !encoding) {
        chunk = state.decoder.write(chunk)
        if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false)
        else maybeReadMore(stream, state)
      } else {
        addChunk(stream, state, chunk, false)
      }
    }
  } else if (!addToFront) {
    state.state &= ~kReading
    maybeReadMore(stream, state)
  }

  // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.
  return !state.ended && (state.length < state.highWaterMark || state.length === 0)
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount('data') > 0) {
    // Use the guard to avoid creating `Set()` repeatedly
    // when we have multiple pipes.
    if ((state.state & kMultiAwaitDrain) !== 0) {
      state.awaitDrainWriters.clear()
    } else {
      state.awaitDrainWriters = null
    }
    state.dataEmitted = true
    stream.emit('data', chunk)
  } else {
    // Update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length
    if (addToFront) state.buffer.unshift(chunk)
    else state.buffer.push(chunk)
    if ((state.state & kNeedReadable) !== 0) emitReadable(stream)
  }
  maybeReadMore(stream, state)
}
Readable.prototype.isPaused = function () {
  const state = this._readableState
  return state[kPaused] === true || state.flowing === false
}

// Backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  const decoder = new StringDecoder(enc)
  this._readableState.decoder = decoder
  // If setEncoding(null), decoder.encoding equals utf8.
  this._readableState.encoding = this._readableState.decoder.encoding
  const buffer = this._readableState.buffer
  // Iterate over current buffer to convert already stored Buffers:
  let content = ''
  for (const data of buffer) {
    content += decoder.write(data)
  }
  buffer.clear()
  if (content !== '') buffer.push(content)
  this._readableState.length = content.length
  return this
}

// Don't raise the hwm > 1GB.
const MAX_HWM = 0x40000000
function computeNewHighWaterMark(n) {
  if (n > MAX_HWM) {
    throw new ERR_OUT_OF_RANGE('size', '<= 1GiB', n)
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts.
    n--
    n |= n >>> 1
    n |= n >>> 2
    n |= n >>> 4
    n |= n >>> 8
    n |= n >>> 16
    n++
  }
  return n
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || (state.length === 0 && state.ended)) return 0
  if ((state.state & kObjectMode) !== 0) return 1
  if (NumberIsNaN(n)) {
    // Only flow one buffer at a time.
    if (state.flowing && state.length) return state.buffer.first().length
    return state.length
  }
  if (n <= state.length) return n
  return state.ended ? state.length : 0
}

// You can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n)
  // Same as parseInt(undefined, 10), however V8 7.3 performance regressed
  // in this scenario, so we are doing it manually.
  if (n === undefined) {
    n = NaN
  } else if (!NumberIsInteger(n)) {
    n = NumberParseInt(n, 10)
  }
  const state = this._readableState
  const nOrig = n

  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n)
  if (n !== 0) state.state &= ~kEmittedReadable

  // If we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (
    n === 0 &&
    state.needReadable &&
    ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)
  ) {
    debug('read: emitReadable', state.length, state.ended)
    if (state.length === 0 && state.ended) endReadable(this)
    else emitReadable(this)
    return null
  }
  n = howMuchToRead(n, state)

  // If we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this)
    return null
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  let doRead = (state.state & kNeedReadable) !== 0
  debug('need readable', doRead)

  // If we currently have less than the highWaterMark, then also read some.
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true
    debug('length less than watermark', doRead)
  }

  // However, if we've ended, then there's no point, if we're already
  // reading, then it's unnecessary, if we're constructing we have to wait,
  // and if we're destroyed or errored, then it's not allowed,
  if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
    doRead = false
    debug('reading, ended or constructing', doRead)
  } else if (doRead) {
    debug('do read')
    state.state |= kReading | kSync
    // If the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.state |= kNeedReadable

    // Call internal read method
    try {
      this._read(state.highWaterMark)
    } catch (err) {
      errorOrDestroy(this, err)
    }
    state.state &= ~kSync

    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state)
  }
  let ret
  if (n > 0) ret = fromList(n, state)
  else ret = null
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark
    n = 0
  } else {
    state.length -= n
    if (state.multiAwaitDrain) {
      state.awaitDrainWriters.clear()
    } else {
      state.awaitDrainWriters = null
    }
  }
  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this)
  }
  if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
    state.dataEmitted = true
    this.emit('data', ret)
  }
  return ret
}
function onEofChunk(stream, state) {
  debug('onEofChunk')
  if (state.ended) return
  if (state.decoder) {
    const chunk = state.decoder.end()
    if (chunk && chunk.length) {
      state.buffer.push(chunk)
      state.length += state.objectMode ? 1 : chunk.length
    }
  }
  state.ended = true
  if (state.sync) {
    // If we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call.
    emitReadable(stream)
  } else {
    // Emit 'readable' now to make sure it gets picked up.
    state.needReadable = false
    state.emittedReadable = true
    // We have to emit readable now that we are EOF. Modules
    // in the ecosystem (e.g. dicer) rely on this event being sync.
    emitReadable_(stream)
  }
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  const state = stream._readableState
  debug('emitReadable', state.needReadable, state.emittedReadable)
  state.needReadable = false
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing)
    state.emittedReadable = true
    process.nextTick(emitReadable_, stream)
  }
}
function emitReadable_(stream) {
  const state = stream._readableState
  debug('emitReadable_', state.destroyed, state.length, state.ended)
  if (!state.destroyed && !state.errored && (state.length || state.ended)) {
    stream.emit('readable')
    state.emittedReadable = false
  }

  // The stream needs another readable event if:
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark
  flow(stream)
}

// At this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore && state.constructed) {
    state.readingMore = true
    process.nextTick(maybeReadMore_, stream, state)
  }
}
function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (
    !state.reading &&
    !state.ended &&
    (state.length < state.highWaterMark || (state.flowing && state.length === 0))
  ) {
    const len = state.length
    debug('maybeReadMore read 0')
    stream.read(0)
    if (len === state.length)
      // Didn't get any data, stop spinning.
      break
  }
  state.readingMore = false
}

// Abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  throw new ERR_METHOD_NOT_IMPLEMENTED('_read()')
}
Readable.prototype.pipe = function (dest, pipeOpts) {
  const src = this
  const state = this._readableState
  if (state.pipes.length === 1) {
    if (!state.multiAwaitDrain) {
      state.multiAwaitDrain = true
      state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : [])
    }
  }
  state.pipes.push(dest)
  debug('pipe count=%d opts=%j', state.pipes.length, pipeOpts)
  const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr
  const endFn = doEnd ? onend : unpipe
  if (state.endEmitted) process.nextTick(endFn)
  else src.once('end', endFn)
  dest.on('unpipe', onunpipe)
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe')
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true
        cleanup()
      }
    }
  }
  function onend() {
    debug('onend')
    dest.end()
  }
  let ondrain
  let cleanedUp = false
  function cleanup() {
    debug('cleanup')
    // Cleanup event handlers once the pipe is broken.
    dest.removeListener('close', onclose)
    dest.removeListener('finish', onfinish)
    if (ondrain) {
      dest.removeListener('drain', ondrain)
    }
    dest.removeListener('error', onerror)
    dest.removeListener('unpipe', onunpipe)
    src.removeListener('end', onend)
    src.removeListener('end', unpipe)
    src.removeListener('data', ondata)
    cleanedUp = true

    // If the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) ondrain()
  }
  function pause() {
    // If the user unpiped during `dest.write()`, it is possible
    // to get stuck in a permanently paused state if that write
    // also returned false.
    // => Check whether `dest` is still a piping destination.
    if (!cleanedUp) {
      if (state.pipes.length === 1 && state.pipes[0] === dest) {
        debug('false write response, pause', 0)
        state.awaitDrainWriters = dest
        state.multiAwaitDrain = false
      } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
        debug('false write response, pause', state.awaitDrainWriters.size)
        state.awaitDrainWriters.add(dest)
      }
      src.pause()
    }
    if (!ondrain) {
      // When the dest drains, it reduces the awaitDrain counter
      // on the source.  This would be more elegant with a .once()
      // handler in flow(), but adding and removing repeatedly is
      // too slow.
      ondrain = pipeOnDrain(src, dest)
      dest.on('drain', ondrain)
    }
  }
  src.on('data', ondata)
  function ondata(chunk) {
    debug('ondata')
    const ret = dest.write(chunk)
    debug('dest.write', ret)
    if (ret === false) {
      pause()
    }
  }

  // If the dest has an error, then stop piping into it.
  // However, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er)
    unpipe()
    dest.removeListener('error', onerror)
    if (dest.listenerCount('error') === 0) {
      const s = dest._writableState || dest._readableState
      if (s && !s.errorEmitted) {
        // User incorrectly emitted 'error' directly on the stream.
        errorOrDestroy(dest, er)
      } else {
        dest.emit('error', er)
      }
    }
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror)

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish)
    unpipe()
  }
  dest.once('close', onclose)
  function onfinish() {
    debug('onfinish')
    dest.removeListener('close', onclose)
    unpipe()
  }
  dest.once('finish', onfinish)
  function unpipe() {
    debug('unpipe')
    src.unpipe(dest)
  }

  // Tell the dest that it's being piped to.
  dest.emit('pipe', src)

  // Start the flow if it hasn't been started already.

  if (dest.writableNeedDrain === true) {
    pause()
  } else if (!state.flowing) {
    debug('pipe resume')
    src.resume()
  }
  return dest
}
function pipeOnDrain(src, dest) {
  return function pipeOnDrainFunctionResult() {
    const state = src._readableState

    // `ondrain` will call directly,
    // `this` maybe not a reference to dest,
    // so we use the real dest here.
    if (state.awaitDrainWriters === dest) {
      debug('pipeOnDrain', 1)
      state.awaitDrainWriters = null
    } else if (state.multiAwaitDrain) {
      debug('pipeOnDrain', state.awaitDrainWriters.size)
      state.awaitDrainWriters.delete(dest)
    }
    if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount('data')) {
      src.resume()
    }
  }
}
Readable.prototype.unpipe = function (dest) {
  const state = this._readableState
  const unpipeInfo = {
    hasUnpiped: false
  }

  // If we're not piping anywhere, then do nothing.
  if (state.pipes.length === 0) return this
  if (!dest) {
    // remove all.
    const dests = state.pipes
    state.pipes = []
    this.pause()
    for (let i = 0; i < dests.length; i++)
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      })
    return this
  }

  // Try to find the right one.
  const index = ArrayPrototypeIndexOf(state.pipes, dest)
  if (index === -1) return this
  state.pipes.splice(index, 1)
  if (state.pipes.length === 0) this.pause()
  dest.emit('unpipe', this, unpipeInfo)
  return this
}

// Set up data events if they are asked for
// Ensure readable listeners eventually get something.
Readable.prototype.on = function (ev, fn) {
  const res = Stream.prototype.on.call(this, ev, fn)
  const state = this._readableState
  if (ev === 'data') {
    // Update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0

    // Try start flowing on next tick if stream isn't explicitly paused.
    if (state.flowing !== false) this.resume()
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true
      state.flowing = false
      state.emittedReadable = false
      debug('on readable', state.length, state.reading)
      if (state.length) {
        emitReadable(this)
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this)
      }
    }
  }
  return res
}
Readable.prototype.addListener = Readable.prototype.on
Readable.prototype.removeListener = function (ev, fn) {
  const res = Stream.prototype.removeListener.call(this, ev, fn)
  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this)
  }
  return res
}
Readable.prototype.off = Readable.prototype.removeListener
Readable.prototype.removeAllListeners = function (ev) {
  const res = Stream.prototype.removeAllListeners.apply(this, arguments)
  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this)
  }
  return res
}
function updateReadableListening(self) {
  const state = self._readableState
  state.readableListening = self.listenerCount('readable') > 0
  if (state.resumeScheduled && state[kPaused] === false) {
    // Flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true

    // Crude way to check if we should resume.
  } else if (self.listenerCount('data') > 0) {
    self.resume()
  } else if (!state.readableListening) {
    state.flowing = null
  }
}
function nReadingNextTick(self) {
  debug('readable nexttick read 0')
  self.read(0)
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  const state = this._readableState
  if (!state.flowing) {
    debug('resume')
    // We flow only if there is no one listening
    // for readable, but we still have to call
    // resume().
    state.flowing = !state.readableListening
    resume(this, state)
  }
  state[kPaused] = false
  return this
}
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true
    process.nextTick(resume_, stream, state)
  }
}
function resume_(stream, state) {
  debug('resume', state.reading)
  if (!state.reading) {
    stream.read(0)
  }
  state.resumeScheduled = false
  stream.emit('resume')
  flow(stream)
  if (state.flowing && !state.reading) stream.read(0)
}
Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing)
  if (this._readableState.flowing !== false) {
    debug('pause')
    this._readableState.flowing = false
    this.emit('pause')
  }
  this._readableState[kPaused] = true
  return this
}
function flow(stream) {
  const state = stream._readableState
  debug('flow', state.flowing)
  while (state.flowing && stream.read() !== null);
}

// Wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  let paused = false

  // TODO (ronag): Should this.destroy(err) emit
  // 'error' on the wrapped stream? Would require
  // a static factory method, e.g. Readable.wrap(stream).

  stream.on('data', (chunk) => {
    if (!this.push(chunk) && stream.pause) {
      paused = true
      stream.pause()
    }
  })
  stream.on('end', () => {
    this.push(null)
  })
  stream.on('error', (err) => {
    errorOrDestroy(this, err)
  })
  stream.on('close', () => {
    this.destroy()
  })
  stream.on('destroy', () => {
    this.destroy()
  })
  this._read = () => {
    if (paused && stream.resume) {
      paused = false
      stream.resume()
    }
  }

  // Proxy all the other methods. Important when wrapping filters and duplexes.
  const streamKeys = ObjectKeys(stream)
  for (let j = 1; j < streamKeys.length; j++) {
    const i = streamKeys[j]
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = stream[i].bind(stream)
    }
  }
  return this
}
Readable.prototype[SymbolAsyncIterator] = function () {
  return streamToAsyncIterator(this)
}
Readable.prototype.iterator = function (options) {
  if (options !== undefined) {
    validateObject(options, 'options')
  }
  return streamToAsyncIterator(this, options)
}
function streamToAsyncIterator(stream, options) {
  if (typeof stream.read !== 'function') {
    stream = Readable.wrap(stream, {
      objectMode: true
    })
  }
  const iter = createAsyncIterator(stream, options)
  iter.stream = stream
  return iter
}
async function* createAsyncIterator(stream, options) {
  let callback = nop
  function next(resolve) {
    if (this === stream) {
      callback()
      callback = nop
    } else {
      callback = resolve
    }
  }
  stream.on('readable', next)
  let error
  const cleanup = eos(
    stream,
    {
      writable: false
    },
    (err) => {
      error = err ? aggregateTwoErrors(error, err) : null
      callback()
      callback = nop
    }
  )
  try {
    while (true) {
      const chunk = stream.destroyed ? null : stream.read()
      if (chunk !== null) {
        yield chunk
      } else if (error) {
        throw error
      } else if (error === null) {
        return
      } else {
        await new Promise(next)
      }
    }
  } catch (err) {
    error = aggregateTwoErrors(error, err)
    throw error
  } finally {
    if (
      (error || (options === null || options === undefined ? undefined : options.destroyOnReturn) !== false) &&
      (error === undefined || stream._readableState.autoDestroy)
    ) {
      destroyImpl.destroyer(stream, null)
    } else {
      stream.off('readable', next)
      cleanup()
    }
  }
}

// Making it explicit these properties are not enumerable
// because otherwise some prototype manipulation in
// userland will fail.
ObjectDefineProperties(Readable.prototype, {
  readable: {
    __proto__: null,
    get() {
      const r = this._readableState
      // r.readable === false means that this is part of a Duplex stream
      // where the readable side was disabled upon construction.
      // Compat. The user might manually disable readable side through
      // deprecated setter.
      return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted
    },
    set(val) {
      // Backwards compat.
      if (this._readableState) {
        this._readableState.readable = !!val
      }
    }
  },
  readableDidRead: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return this._readableState.dataEmitted
    }
  },
  readableAborted: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return !!(
        this._readableState.readable !== false &&
        (this._readableState.destroyed || this._readableState.errored) &&
        !this._readableState.endEmitted
      )
    }
  },
  readableHighWaterMark: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return this._readableState.highWaterMark
    }
  },
  readableBuffer: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return this._readableState && this._readableState.buffer
    }
  },
  readableFlowing: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return this._readableState.flowing
    },
    set: function (state) {
      if (this._readableState) {
        this._readableState.flowing = state
      }
    }
  },
  readableLength: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState.length
    }
  },
  readableObjectMode: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.objectMode : false
    }
  },
  readableEncoding: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.encoding : null
    }
  },
  errored: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.errored : null
    }
  },
  closed: {
    __proto__: null,
    get() {
      return this._readableState ? this._readableState.closed : false
    }
  },
  destroyed: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.destroyed : false
    },
    set(value) {
      // We ignore the value if the stream
      // has not been initialized yet.
      if (!this._readableState) {
        return
      }

      // Backward compatibility, the user is explicitly
      // managing destroyed.
      this._readableState.destroyed = value
    }
  },
  readableEnded: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.endEmitted : false
    }
  }
})
ObjectDefineProperties(ReadableState.prototype, {
  // Legacy getter for `pipesCount`.
  pipesCount: {
    __proto__: null,
    get() {
      return this.pipes.length
    }
  },
  // Legacy property for `paused`.
  paused: {
    __proto__: null,
    get() {
      return this[kPaused] !== false
    },
    set(value) {
      this[kPaused] = !!value
    }
  }
})

// Exposed for testing purposes only.
Readable._fromList = fromList

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered.
  if (state.length === 0) return null
  let ret
  if (state.objectMode) ret = state.buffer.shift()
  else if (!n || n >= state.length) {
    // Read it all, truncate the list.
    if (state.decoder) ret = state.buffer.join('')
    else if (state.buffer.length === 1) ret = state.buffer.first()
    else ret = state.buffer.concat(state.length)
    state.buffer.clear()
  } else {
    // read part of list.
    ret = state.buffer.consume(n, state.decoder)
  }
  return ret
}
function endReadable(stream) {
  const state = stream._readableState
  debug('endReadable', state.endEmitted)
  if (!state.endEmitted) {
    state.ended = true
    process.nextTick(endReadableNT, state, stream)
  }
}
function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length)

  // Check that we didn't get one last unshift.
  if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
    state.endEmitted = true
    stream.emit('end')
    if (stream.writable && stream.allowHalfOpen === false) {
      process.nextTick(endWritableNT, stream)
    } else if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well.
      const wState = stream._writableState
      const autoDestroy =
        !wState ||
        (wState.autoDestroy &&
          // We don't expect the writable to ever 'finish'
          // if writable is explicitly set to false.
          (wState.finished || wState.writable === false))
      if (autoDestroy) {
        stream.destroy()
      }
    }
  }
}
function endWritableNT(stream) {
  const writable = stream.writable && !stream.writableEnded && !stream.destroyed
  if (writable) {
    stream.end()
  }
}
Readable.from = function (iterable, opts) {
  return from(Readable, iterable, opts)
}
let webStreamsAdapters

// Lazy to avoid circular references
function lazyWebStreams() {
  if (webStreamsAdapters === undefined) webStreamsAdapters = {}
  return webStreamsAdapters
}
Readable.fromWeb = function (readableStream, options) {
  return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options)
}
Readable.toWeb = function (streamReadable, options) {
  return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options)
}
Readable.wrap = function (src, options) {
  var _ref, _src$readableObjectMo
  return new Readable({
    objectMode:
      (_ref =
        (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== undefined
          ? _src$readableObjectMo
          : src.objectMode) !== null && _ref !== undefined
        ? _ref
        : true,
    ...options,
    destroy(err, callback) {
      destroyImpl.destroyer(src, err)
      callback(err)
    }
  }).wrap(src)
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/state.js":
/*!************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/state.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { MathFloor, NumberIsInteger } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { validateInteger } = __webpack_require__(/*! ../validators */ "./src/node_modules/readable-stream/lib/internal/validators.js")
const { ERR_INVALID_ARG_VALUE } = (__webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js").codes)
let defaultHighWaterMarkBytes = 16 * 1024
let defaultHighWaterMarkObjectMode = 16
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null
}
function getDefaultHighWaterMark(objectMode) {
  return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes
}
function setDefaultHighWaterMark(objectMode, value) {
  validateInteger(value, 'value', 0)
  if (objectMode) {
    defaultHighWaterMarkObjectMode = value
  } else {
    defaultHighWaterMarkBytes = value
  }
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  const hwm = highWaterMarkFrom(options, isDuplex, duplexKey)
  if (hwm != null) {
    if (!NumberIsInteger(hwm) || hwm < 0) {
      const name = isDuplex ? `options.${duplexKey}` : 'options.highWaterMark'
      throw new ERR_INVALID_ARG_VALUE(name, hwm)
    }
    return MathFloor(hwm)
  }

  // Default value
  return getDefaultHighWaterMark(state.objectMode)
}
module.exports = {
  getHighWaterMark,
  getDefaultHighWaterMark,
  setDefaultHighWaterMark
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/transform.js":
/*!****************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/transform.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



const { ObjectSetPrototypeOf, Symbol } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
module.exports = Transform
const { ERR_METHOD_NOT_IMPLEMENTED } = (__webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js").codes)
const Duplex = __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
const { getHighWaterMark } = __webpack_require__(/*! ./state */ "./src/node_modules/readable-stream/lib/internal/streams/state.js")
ObjectSetPrototypeOf(Transform.prototype, Duplex.prototype)
ObjectSetPrototypeOf(Transform, Duplex)
const kCallback = Symbol('kCallback')
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options)

  // TODO (ronag): This should preferably always be
  // applied but would be semver-major. Or even better;
  // make Transform a Readable with the Writable interface.
  const readableHighWaterMark = options ? getHighWaterMark(this, options, 'readableHighWaterMark', true) : null
  if (readableHighWaterMark === 0) {
    // A Duplex will buffer both on the writable and readable side while
    // a Transform just wants to buffer hwm number of elements. To avoid
    // buffering twice we disable buffering on the writable side.
    options = {
      ...options,
      highWaterMark: null,
      readableHighWaterMark,
      // TODO (ronag): 0 is not optimal since we have
      // a "bug" where we check needDrain before calling _write and not after.
      // Refs: https://github.com/nodejs/node/pull/32887
      // Refs: https://github.com/nodejs/node/pull/35941
      writableHighWaterMark: options.writableHighWaterMark || 0
    }
  }
  Duplex.call(this, options)

  // We have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false
  this[kCallback] = null
  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform
    if (typeof options.flush === 'function') this._flush = options.flush
  }

  // When the writable side finishes, then flush out anything remaining.
  // Backwards compat. Some Transform streams incorrectly implement _final
  // instead of or in addition to _flush. By using 'prefinish' instead of
  // implementing _final we continue supporting this unfortunate use case.
  this.on('prefinish', prefinish)
}
function final(cb) {
  if (typeof this._flush === 'function' && !this.destroyed) {
    this._flush((er, data) => {
      if (er) {
        if (cb) {
          cb(er)
        } else {
          this.destroy(er)
        }
        return
      }
      if (data != null) {
        this.push(data)
      }
      this.push(null)
      if (cb) {
        cb()
      }
    })
  } else {
    this.push(null)
    if (cb) {
      cb()
    }
  }
}
function prefinish() {
  if (this._final !== final) {
    final.call(this)
  }
}
Transform.prototype._final = final
Transform.prototype._transform = function (chunk, encoding, callback) {
  throw new ERR_METHOD_NOT_IMPLEMENTED('_transform()')
}
Transform.prototype._write = function (chunk, encoding, callback) {
  const rState = this._readableState
  const wState = this._writableState
  const length = rState.length
  this._transform(chunk, encoding, (err, val) => {
    if (err) {
      callback(err)
      return
    }
    if (val != null) {
      this.push(val)
    }
    if (
      wState.ended ||
      // Backwards compat.
      length === rState.length ||
      // Backwards compat.
      rState.length < rState.highWaterMark
    ) {
      callback()
    } else {
      this[kCallback] = callback
    }
  })
}
Transform.prototype._read = function () {
  if (this[kCallback]) {
    const callback = this[kCallback]
    this[kCallback] = null
    callback()
  }
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/utils.js":
/*!************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/utils.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { SymbolAsyncIterator, SymbolIterator, SymbolFor } = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")

// We need to use SymbolFor to make these globally available
// for interopt with readable-stream, i.e. readable-stream
// and node core needs to be able to read/write private state
// from each other for proper interoperability.
const kIsDestroyed = SymbolFor('nodejs.stream.destroyed')
const kIsErrored = SymbolFor('nodejs.stream.errored')
const kIsReadable = SymbolFor('nodejs.stream.readable')
const kIsWritable = SymbolFor('nodejs.stream.writable')
const kIsDisturbed = SymbolFor('nodejs.stream.disturbed')
const kIsClosedPromise = SymbolFor('nodejs.webstream.isClosedPromise')
const kControllerErrorFunction = SymbolFor('nodejs.webstream.controllerErrorFunction')
function isReadableNodeStream(obj, strict = false) {
  var _obj$_readableState
  return !!(
    (
      obj &&
      typeof obj.pipe === 'function' &&
      typeof obj.on === 'function' &&
      (!strict || (typeof obj.pause === 'function' && typeof obj.resume === 'function')) &&
      (!obj._writableState ||
        ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === undefined
          ? undefined
          : _obj$_readableState.readable) !== false) &&
      // Duplex
      (!obj._writableState || obj._readableState)
    ) // Writable has .pipe.
  )
}

function isWritableNodeStream(obj) {
  var _obj$_writableState
  return !!(
    (
      obj &&
      typeof obj.write === 'function' &&
      typeof obj.on === 'function' &&
      (!obj._readableState ||
        ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === undefined
          ? undefined
          : _obj$_writableState.writable) !== false)
    ) // Duplex
  )
}

function isDuplexNodeStream(obj) {
  return !!(
    obj &&
    typeof obj.pipe === 'function' &&
    obj._readableState &&
    typeof obj.on === 'function' &&
    typeof obj.write === 'function'
  )
}
function isNodeStream(obj) {
  return (
    obj &&
    (obj._readableState ||
      obj._writableState ||
      (typeof obj.write === 'function' && typeof obj.on === 'function') ||
      (typeof obj.pipe === 'function' && typeof obj.on === 'function'))
  )
}
function isReadableStream(obj) {
  return !!(
    obj &&
    !isNodeStream(obj) &&
    typeof obj.pipeThrough === 'function' &&
    typeof obj.getReader === 'function' &&
    typeof obj.cancel === 'function'
  )
}
function isWritableStream(obj) {
  return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === 'function' && typeof obj.abort === 'function')
}
function isTransformStream(obj) {
  return !!(obj && !isNodeStream(obj) && typeof obj.readable === 'object' && typeof obj.writable === 'object')
}
function isWebStream(obj) {
  return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj)
}
function isIterable(obj, isAsync) {
  if (obj == null) return false
  if (isAsync === true) return typeof obj[SymbolAsyncIterator] === 'function'
  if (isAsync === false) return typeof obj[SymbolIterator] === 'function'
  return typeof obj[SymbolAsyncIterator] === 'function' || typeof obj[SymbolIterator] === 'function'
}
function isDestroyed(stream) {
  if (!isNodeStream(stream)) return null
  const wState = stream._writableState
  const rState = stream._readableState
  const state = wState || rState
  return !!(stream.destroyed || stream[kIsDestroyed] || (state !== null && state !== undefined && state.destroyed))
}

// Have been end():d.
function isWritableEnded(stream) {
  if (!isWritableNodeStream(stream)) return null
  if (stream.writableEnded === true) return true
  const wState = stream._writableState
  if (wState !== null && wState !== undefined && wState.errored) return false
  if (typeof (wState === null || wState === undefined ? undefined : wState.ended) !== 'boolean') return null
  return wState.ended
}

// Have emitted 'finish'.
function isWritableFinished(stream, strict) {
  if (!isWritableNodeStream(stream)) return null
  if (stream.writableFinished === true) return true
  const wState = stream._writableState
  if (wState !== null && wState !== undefined && wState.errored) return false
  if (typeof (wState === null || wState === undefined ? undefined : wState.finished) !== 'boolean') return null
  return !!(wState.finished || (strict === false && wState.ended === true && wState.length === 0))
}

// Have been push(null):d.
function isReadableEnded(stream) {
  if (!isReadableNodeStream(stream)) return null
  if (stream.readableEnded === true) return true
  const rState = stream._readableState
  if (!rState || rState.errored) return false
  if (typeof (rState === null || rState === undefined ? undefined : rState.ended) !== 'boolean') return null
  return rState.ended
}

// Have emitted 'end'.
function isReadableFinished(stream, strict) {
  if (!isReadableNodeStream(stream)) return null
  const rState = stream._readableState
  if (rState !== null && rState !== undefined && rState.errored) return false
  if (typeof (rState === null || rState === undefined ? undefined : rState.endEmitted) !== 'boolean') return null
  return !!(rState.endEmitted || (strict === false && rState.ended === true && rState.length === 0))
}
function isReadable(stream) {
  if (stream && stream[kIsReadable] != null) return stream[kIsReadable]
  if (typeof (stream === null || stream === undefined ? undefined : stream.readable) !== 'boolean') return null
  if (isDestroyed(stream)) return false
  return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream)
}
function isWritable(stream) {
  if (stream && stream[kIsWritable] != null) return stream[kIsWritable]
  if (typeof (stream === null || stream === undefined ? undefined : stream.writable) !== 'boolean') return null
  if (isDestroyed(stream)) return false
  return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream)
}
function isFinished(stream, opts) {
  if (!isNodeStream(stream)) {
    return null
  }
  if (isDestroyed(stream)) {
    return true
  }
  if ((opts === null || opts === undefined ? undefined : opts.readable) !== false && isReadable(stream)) {
    return false
  }
  if ((opts === null || opts === undefined ? undefined : opts.writable) !== false && isWritable(stream)) {
    return false
  }
  return true
}
function isWritableErrored(stream) {
  var _stream$_writableStat, _stream$_writableStat2
  if (!isNodeStream(stream)) {
    return null
  }
  if (stream.writableErrored) {
    return stream.writableErrored
  }
  return (_stream$_writableStat =
    (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === undefined
      ? undefined
      : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== undefined
    ? _stream$_writableStat
    : null
}
function isReadableErrored(stream) {
  var _stream$_readableStat, _stream$_readableStat2
  if (!isNodeStream(stream)) {
    return null
  }
  if (stream.readableErrored) {
    return stream.readableErrored
  }
  return (_stream$_readableStat =
    (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === undefined
      ? undefined
      : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== undefined
    ? _stream$_readableStat
    : null
}
function isClosed(stream) {
  if (!isNodeStream(stream)) {
    return null
  }
  if (typeof stream.closed === 'boolean') {
    return stream.closed
  }
  const wState = stream._writableState
  const rState = stream._readableState
  if (
    typeof (wState === null || wState === undefined ? undefined : wState.closed) === 'boolean' ||
    typeof (rState === null || rState === undefined ? undefined : rState.closed) === 'boolean'
  ) {
    return (
      (wState === null || wState === undefined ? undefined : wState.closed) ||
      (rState === null || rState === undefined ? undefined : rState.closed)
    )
  }
  if (typeof stream._closed === 'boolean' && isOutgoingMessage(stream)) {
    return stream._closed
  }
  return null
}
function isOutgoingMessage(stream) {
  return (
    typeof stream._closed === 'boolean' &&
    typeof stream._defaultKeepAlive === 'boolean' &&
    typeof stream._removedConnection === 'boolean' &&
    typeof stream._removedContLen === 'boolean'
  )
}
function isServerResponse(stream) {
  return typeof stream._sent100 === 'boolean' && isOutgoingMessage(stream)
}
function isServerRequest(stream) {
  var _stream$req
  return (
    typeof stream._consuming === 'boolean' &&
    typeof stream._dumped === 'boolean' &&
    ((_stream$req = stream.req) === null || _stream$req === undefined ? undefined : _stream$req.upgradeOrConnect) ===
      undefined
  )
}
function willEmitClose(stream) {
  if (!isNodeStream(stream)) return null
  const wState = stream._writableState
  const rState = stream._readableState
  const state = wState || rState
  return (
    (!state && isServerResponse(stream)) || !!(state && state.autoDestroy && state.emitClose && state.closed === false)
  )
}
function isDisturbed(stream) {
  var _stream$kIsDisturbed
  return !!(
    stream &&
    ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== undefined
      ? _stream$kIsDisturbed
      : stream.readableDidRead || stream.readableAborted)
  )
}
function isErrored(stream) {
  var _ref,
    _ref2,
    _ref3,
    _ref4,
    _ref5,
    _stream$kIsErrored,
    _stream$_readableStat3,
    _stream$_writableStat3,
    _stream$_readableStat4,
    _stream$_writableStat4
  return !!(
    stream &&
    ((_ref =
      (_ref2 =
        (_ref3 =
          (_ref4 =
            (_ref5 =
              (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== undefined
                ? _stream$kIsErrored
                : stream.readableErrored) !== null && _ref5 !== undefined
              ? _ref5
              : stream.writableErrored) !== null && _ref4 !== undefined
            ? _ref4
            : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === undefined
            ? undefined
            : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== undefined
          ? _ref3
          : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === undefined
          ? undefined
          : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== undefined
        ? _ref2
        : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === undefined
        ? undefined
        : _stream$_readableStat4.errored) !== null && _ref !== undefined
      ? _ref
      : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === undefined
      ? undefined
      : _stream$_writableStat4.errored)
  )
}
module.exports = {
  isDestroyed,
  kIsDestroyed,
  isDisturbed,
  kIsDisturbed,
  isErrored,
  kIsErrored,
  isReadable,
  kIsReadable,
  kIsClosedPromise,
  kControllerErrorFunction,
  kIsWritable,
  isClosed,
  isDuplexNodeStream,
  isFinished,
  isIterable,
  isReadableNodeStream,
  isReadableStream,
  isReadableEnded,
  isReadableFinished,
  isReadableErrored,
  isNodeStream,
  isWebStream,
  isWritable,
  isWritableNodeStream,
  isWritableStream,
  isWritableEnded,
  isWritableFinished,
  isWritableErrored,
  isServerRequest,
  isServerResponse,
  willEmitClose,
  isTransformStream
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/streams/writable.js":
/*!***************************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/streams/writable.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const process = __webpack_require__(/*! process/ */ "./src/node_modules/process/browser.js")

/* replacement end */
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

;('use strict')
const {
  ArrayPrototypeSlice,
  Error,
  FunctionPrototypeSymbolHasInstance,
  ObjectDefineProperty,
  ObjectDefineProperties,
  ObjectSetPrototypeOf,
  StringPrototypeToLowerCase,
  Symbol,
  SymbolHasInstance
} = __webpack_require__(/*! ../../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
module.exports = Writable
Writable.WritableState = WritableState
const { EventEmitter: EE } = __webpack_require__(/*! events */ "./src/node_modules/events/events.js")
const Stream = (__webpack_require__(/*! ./legacy */ "./src/node_modules/readable-stream/lib/internal/streams/legacy.js").Stream)
const { Buffer } = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const destroyImpl = __webpack_require__(/*! ./destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const { addAbortSignal } = __webpack_require__(/*! ./add-abort-signal */ "./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js")
const { getHighWaterMark, getDefaultHighWaterMark } = __webpack_require__(/*! ./state */ "./src/node_modules/readable-stream/lib/internal/streams/state.js")
const {
  ERR_INVALID_ARG_TYPE,
  ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK,
  ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED,
  ERR_STREAM_ALREADY_FINISHED,
  ERR_STREAM_NULL_VALUES,
  ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING
} = (__webpack_require__(/*! ../../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js").codes)
const { errorOrDestroy } = destroyImpl
ObjectSetPrototypeOf(Writable.prototype, Stream.prototype)
ObjectSetPrototypeOf(Writable, Stream)
function nop() {}
const kOnFinished = Symbol('kOnFinished')
function WritableState(options, stream, isDuplex) {
  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")

  // Object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!(options && options.objectMode)
  if (isDuplex) this.objectMode = this.objectMode || !!(options && options.writableObjectMode)

  // The point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write().
  this.highWaterMark = options
    ? getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex)
    : getDefaultHighWaterMark(false)

  // if _final has been called.
  this.finalCalled = false

  // drain event flag.
  this.needDrain = false
  // At the start of calling end()
  this.ending = false
  // When end() has been called, and returned.
  this.ended = false
  // When 'finish' is emitted.
  this.finished = false

  // Has it been destroyed
  this.destroyed = false

  // Should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  const noDecode = !!(options && options.decodeStrings === false)
  this.decodeStrings = !noDecode

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = (options && options.defaultEncoding) || 'utf8'

  // Not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0

  // A flag to see when we're in the middle of a write.
  this.writing = false

  // When true all writes will be buffered until .uncork() call.
  this.corked = 0

  // A flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true

  // A flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false

  // The callback that's passed to _write(chunk, cb).
  this.onwrite = onwrite.bind(undefined, stream)

  // The callback that the user supplies to write(chunk, encoding, cb).
  this.writecb = null

  // The amount that is being written when _write is called.
  this.writelen = 0

  // Storage for data passed to the afterWrite() callback in case of
  // synchronous _write() completion.
  this.afterWriteTickInfo = null
  resetBuffer(this)

  // Number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted.
  this.pendingcb = 0

  // Stream is still being constructed and cannot be
  // destroyed until construction finished or failed.
  // Async construction is opt in, therefore we start as
  // constructed.
  this.constructed = true

  // Emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams.
  this.prefinished = false

  // True if the error was already emitted and should not be thrown again.
  this.errorEmitted = false

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = !options || options.emitClose !== false

  // Should .destroy() be called after 'finish' (and potentially 'end').
  this.autoDestroy = !options || options.autoDestroy !== false

  // Indicates whether the stream has errored. When true all write() calls
  // should return false. This is needed since when autoDestroy
  // is disabled we need a way to tell whether the stream has failed.
  this.errored = null

  // Indicates whether the stream has finished destroying.
  this.closed = false

  // True if close has been emitted or would have been emitted
  // depending on emitClose.
  this.closeEmitted = false
  this[kOnFinished] = []
}
function resetBuffer(state) {
  state.buffered = []
  state.bufferedIndex = 0
  state.allBuffers = true
  state.allNoop = true
}
WritableState.prototype.getBuffer = function getBuffer() {
  return ArrayPrototypeSlice(this.buffered, this.bufferedIndex)
}
ObjectDefineProperty(WritableState.prototype, 'bufferedRequestCount', {
  __proto__: null,
  get() {
    return this.buffered.length - this.bufferedIndex
  }
})
function Writable(options) {
  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5.
  const isDuplex = this instanceof __webpack_require__(/*! ./duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
  if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable, this)) return new Writable(options)
  this._writableState = new WritableState(options, this, isDuplex)
  if (options) {
    if (typeof options.write === 'function') this._write = options.write
    if (typeof options.writev === 'function') this._writev = options.writev
    if (typeof options.destroy === 'function') this._destroy = options.destroy
    if (typeof options.final === 'function') this._final = options.final
    if (typeof options.construct === 'function') this._construct = options.construct
    if (options.signal) addAbortSignal(options.signal, this)
  }
  Stream.call(this, options)
  destroyImpl.construct(this, () => {
    const state = this._writableState
    if (!state.writing) {
      clearBuffer(this, state)
    }
    finishMaybe(this, state)
  })
}
ObjectDefineProperty(Writable, SymbolHasInstance, {
  __proto__: null,
  value: function (object) {
    if (FunctionPrototypeSymbolHasInstance(this, object)) return true
    if (this !== Writable) return false
    return object && object._writableState instanceof WritableState
  }
})

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE())
}
function _write(stream, chunk, encoding, cb) {
  const state = stream._writableState
  if (typeof encoding === 'function') {
    cb = encoding
    encoding = state.defaultEncoding
  } else {
    if (!encoding) encoding = state.defaultEncoding
    else if (encoding !== 'buffer' && !Buffer.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding)
    if (typeof cb !== 'function') cb = nop
  }
  if (chunk === null) {
    throw new ERR_STREAM_NULL_VALUES()
  } else if (!state.objectMode) {
    if (typeof chunk === 'string') {
      if (state.decodeStrings !== false) {
        chunk = Buffer.from(chunk, encoding)
        encoding = 'buffer'
      }
    } else if (chunk instanceof Buffer) {
      encoding = 'buffer'
    } else if (Stream._isUint8Array(chunk)) {
      chunk = Stream._uint8ArrayToBuffer(chunk)
      encoding = 'buffer'
    } else {
      throw new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk)
    }
  }
  let err
  if (state.ending) {
    err = new ERR_STREAM_WRITE_AFTER_END()
  } else if (state.destroyed) {
    err = new ERR_STREAM_DESTROYED('write')
  }
  if (err) {
    process.nextTick(cb, err)
    errorOrDestroy(stream, err, true)
    return err
  }
  state.pendingcb++
  return writeOrBuffer(stream, state, chunk, encoding, cb)
}
Writable.prototype.write = function (chunk, encoding, cb) {
  return _write(this, chunk, encoding, cb) === true
}
Writable.prototype.cork = function () {
  this._writableState.corked++
}
Writable.prototype.uncork = function () {
  const state = this._writableState
  if (state.corked) {
    state.corked--
    if (!state.writing) clearBuffer(this, state)
  }
}
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = StringPrototypeToLowerCase(encoding)
  if (!Buffer.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding)
  this._writableState.defaultEncoding = encoding
  return this
}

// If we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, callback) {
  const len = state.objectMode ? 1 : chunk.length
  state.length += len

  // stream._write resets state.length
  const ret = state.length < state.highWaterMark
  // We must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true
  if (state.writing || state.corked || state.errored || !state.constructed) {
    state.buffered.push({
      chunk,
      encoding,
      callback
    })
    if (state.allBuffers && encoding !== 'buffer') {
      state.allBuffers = false
    }
    if (state.allNoop && callback !== nop) {
      state.allNoop = false
    }
  } else {
    state.writelen = len
    state.writecb = callback
    state.writing = true
    state.sync = true
    stream._write(chunk, encoding, state.onwrite)
    state.sync = false
  }

  // Return false if errored or destroyed in order to break
  // any synchronous while(stream.write(data)) loops.
  return ret && !state.errored && !state.destroyed
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len
  state.writecb = cb
  state.writing = true
  state.sync = true
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'))
  else if (writev) stream._writev(chunk, state.onwrite)
  else stream._write(chunk, encoding, state.onwrite)
  state.sync = false
}
function onwriteError(stream, state, er, cb) {
  --state.pendingcb
  cb(er)
  // Ensure callbacks are invoked even when autoDestroy is
  // not enabled. Passing `er` here doesn't make sense since
  // it's related to one specific write, not to the buffered
  // writes.
  errorBuffer(state)
  // This can emit error, but error must always follow cb.
  errorOrDestroy(stream, er)
}
function onwrite(stream, er) {
  const state = stream._writableState
  const sync = state.sync
  const cb = state.writecb
  if (typeof cb !== 'function') {
    errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK())
    return
  }
  state.writing = false
  state.writecb = null
  state.length -= state.writelen
  state.writelen = 0
  if (er) {
    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
    er.stack // eslint-disable-line no-unused-expressions

    if (!state.errored) {
      state.errored = er
    }

    // In case of duplex streams we need to notify the readable side of the
    // error.
    if (stream._readableState && !stream._readableState.errored) {
      stream._readableState.errored = er
    }
    if (sync) {
      process.nextTick(onwriteError, stream, state, er, cb)
    } else {
      onwriteError(stream, state, er, cb)
    }
  } else {
    if (state.buffered.length > state.bufferedIndex) {
      clearBuffer(stream, state)
    }
    if (sync) {
      // It is a common case that the callback passed to .write() is always
      // the same. In that case, we do not schedule a new nextTick(), but
      // rather just increase a counter, to improve performance and avoid
      // memory allocations.
      if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
        state.afterWriteTickInfo.count++
      } else {
        state.afterWriteTickInfo = {
          count: 1,
          cb,
          stream,
          state
        }
        process.nextTick(afterWriteTick, state.afterWriteTickInfo)
      }
    } else {
      afterWrite(stream, state, 1, cb)
    }
  }
}
function afterWriteTick({ stream, state, count, cb }) {
  state.afterWriteTickInfo = null
  return afterWrite(stream, state, count, cb)
}
function afterWrite(stream, state, count, cb) {
  const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain
  if (needDrain) {
    state.needDrain = false
    stream.emit('drain')
  }
  while (count-- > 0) {
    state.pendingcb--
    cb()
  }
  if (state.destroyed) {
    errorBuffer(state)
  }
  finishMaybe(stream, state)
}

// If there's something in the buffer waiting, then invoke callbacks.
function errorBuffer(state) {
  if (state.writing) {
    return
  }
  for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
    var _state$errored
    const { chunk, callback } = state.buffered[n]
    const len = state.objectMode ? 1 : chunk.length
    state.length -= len
    callback(
      (_state$errored = state.errored) !== null && _state$errored !== undefined
        ? _state$errored
        : new ERR_STREAM_DESTROYED('write')
    )
  }
  const onfinishCallbacks = state[kOnFinished].splice(0)
  for (let i = 0; i < onfinishCallbacks.length; i++) {
    var _state$errored2
    onfinishCallbacks[i](
      (_state$errored2 = state.errored) !== null && _state$errored2 !== undefined
        ? _state$errored2
        : new ERR_STREAM_DESTROYED('end')
    )
  }
  resetBuffer(state)
}

// If there's something in the buffer waiting, then process it.
function clearBuffer(stream, state) {
  if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
    return
  }
  const { buffered, bufferedIndex, objectMode } = state
  const bufferedLength = buffered.length - bufferedIndex
  if (!bufferedLength) {
    return
  }
  let i = bufferedIndex
  state.bufferProcessing = true
  if (bufferedLength > 1 && stream._writev) {
    state.pendingcb -= bufferedLength - 1
    const callback = state.allNoop
      ? nop
      : (err) => {
          for (let n = i; n < buffered.length; ++n) {
            buffered[n].callback(err)
          }
        }
    // Make a copy of `buffered` if it's going to be used by `callback` above,
    // since `doWrite` will mutate the array.
    const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i)
    chunks.allBuffers = state.allBuffers
    doWrite(stream, state, true, state.length, chunks, '', callback)
    resetBuffer(state)
  } else {
    do {
      const { chunk, encoding, callback } = buffered[i]
      buffered[i++] = null
      const len = objectMode ? 1 : chunk.length
      doWrite(stream, state, false, len, chunk, encoding, callback)
    } while (i < buffered.length && !state.writing)
    if (i === buffered.length) {
      resetBuffer(state)
    } else if (i > 256) {
      buffered.splice(0, i)
      state.bufferedIndex = 0
    } else {
      state.bufferedIndex = i
    }
  }
  state.bufferProcessing = false
}
Writable.prototype._write = function (chunk, encoding, cb) {
  if (this._writev) {
    this._writev(
      [
        {
          chunk,
          encoding
        }
      ],
      cb
    )
  } else {
    throw new ERR_METHOD_NOT_IMPLEMENTED('_write()')
  }
}
Writable.prototype._writev = null
Writable.prototype.end = function (chunk, encoding, cb) {
  const state = this._writableState
  if (typeof chunk === 'function') {
    cb = chunk
    chunk = null
    encoding = null
  } else if (typeof encoding === 'function') {
    cb = encoding
    encoding = null
  }
  let err
  if (chunk !== null && chunk !== undefined) {
    const ret = _write(this, chunk, encoding)
    if (ret instanceof Error) {
      err = ret
    }
  }

  // .end() fully uncorks.
  if (state.corked) {
    state.corked = 1
    this.uncork()
  }
  if (err) {
    // Do nothing...
  } else if (!state.errored && !state.ending) {
    // This is forgiving in terms of unnecessary calls to end() and can hide
    // logic errors. However, usually such errors are harmless and causing a
    // hard error can be disproportionately destructive. It is not always
    // trivial for the user to determine whether end() needs to be called
    // or not.

    state.ending = true
    finishMaybe(this, state, true)
    state.ended = true
  } else if (state.finished) {
    err = new ERR_STREAM_ALREADY_FINISHED('end')
  } else if (state.destroyed) {
    err = new ERR_STREAM_DESTROYED('end')
  }
  if (typeof cb === 'function') {
    if (err || state.finished) {
      process.nextTick(cb, err)
    } else {
      state[kOnFinished].push(cb)
    }
  }
  return this
}
function needFinish(state) {
  return (
    state.ending &&
    !state.destroyed &&
    state.constructed &&
    state.length === 0 &&
    !state.errored &&
    state.buffered.length === 0 &&
    !state.finished &&
    !state.writing &&
    !state.errorEmitted &&
    !state.closeEmitted
  )
}
function callFinal(stream, state) {
  let called = false
  function onFinish(err) {
    if (called) {
      errorOrDestroy(stream, err !== null && err !== undefined ? err : ERR_MULTIPLE_CALLBACK())
      return
    }
    called = true
    state.pendingcb--
    if (err) {
      const onfinishCallbacks = state[kOnFinished].splice(0)
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        onfinishCallbacks[i](err)
      }
      errorOrDestroy(stream, err, state.sync)
    } else if (needFinish(state)) {
      state.prefinished = true
      stream.emit('prefinish')
      // Backwards compat. Don't check state.sync here.
      // Some streams assume 'finish' will be emitted
      // asynchronously relative to _final callback.
      state.pendingcb++
      process.nextTick(finish, stream, state)
    }
  }
  state.sync = true
  state.pendingcb++
  try {
    stream._final(onFinish)
  } catch (err) {
    onFinish(err)
  }
  state.sync = false
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.finalCalled = true
      callFinal(stream, state)
    } else {
      state.prefinished = true
      stream.emit('prefinish')
    }
  }
}
function finishMaybe(stream, state, sync) {
  if (needFinish(state)) {
    prefinish(stream, state)
    if (state.pendingcb === 0) {
      if (sync) {
        state.pendingcb++
        process.nextTick(
          (stream, state) => {
            if (needFinish(state)) {
              finish(stream, state)
            } else {
              state.pendingcb--
            }
          },
          stream,
          state
        )
      } else if (needFinish(state)) {
        state.pendingcb++
        finish(stream, state)
      }
    }
  }
}
function finish(stream, state) {
  state.pendingcb--
  state.finished = true
  const onfinishCallbacks = state[kOnFinished].splice(0)
  for (let i = 0; i < onfinishCallbacks.length; i++) {
    onfinishCallbacks[i]()
  }
  stream.emit('finish')
  if (state.autoDestroy) {
    // In case of duplex streams we need a way to detect
    // if the readable side is ready for autoDestroy as well.
    const rState = stream._readableState
    const autoDestroy =
      !rState ||
      (rState.autoDestroy &&
        // We don't expect the readable to ever 'end'
        // if readable is explicitly set to false.
        (rState.endEmitted || rState.readable === false))
    if (autoDestroy) {
      stream.destroy()
    }
  }
}
ObjectDefineProperties(Writable.prototype, {
  closed: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.closed : false
    }
  },
  destroyed: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.destroyed : false
    },
    set(value) {
      // Backward compatibility, the user is explicitly managing destroyed.
      if (this._writableState) {
        this._writableState.destroyed = value
      }
    }
  },
  writable: {
    __proto__: null,
    get() {
      const w = this._writableState
      // w.writable === false means that this is part of a Duplex stream
      // where the writable side was disabled upon construction.
      // Compat. The user might manually disable writable side through
      // deprecated setter.
      return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended
    },
    set(val) {
      // Backwards compatible.
      if (this._writableState) {
        this._writableState.writable = !!val
      }
    }
  },
  writableFinished: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.finished : false
    }
  },
  writableObjectMode: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.objectMode : false
    }
  },
  writableBuffer: {
    __proto__: null,
    get() {
      return this._writableState && this._writableState.getBuffer()
    }
  },
  writableEnded: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.ending : false
    }
  },
  writableNeedDrain: {
    __proto__: null,
    get() {
      const wState = this._writableState
      if (!wState) return false
      return !wState.destroyed && !wState.ending && wState.needDrain
    }
  },
  writableHighWaterMark: {
    __proto__: null,
    get() {
      return this._writableState && this._writableState.highWaterMark
    }
  },
  writableCorked: {
    __proto__: null,
    get() {
      return this._writableState ? this._writableState.corked : 0
    }
  },
  writableLength: {
    __proto__: null,
    get() {
      return this._writableState && this._writableState.length
    }
  },
  errored: {
    __proto__: null,
    enumerable: false,
    get() {
      return this._writableState ? this._writableState.errored : null
    }
  },
  writableAborted: {
    __proto__: null,
    enumerable: false,
    get: function () {
      return !!(
        this._writableState.writable !== false &&
        (this._writableState.destroyed || this._writableState.errored) &&
        !this._writableState.finished
      )
    }
  }
})
const destroy = destroyImpl.destroy
Writable.prototype.destroy = function (err, cb) {
  const state = this._writableState

  // Invoke pending callbacks.
  if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
    process.nextTick(errorBuffer, state)
  }
  destroy.call(this, err, cb)
  return this
}
Writable.prototype._undestroy = destroyImpl.undestroy
Writable.prototype._destroy = function (err, cb) {
  cb(err)
}
Writable.prototype[EE.captureRejectionSymbol] = function (err) {
  this.destroy(err)
}
let webStreamsAdapters

// Lazy to avoid circular references
function lazyWebStreams() {
  if (webStreamsAdapters === undefined) webStreamsAdapters = {}
  return webStreamsAdapters
}
Writable.fromWeb = function (writableStream, options) {
  return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options)
}
Writable.toWeb = function (streamWritable) {
  return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable)
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/internal/validators.js":
/*!*********************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/internal/validators.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint jsdoc/require-jsdoc: "error" */



const {
  ArrayIsArray,
  ArrayPrototypeIncludes,
  ArrayPrototypeJoin,
  ArrayPrototypeMap,
  NumberIsInteger,
  NumberIsNaN,
  NumberMAX_SAFE_INTEGER,
  NumberMIN_SAFE_INTEGER,
  NumberParseInt,
  ObjectPrototypeHasOwnProperty,
  RegExpPrototypeExec,
  String,
  StringPrototypeToUpperCase,
  StringPrototypeTrim
} = __webpack_require__(/*! ../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const {
  hideStackFrames,
  codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
} = __webpack_require__(/*! ../ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const { normalizeEncoding } = __webpack_require__(/*! ../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const { isAsyncFunction, isArrayBufferView } = (__webpack_require__(/*! ../ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js").types)
const signals = {}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isInt32(value) {
  return value === (value | 0)
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isUint32(value) {
  return value === value >>> 0
}
const octalReg = /^[0-7]+$/
const modeDesc = 'must be a 32-bit unsigned integer or an octal string'

/**
 * Parse and validate values that will be converted into mode_t (the S_*
 * constants). Only valid numbers and octal strings are allowed. They could be
 * converted to 32-bit unsigned integers or non-negative signed integers in the
 * C++ land, but any value higher than 0o777 will result in platform-specific
 * behaviors.
 * @param {*} value Values to be validated
 * @param {string} name Name of the argument
 * @param {number} [def] If specified, will be returned for invalid values
 * @returns {number}
 */
function parseFileMode(value, name, def) {
  if (typeof value === 'undefined') {
    value = def
  }
  if (typeof value === 'string') {
    if (RegExpPrototypeExec(octalReg, value) === null) {
      throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc)
    }
    value = NumberParseInt(value, 8)
  }
  validateUint32(value, name)
  return value
}

/**
 * @callback validateInteger
 * @param {*} value
 * @param {string} name
 * @param {number} [min]
 * @param {number} [max]
 * @returns {asserts value is number}
 */

/** @type {validateInteger} */
const validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
  if (typeof value !== 'number') throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
  if (!NumberIsInteger(value)) throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
  if (value < min || value > max) throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
})

/**
 * @callback validateInt32
 * @param {*} value
 * @param {string} name
 * @param {number} [min]
 * @param {number} [max]
 * @returns {asserts value is number}
 */

/** @type {validateInt32} */
const validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (typeof value !== 'number') {
    throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
  if (!NumberIsInteger(value)) {
    throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
  }
  if (value < min || value > max) {
    throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
  }
})

/**
 * @callback validateUint32
 * @param {*} value
 * @param {string} name
 * @param {number|boolean} [positive=false]
 * @returns {asserts value is number}
 */

/** @type {validateUint32} */
const validateUint32 = hideStackFrames((value, name, positive = false) => {
  if (typeof value !== 'number') {
    throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
  if (!NumberIsInteger(value)) {
    throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
  }
  const min = positive ? 1 : 0
  // 2 ** 32 === 4294967296
  const max = 4294967295
  if (value < min || value > max) {
    throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
  }
})

/**
 * @callback validateString
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is string}
 */

/** @type {validateString} */
function validateString(value, name) {
  if (typeof value !== 'string') throw new ERR_INVALID_ARG_TYPE(name, 'string', value)
}

/**
 * @callback validateNumber
 * @param {*} value
 * @param {string} name
 * @param {number} [min]
 * @param {number} [max]
 * @returns {asserts value is number}
 */

/** @type {validateNumber} */
function validateNumber(value, name, min = undefined, max) {
  if (typeof value !== 'number') throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
  if (
    (min != null && value < min) ||
    (max != null && value > max) ||
    ((min != null || max != null) && NumberIsNaN(value))
  ) {
    throw new ERR_OUT_OF_RANGE(
      name,
      `${min != null ? `>= ${min}` : ''}${min != null && max != null ? ' && ' : ''}${max != null ? `<= ${max}` : ''}`,
      value
    )
  }
}

/**
 * @callback validateOneOf
 * @template T
 * @param {T} value
 * @param {string} name
 * @param {T[]} oneOf
 */

/** @type {validateOneOf} */
const validateOneOf = hideStackFrames((value, name, oneOf) => {
  if (!ArrayPrototypeIncludes(oneOf, value)) {
    const allowed = ArrayPrototypeJoin(
      ArrayPrototypeMap(oneOf, (v) => (typeof v === 'string' ? `'${v}'` : String(v))),
      ', '
    )
    const reason = 'must be one of: ' + allowed
    throw new ERR_INVALID_ARG_VALUE(name, value, reason)
  }
})

/**
 * @callback validateBoolean
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is boolean}
 */

/** @type {validateBoolean} */
function validateBoolean(value, name) {
  if (typeof value !== 'boolean') throw new ERR_INVALID_ARG_TYPE(name, 'boolean', value)
}

/**
 * @param {any} options
 * @param {string} key
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
function getOwnPropertyValueOrDefault(options, key, defaultValue) {
  return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key]
}

/**
 * @callback validateObject
 * @param {*} value
 * @param {string} name
 * @param {{
 *   allowArray?: boolean,
 *   allowFunction?: boolean,
 *   nullable?: boolean
 * }} [options]
 */

/** @type {validateObject} */
const validateObject = hideStackFrames((value, name, options = null) => {
  const allowArray = getOwnPropertyValueOrDefault(options, 'allowArray', false)
  const allowFunction = getOwnPropertyValueOrDefault(options, 'allowFunction', false)
  const nullable = getOwnPropertyValueOrDefault(options, 'nullable', false)
  if (
    (!nullable && value === null) ||
    (!allowArray && ArrayIsArray(value)) ||
    (typeof value !== 'object' && (!allowFunction || typeof value !== 'function'))
  ) {
    throw new ERR_INVALID_ARG_TYPE(name, 'Object', value)
  }
})

/**
 * @callback validateDictionary - We are using the Web IDL Standard definition
 *                                of "dictionary" here, which means any value
 *                                whose Type is either Undefined, Null, or
 *                                Object (which includes functions).
 * @param {*} value
 * @param {string} name
 * @see https://webidl.spec.whatwg.org/#es-dictionary
 * @see https://tc39.es/ecma262/#table-typeof-operator-results
 */

/** @type {validateDictionary} */
const validateDictionary = hideStackFrames((value, name) => {
  if (value != null && typeof value !== 'object' && typeof value !== 'function') {
    throw new ERR_INVALID_ARG_TYPE(name, 'a dictionary', value)
  }
})

/**
 * @callback validateArray
 * @param {*} value
 * @param {string} name
 * @param {number} [minLength]
 * @returns {asserts value is any[]}
 */

/** @type {validateArray} */
const validateArray = hideStackFrames((value, name, minLength = 0) => {
  if (!ArrayIsArray(value)) {
    throw new ERR_INVALID_ARG_TYPE(name, 'Array', value)
  }
  if (value.length < minLength) {
    const reason = `must be longer than ${minLength}`
    throw new ERR_INVALID_ARG_VALUE(name, value, reason)
  }
})

/**
 * @callback validateStringArray
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is string[]}
 */

/** @type {validateStringArray} */
function validateStringArray(value, name) {
  validateArray(value, name)
  for (let i = 0; i < value.length; i++) {
    validateString(value[i], `${name}[${i}]`)
  }
}

/**
 * @callback validateBooleanArray
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is boolean[]}
 */

/** @type {validateBooleanArray} */
function validateBooleanArray(value, name) {
  validateArray(value, name)
  for (let i = 0; i < value.length; i++) {
    validateBoolean(value[i], `${name}[${i}]`)
  }
}

/**
 * @callback validateAbortSignalArray
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is AbortSignal[]}
 */

/** @type {validateAbortSignalArray} */
function validateAbortSignalArray(value, name) {
  validateArray(value, name)
  for (let i = 0; i < value.length; i++) {
    const signal = value[i]
    const indexedName = `${name}[${i}]`
    if (signal == null) {
      throw new ERR_INVALID_ARG_TYPE(indexedName, 'AbortSignal', signal)
    }
    validateAbortSignal(signal, indexedName)
  }
}

/**
 * @param {*} signal
 * @param {string} [name='signal']
 * @returns {asserts signal is keyof signals}
 */
function validateSignalName(signal, name = 'signal') {
  validateString(signal, name)
  if (signals[signal] === undefined) {
    if (signals[StringPrototypeToUpperCase(signal)] !== undefined) {
      throw new ERR_UNKNOWN_SIGNAL(signal + ' (signals must use all capital letters)')
    }
    throw new ERR_UNKNOWN_SIGNAL(signal)
  }
}

/**
 * @callback validateBuffer
 * @param {*} buffer
 * @param {string} [name='buffer']
 * @returns {asserts buffer is ArrayBufferView}
 */

/** @type {validateBuffer} */
const validateBuffer = hideStackFrames((buffer, name = 'buffer') => {
  if (!isArrayBufferView(buffer)) {
    throw new ERR_INVALID_ARG_TYPE(name, ['Buffer', 'TypedArray', 'DataView'], buffer)
  }
})

/**
 * @param {string} data
 * @param {string} encoding
 */
function validateEncoding(data, encoding) {
  const normalizedEncoding = normalizeEncoding(encoding)
  const length = data.length
  if (normalizedEncoding === 'hex' && length % 2 !== 0) {
    throw new ERR_INVALID_ARG_VALUE('encoding', encoding, `is invalid for data of length ${length}`)
  }
}

/**
 * Check that the port number is not NaN when coerced to a number,
 * is an integer and that it falls within the legal range of port numbers.
 * @param {*} port
 * @param {string} [name='Port']
 * @param {boolean} [allowZero=true]
 * @returns {number}
 */
function validatePort(port, name = 'Port', allowZero = true) {
  if (
    (typeof port !== 'number' && typeof port !== 'string') ||
    (typeof port === 'string' && StringPrototypeTrim(port).length === 0) ||
    +port !== +port >>> 0 ||
    port > 0xffff ||
    (port === 0 && !allowZero)
  ) {
    throw new ERR_SOCKET_BAD_PORT(name, port, allowZero)
  }
  return port | 0
}

/**
 * @callback validateAbortSignal
 * @param {*} signal
 * @param {string} name
 */

/** @type {validateAbortSignal} */
const validateAbortSignal = hideStackFrames((signal, name) => {
  if (signal !== undefined && (signal === null || typeof signal !== 'object' || !('aborted' in signal))) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
  }
})

/**
 * @callback validateFunction
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is Function}
 */

/** @type {validateFunction} */
const validateFunction = hideStackFrames((value, name) => {
  if (typeof value !== 'function') throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
})

/**
 * @callback validatePlainFunction
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is Function}
 */

/** @type {validatePlainFunction} */
const validatePlainFunction = hideStackFrames((value, name) => {
  if (typeof value !== 'function' || isAsyncFunction(value)) throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
})

/**
 * @callback validateUndefined
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is undefined}
 */

/** @type {validateUndefined} */
const validateUndefined = hideStackFrames((value, name) => {
  if (value !== undefined) throw new ERR_INVALID_ARG_TYPE(name, 'undefined', value)
})

/**
 * @template T
 * @param {T} value
 * @param {string} name
 * @param {T[]} union
 */
function validateUnion(value, name, union) {
  if (!ArrayPrototypeIncludes(union, value)) {
    throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, '|')}')`, value)
  }
}

/*
  The rules for the Link header field are described here:
  https://www.rfc-editor.org/rfc/rfc8288.html#section-3

  This regex validates any string surrounded by angle brackets
  (not necessarily a valid URI reference) followed by zero or more
  link-params separated by semicolons.
*/
const linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/

/**
 * @param {any} value
 * @param {string} name
 */
function validateLinkHeaderFormat(value, name) {
  if (typeof value === 'undefined' || !RegExpPrototypeExec(linkValueRegExp, value)) {
    throw new ERR_INVALID_ARG_VALUE(
      name,
      value,
      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
    )
  }
}

/**
 * @param {any} hints
 * @return {string}
 */
function validateLinkHeaderValue(hints) {
  if (typeof hints === 'string') {
    validateLinkHeaderFormat(hints, 'hints')
    return hints
  } else if (ArrayIsArray(hints)) {
    const hintsLength = hints.length
    let result = ''
    if (hintsLength === 0) {
      return result
    }
    for (let i = 0; i < hintsLength; i++) {
      const link = hints[i]
      validateLinkHeaderFormat(link, 'hints')
      result += link
      if (i !== hintsLength - 1) {
        result += ', '
      }
    }
    return result
  }
  throw new ERR_INVALID_ARG_VALUE(
    'hints',
    hints,
    'must be an array or string of format "</styles.css>; rel=preload; as=style"'
  )
}
module.exports = {
  isInt32,
  isUint32,
  parseFileMode,
  validateArray,
  validateStringArray,
  validateBooleanArray,
  validateAbortSignalArray,
  validateBoolean,
  validateBuffer,
  validateDictionary,
  validateEncoding,
  validateFunction,
  validateInt32,
  validateInteger,
  validateNumber,
  validateObject,
  validateOneOf,
  validatePlainFunction,
  validatePort,
  validateSignalName,
  validateString,
  validateUint32,
  validateUndefined,
  validateUnion,
  validateAbortSignal,
  validateLinkHeaderValue
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/ours/browser.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/ours/browser.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const CustomStream = __webpack_require__(/*! ../stream */ "./src/node_modules/readable-stream/lib/stream.js")
const promises = __webpack_require__(/*! ../stream/promises */ "./src/node_modules/readable-stream/lib/stream/promises.js")
const originalDestroy = CustomStream.Readable.destroy
module.exports = CustomStream.Readable

// Explicit export naming is needed for ESM
module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer
module.exports._isUint8Array = CustomStream._isUint8Array
module.exports.isDisturbed = CustomStream.isDisturbed
module.exports.isErrored = CustomStream.isErrored
module.exports.isReadable = CustomStream.isReadable
module.exports.Readable = CustomStream.Readable
module.exports.Writable = CustomStream.Writable
module.exports.Duplex = CustomStream.Duplex
module.exports.Transform = CustomStream.Transform
module.exports.PassThrough = CustomStream.PassThrough
module.exports.addAbortSignal = CustomStream.addAbortSignal
module.exports.finished = CustomStream.finished
module.exports.destroy = CustomStream.destroy
module.exports.destroy = originalDestroy
module.exports.pipeline = CustomStream.pipeline
module.exports.compose = CustomStream.compose
Object.defineProperty(CustomStream, 'promises', {
  configurable: true,
  enumerable: true,
  get() {
    return promises
  }
})
module.exports.Stream = CustomStream.Stream

// Allow default importing
module.exports["default"] = module.exports


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/ours/errors.js":
/*!*************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/ours/errors.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { format, inspect, AggregateError: CustomAggregateError } = __webpack_require__(/*! ./util */ "./src/node_modules/readable-stream/lib/ours/util.js")

/*
  This file is a reduced and adapted version of the main lib/internal/errors.js file defined at

  https://github.com/nodejs/node/blob/master/lib/internal/errors.js

  Don't try to replace with the original file and keep it up to date (starting from E(...) definitions)
  with the upstream file.
*/

const AggregateError = globalThis.AggregateError || CustomAggregateError
const kIsNodeError = Symbol('kIsNodeError')
const kTypes = [
  'string',
  'function',
  'number',
  'object',
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  'Function',
  'Object',
  'boolean',
  'bigint',
  'symbol'
]
const classRegExp = /^([A-Z][a-z0-9]*)+$/
const nodeInternalPrefix = '__node_internal_'
const codes = {}
function assert(value, message) {
  if (!value) {
    throw new codes.ERR_INTERNAL_ASSERTION(message)
  }
}

// Only use this for integers! Decimal numbers do not work with this function.
function addNumericalSeparator(val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}
function getMessage(key, msg, args) {
  if (typeof msg === 'function') {
    assert(
      msg.length <= args.length,
      // Default options do not count.
      `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
    )
    return msg(...args)
  }
  const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length
  assert(
    expectedLength === args.length,
    `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
  )
  if (args.length === 0) {
    return msg
  }
  return format(msg, ...args)
}
function E(code, message, Base) {
  if (!Base) {
    Base = Error
  }
  class NodeError extends Base {
    constructor(...args) {
      super(getMessage(code, message, args))
    }
    toString() {
      return `${this.name} [${code}]: ${this.message}`
    }
  }
  Object.defineProperties(NodeError.prototype, {
    name: {
      value: Base.name,
      writable: true,
      enumerable: false,
      configurable: true
    },
    toString: {
      value() {
        return `${this.name} [${code}]: ${this.message}`
      },
      writable: true,
      enumerable: false,
      configurable: true
    }
  })
  NodeError.prototype.code = code
  NodeError.prototype[kIsNodeError] = true
  codes[code] = NodeError
}
function hideStackFrames(fn) {
  // We rename the functions that will be hidden to cut off the stacktrace
  // at the outermost one
  const hidden = nodeInternalPrefix + fn.name
  Object.defineProperty(fn, 'name', {
    value: hidden
  })
  return fn
}
function aggregateTwoErrors(innerError, outerError) {
  if (innerError && outerError && innerError !== outerError) {
    if (Array.isArray(outerError.errors)) {
      // If `outerError` is already an `AggregateError`.
      outerError.errors.push(innerError)
      return outerError
    }
    const err = new AggregateError([outerError, innerError], outerError.message)
    err.code = outerError.code
    return err
  }
  return innerError || outerError
}
class AbortError extends Error {
  constructor(message = 'The operation was aborted', options = undefined) {
    if (options !== undefined && typeof options !== 'object') {
      throw new codes.ERR_INVALID_ARG_TYPE('options', 'Object', options)
    }
    super(message, options)
    this.code = 'ABORT_ERR'
    this.name = 'AbortError'
  }
}
E('ERR_ASSERTION', '%s', Error)
E(
  'ERR_INVALID_ARG_TYPE',
  (name, expected, actual) => {
    assert(typeof name === 'string', "'name' must be a string")
    if (!Array.isArray(expected)) {
      expected = [expected]
    }
    let msg = 'The '
    if (name.endsWith(' argument')) {
      // For cases like 'first argument'
      msg += `${name} `
    } else {
      msg += `"${name}" ${name.includes('.') ? 'property' : 'argument'} `
    }
    msg += 'must be '
    const types = []
    const instances = []
    const other = []
    for (const value of expected) {
      assert(typeof value === 'string', 'All expected entries have to be of type string')
      if (kTypes.includes(value)) {
        types.push(value.toLowerCase())
      } else if (classRegExp.test(value)) {
        instances.push(value)
      } else {
        assert(value !== 'object', 'The value "object" should be written as "Object"')
        other.push(value)
      }
    }

    // Special handle `object` in case other instances are allowed to outline
    // the differences between each other.
    if (instances.length > 0) {
      const pos = types.indexOf('object')
      if (pos !== -1) {
        types.splice(types, pos, 1)
        instances.push('Object')
      }
    }
    if (types.length > 0) {
      switch (types.length) {
        case 1:
          msg += `of type ${types[0]}`
          break
        case 2:
          msg += `one of type ${types[0]} or ${types[1]}`
          break
        default: {
          const last = types.pop()
          msg += `one of type ${types.join(', ')}, or ${last}`
        }
      }
      if (instances.length > 0 || other.length > 0) {
        msg += ' or '
      }
    }
    if (instances.length > 0) {
      switch (instances.length) {
        case 1:
          msg += `an instance of ${instances[0]}`
          break
        case 2:
          msg += `an instance of ${instances[0]} or ${instances[1]}`
          break
        default: {
          const last = instances.pop()
          msg += `an instance of ${instances.join(', ')}, or ${last}`
        }
      }
      if (other.length > 0) {
        msg += ' or '
      }
    }
    switch (other.length) {
      case 0:
        break
      case 1:
        if (other[0].toLowerCase() !== other[0]) {
          msg += 'an '
        }
        msg += `${other[0]}`
        break
      case 2:
        msg += `one of ${other[0]} or ${other[1]}`
        break
      default: {
        const last = other.pop()
        msg += `one of ${other.join(', ')}, or ${last}`
      }
    }
    if (actual == null) {
      msg += `. Received ${actual}`
    } else if (typeof actual === 'function' && actual.name) {
      msg += `. Received function ${actual.name}`
    } else if (typeof actual === 'object') {
      var _actual$constructor
      if (
        (_actual$constructor = actual.constructor) !== null &&
        _actual$constructor !== undefined &&
        _actual$constructor.name
      ) {
        msg += `. Received an instance of ${actual.constructor.name}`
      } else {
        const inspected = inspect(actual, {
          depth: -1
        })
        msg += `. Received ${inspected}`
      }
    } else {
      let inspected = inspect(actual, {
        colors: false
      })
      if (inspected.length > 25) {
        inspected = `${inspected.slice(0, 25)}...`
      }
      msg += `. Received type ${typeof actual} (${inspected})`
    }
    return msg
  },
  TypeError
)
E(
  'ERR_INVALID_ARG_VALUE',
  (name, value, reason = 'is invalid') => {
    let inspected = inspect(value)
    if (inspected.length > 128) {
      inspected = inspected.slice(0, 128) + '...'
    }
    const type = name.includes('.') ? 'property' : 'argument'
    return `The ${type} '${name}' ${reason}. Received ${inspected}`
  },
  TypeError
)
E(
  'ERR_INVALID_RETURN_VALUE',
  (input, name, value) => {
    var _value$constructor
    const type =
      value !== null &&
      value !== undefined &&
      (_value$constructor = value.constructor) !== null &&
      _value$constructor !== undefined &&
      _value$constructor.name
        ? `instance of ${value.constructor.name}`
        : `type ${typeof value}`
    return `Expected ${input} to be returned from the "${name}"` + ` function but got ${type}.`
  },
  TypeError
)
E(
  'ERR_MISSING_ARGS',
  (...args) => {
    assert(args.length > 0, 'At least one arg needs to be specified')
    let msg
    const len = args.length
    args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(' or ')
    switch (len) {
      case 1:
        msg += `The ${args[0]} argument`
        break
      case 2:
        msg += `The ${args[0]} and ${args[1]} arguments`
        break
      default:
        {
          const last = args.pop()
          msg += `The ${args.join(', ')}, and ${last} arguments`
        }
        break
    }
    return `${msg} must be specified`
  },
  TypeError
)
E(
  'ERR_OUT_OF_RANGE',
  (str, range, input) => {
    assert(range, 'Missing "range" argument')
    let received
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > 2n ** 32n || input < -(2n ** 32n)) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    } else {
      received = inspect(input)
    }
    return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`
  },
  RangeError
)
E('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times', Error)
E('ERR_METHOD_NOT_IMPLEMENTED', 'The %s method is not implemented', Error)
E('ERR_STREAM_ALREADY_FINISHED', 'Cannot call %s after a stream was finished', Error)
E('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable', Error)
E('ERR_STREAM_DESTROYED', 'Cannot call %s after a stream was destroyed', Error)
E('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError)
E('ERR_STREAM_PREMATURE_CLOSE', 'Premature close', Error)
E('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF', Error)
E('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event', Error)
E('ERR_STREAM_WRITE_AFTER_END', 'write after end', Error)
E('ERR_UNKNOWN_ENCODING', 'Unknown encoding: %s', TypeError)
module.exports = {
  AbortError,
  aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
  hideStackFrames,
  codes
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/ours/primordials.js":
/*!******************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/ours/primordials.js ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";


/*
  This file is a reduced and adapted version of the main lib/internal/per_context/primordials.js file defined at

  https://github.com/nodejs/node/blob/master/lib/internal/per_context/primordials.js

  Don't try to replace with the original file and keep it up to date with the upstream file.
*/
module.exports = {
  ArrayIsArray(self) {
    return Array.isArray(self)
  },
  ArrayPrototypeIncludes(self, el) {
    return self.includes(el)
  },
  ArrayPrototypeIndexOf(self, el) {
    return self.indexOf(el)
  },
  ArrayPrototypeJoin(self, sep) {
    return self.join(sep)
  },
  ArrayPrototypeMap(self, fn) {
    return self.map(fn)
  },
  ArrayPrototypePop(self, el) {
    return self.pop(el)
  },
  ArrayPrototypePush(self, el) {
    return self.push(el)
  },
  ArrayPrototypeSlice(self, start, end) {
    return self.slice(start, end)
  },
  Error,
  FunctionPrototypeCall(fn, thisArgs, ...args) {
    return fn.call(thisArgs, ...args)
  },
  FunctionPrototypeSymbolHasInstance(self, instance) {
    return Function.prototype[Symbol.hasInstance].call(self, instance)
  },
  MathFloor: Math.floor,
  Number,
  NumberIsInteger: Number.isInteger,
  NumberIsNaN: Number.isNaN,
  NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
  NumberParseInt: Number.parseInt,
  ObjectDefineProperties(self, props) {
    return Object.defineProperties(self, props)
  },
  ObjectDefineProperty(self, name, prop) {
    return Object.defineProperty(self, name, prop)
  },
  ObjectGetOwnPropertyDescriptor(self, name) {
    return Object.getOwnPropertyDescriptor(self, name)
  },
  ObjectKeys(obj) {
    return Object.keys(obj)
  },
  ObjectSetPrototypeOf(target, proto) {
    return Object.setPrototypeOf(target, proto)
  },
  Promise,
  PromisePrototypeCatch(self, fn) {
    return self.catch(fn)
  },
  PromisePrototypeThen(self, thenFn, catchFn) {
    return self.then(thenFn, catchFn)
  },
  PromiseReject(err) {
    return Promise.reject(err)
  },
  PromiseResolve(val) {
    return Promise.resolve(val)
  },
  ReflectApply: Reflect.apply,
  RegExpPrototypeTest(self, value) {
    return self.test(value)
  },
  SafeSet: Set,
  String,
  StringPrototypeSlice(self, start, end) {
    return self.slice(start, end)
  },
  StringPrototypeToLowerCase(self) {
    return self.toLowerCase()
  },
  StringPrototypeToUpperCase(self) {
    return self.toUpperCase()
  },
  StringPrototypeTrim(self) {
    return self.trim()
  },
  Symbol,
  SymbolFor: Symbol.for,
  SymbolAsyncIterator: Symbol.asyncIterator,
  SymbolHasInstance: Symbol.hasInstance,
  SymbolIterator: Symbol.iterator,
  SymbolDispose: Symbol.dispose || Symbol('Symbol.dispose'),
  SymbolAsyncDispose: Symbol.asyncDispose || Symbol('Symbol.asyncDispose'),
  TypedArrayPrototypeSet(self, buf, len) {
    return self.set(buf, len)
  },
  Boolean: Boolean,
  Uint8Array
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/ours/util.js":
/*!***********************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/ours/util.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const bufferModule = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
const { kResistStopPropagation, SymbolDispose } = __webpack_require__(/*! ./primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const AbortSignal = globalThis.AbortSignal || (__webpack_require__(/*! abort-controller */ "./src/node_modules/abort-controller/browser.js").AbortSignal)
const AbortController = globalThis.AbortController || (__webpack_require__(/*! abort-controller */ "./src/node_modules/abort-controller/browser.js").AbortController)
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const Blob = globalThis.Blob || bufferModule.Blob
/* eslint-disable indent */
const isBlob =
  typeof Blob !== 'undefined'
    ? function isBlob(b) {
        // eslint-disable-next-line indent
        return b instanceof Blob
      }
    : function isBlob(b) {
        return false
      }
/* eslint-enable indent */

const validateAbortSignal = (signal, name) => {
  if (signal !== undefined && (signal === null || typeof signal !== 'object' || !('aborted' in signal))) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
  }
}
const validateFunction = (value, name) => {
  if (typeof value !== 'function') throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
}

// This is a simplified version of AggregateError
class AggregateError extends Error {
  constructor(errors) {
    if (!Array.isArray(errors)) {
      throw new TypeError(`Expected input to be an Array, got ${typeof errors}`)
    }
    let message = ''
    for (let i = 0; i < errors.length; i++) {
      message += `    ${errors[i].stack}\n`
    }
    super(message)
    this.name = 'AggregateError'
    this.errors = errors
  }
}
module.exports = {
  AggregateError,
  kEmptyObject: Object.freeze({}),
  once(callback) {
    let called = false
    return function (...args) {
      if (called) {
        return
      }
      called = true
      callback.apply(this, args)
    }
  },
  createDeferredPromise: function () {
    let resolve
    let reject

    // eslint-disable-next-line promise/param-names
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    return {
      promise,
      resolve,
      reject
    }
  },
  promisify(fn) {
    return new Promise((resolve, reject) => {
      fn((err, ...args) => {
        if (err) {
          return reject(err)
        }
        return resolve(...args)
      })
    })
  },
  debuglog() {
    return function () {}
  },
  format(format, ...args) {
    // Simplified version of https://nodejs.org/api/util.html#utilformatformat-args
    return format.replace(/%([sdifj])/g, function (...[_unused, type]) {
      const replacement = args.shift()
      if (type === 'f') {
        return replacement.toFixed(6)
      } else if (type === 'j') {
        return JSON.stringify(replacement)
      } else if (type === 's' && typeof replacement === 'object') {
        const ctor = replacement.constructor !== Object ? replacement.constructor.name : ''
        return `${ctor} {}`.trim()
      } else {
        return replacement.toString()
      }
    })
  },
  inspect(value) {
    // Vastly simplified version of https://nodejs.org/api/util.html#utilinspectobject-options
    switch (typeof value) {
      case 'string':
        if (value.includes("'")) {
          if (!value.includes('"')) {
            return `"${value}"`
          } else if (!value.includes('`') && !value.includes('${')) {
            return `\`${value}\``
          }
        }
        return `'${value}'`
      case 'number':
        if (isNaN(value)) {
          return 'NaN'
        } else if (Object.is(value, -0)) {
          return String(value)
        }
        return value
      case 'bigint':
        return `${String(value)}n`
      case 'boolean':
      case 'undefined':
        return String(value)
      case 'object':
        return '{}'
    }
  },
  types: {
    isAsyncFunction(fn) {
      return fn instanceof AsyncFunction
    },
    isArrayBufferView(arr) {
      return ArrayBuffer.isView(arr)
    }
  },
  isBlob,
  deprecate(fn, message) {
    return fn
  },
  addAbortListener:
    (__webpack_require__(/*! events */ "./src/node_modules/events/events.js").addAbortListener) ||
    function addAbortListener(signal, listener) {
      if (signal === undefined) {
        throw new ERR_INVALID_ARG_TYPE('signal', 'AbortSignal', signal)
      }
      validateAbortSignal(signal, 'signal')
      validateFunction(listener, 'listener')
      let removeEventListener
      if (signal.aborted) {
        queueMicrotask(() => listener())
      } else {
        signal.addEventListener('abort', listener, {
          __proto__: null,
          once: true,
          [kResistStopPropagation]: true
        })
        removeEventListener = () => {
          signal.removeEventListener('abort', listener)
        }
      }
      return {
        __proto__: null,
        [SymbolDispose]() {
          var _removeEventListener
          ;(_removeEventListener = removeEventListener) === null || _removeEventListener === undefined
            ? undefined
            : _removeEventListener()
        }
      }
    },
  AbortSignalAny:
    AbortSignal.any ||
    function AbortSignalAny(signals) {
      // Fast path if there is only one signal.
      if (signals.length === 1) {
        return signals[0]
      }
      const ac = new AbortController()
      const abort = () => ac.abort()
      signals.forEach((signal) => {
        validateAbortSignal(signal, 'signals')
        signal.addEventListener('abort', abort, {
          once: true
        })
      })
      ac.signal.addEventListener(
        'abort',
        () => {
          signals.forEach((signal) => signal.removeEventListener('abort', abort))
        },
        {
          once: true
        }
      )
      return ac.signal
    }
}
module.exports.promisify.custom = Symbol.for('nodejs.util.promisify.custom')


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/stream.js":
/*!********************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/stream.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* replacement start */

const { Buffer } = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")

/* replacement end */
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

;('use strict')
const { ObjectDefineProperty, ObjectKeys, ReflectApply } = __webpack_require__(/*! ./ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const {
  promisify: { custom: customPromisify }
} = __webpack_require__(/*! ./ours/util */ "./src/node_modules/readable-stream/lib/ours/util.js")
const { streamReturningOperators, promiseReturningOperators } = __webpack_require__(/*! ./internal/streams/operators */ "./src/node_modules/readable-stream/lib/internal/streams/operators.js")
const {
  codes: { ERR_ILLEGAL_CONSTRUCTOR }
} = __webpack_require__(/*! ./ours/errors */ "./src/node_modules/readable-stream/lib/ours/errors.js")
const compose = __webpack_require__(/*! ./internal/streams/compose */ "./src/node_modules/readable-stream/lib/internal/streams/compose.js")
const { setDefaultHighWaterMark, getDefaultHighWaterMark } = __webpack_require__(/*! ./internal/streams/state */ "./src/node_modules/readable-stream/lib/internal/streams/state.js")
const { pipeline } = __webpack_require__(/*! ./internal/streams/pipeline */ "./src/node_modules/readable-stream/lib/internal/streams/pipeline.js")
const { destroyer } = __webpack_require__(/*! ./internal/streams/destroy */ "./src/node_modules/readable-stream/lib/internal/streams/destroy.js")
const eos = __webpack_require__(/*! ./internal/streams/end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
const internalBuffer = {}
const promises = __webpack_require__(/*! ./stream/promises */ "./src/node_modules/readable-stream/lib/stream/promises.js")
const utils = __webpack_require__(/*! ./internal/streams/utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const Stream = (module.exports = __webpack_require__(/*! ./internal/streams/legacy */ "./src/node_modules/readable-stream/lib/internal/streams/legacy.js").Stream)
Stream.isDestroyed = utils.isDestroyed
Stream.isDisturbed = utils.isDisturbed
Stream.isErrored = utils.isErrored
Stream.isReadable = utils.isReadable
Stream.isWritable = utils.isWritable
Stream.Readable = __webpack_require__(/*! ./internal/streams/readable */ "./src/node_modules/readable-stream/lib/internal/streams/readable.js")
for (const key of ObjectKeys(streamReturningOperators)) {
  const op = streamReturningOperators[key]
  function fn(...args) {
    if (new.target) {
      throw ERR_ILLEGAL_CONSTRUCTOR()
    }
    return Stream.Readable.from(ReflectApply(op, this, args))
  }
  ObjectDefineProperty(fn, 'name', {
    __proto__: null,
    value: op.name
  })
  ObjectDefineProperty(fn, 'length', {
    __proto__: null,
    value: op.length
  })
  ObjectDefineProperty(Stream.Readable.prototype, key, {
    __proto__: null,
    value: fn,
    enumerable: false,
    configurable: true,
    writable: true
  })
}
for (const key of ObjectKeys(promiseReturningOperators)) {
  const op = promiseReturningOperators[key]
  function fn(...args) {
    if (new.target) {
      throw ERR_ILLEGAL_CONSTRUCTOR()
    }
    return ReflectApply(op, this, args)
  }
  ObjectDefineProperty(fn, 'name', {
    __proto__: null,
    value: op.name
  })
  ObjectDefineProperty(fn, 'length', {
    __proto__: null,
    value: op.length
  })
  ObjectDefineProperty(Stream.Readable.prototype, key, {
    __proto__: null,
    value: fn,
    enumerable: false,
    configurable: true,
    writable: true
  })
}
Stream.Writable = __webpack_require__(/*! ./internal/streams/writable */ "./src/node_modules/readable-stream/lib/internal/streams/writable.js")
Stream.Duplex = __webpack_require__(/*! ./internal/streams/duplex */ "./src/node_modules/readable-stream/lib/internal/streams/duplex.js")
Stream.Transform = __webpack_require__(/*! ./internal/streams/transform */ "./src/node_modules/readable-stream/lib/internal/streams/transform.js")
Stream.PassThrough = __webpack_require__(/*! ./internal/streams/passthrough */ "./src/node_modules/readable-stream/lib/internal/streams/passthrough.js")
Stream.pipeline = pipeline
const { addAbortSignal } = __webpack_require__(/*! ./internal/streams/add-abort-signal */ "./src/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js")
Stream.addAbortSignal = addAbortSignal
Stream.finished = eos
Stream.destroy = destroyer
Stream.compose = compose
Stream.setDefaultHighWaterMark = setDefaultHighWaterMark
Stream.getDefaultHighWaterMark = getDefaultHighWaterMark
ObjectDefineProperty(Stream, 'promises', {
  __proto__: null,
  configurable: true,
  enumerable: true,
  get() {
    return promises
  }
})
ObjectDefineProperty(pipeline, customPromisify, {
  __proto__: null,
  enumerable: true,
  get() {
    return promises.pipeline
  }
})
ObjectDefineProperty(eos, customPromisify, {
  __proto__: null,
  enumerable: true,
  get() {
    return promises.finished
  }
})

// Backwards-compat with node 0.4.x
Stream.Stream = Stream
Stream._isUint8Array = function isUint8Array(value) {
  return value instanceof Uint8Array
}
Stream._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
}


/***/ }),

/***/ "./src/node_modules/readable-stream/lib/stream/promises.js":
/*!*****************************************************************!*\
  !*** ./src/node_modules/readable-stream/lib/stream/promises.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { ArrayPrototypePop, Promise } = __webpack_require__(/*! ../ours/primordials */ "./src/node_modules/readable-stream/lib/ours/primordials.js")
const { isIterable, isNodeStream, isWebStream } = __webpack_require__(/*! ../internal/streams/utils */ "./src/node_modules/readable-stream/lib/internal/streams/utils.js")
const { pipelineImpl: pl } = __webpack_require__(/*! ../internal/streams/pipeline */ "./src/node_modules/readable-stream/lib/internal/streams/pipeline.js")
const { finished } = __webpack_require__(/*! ../internal/streams/end-of-stream */ "./src/node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
__webpack_require__(/*! ../../lib/stream.js */ "./src/node_modules/readable-stream/lib/stream.js")
function pipeline(...streams) {
  return new Promise((resolve, reject) => {
    let signal
    let end
    const lastArg = streams[streams.length - 1]
    if (
      lastArg &&
      typeof lastArg === 'object' &&
      !isNodeStream(lastArg) &&
      !isIterable(lastArg) &&
      !isWebStream(lastArg)
    ) {
      const options = ArrayPrototypePop(streams)
      signal = options.signal
      end = options.end
    }
    pl(
      streams,
      (err, value) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      },
      {
        signal,
        end
      }
    )
  })
}
module.exports = {
  finished,
  pipeline
}


/***/ }),

/***/ "./src/node_modules/string_decoder/lib/string_decoder.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/string_decoder/lib/string_decoder.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = (__webpack_require__(/*! safe-buffer */ "./src/node_modules/string_decoder/node_modules/safe-buffer/index.js").Buffer);
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ "./src/node_modules/string_decoder/node_modules/safe-buffer/index.js":
/*!***************************************************************************!*\
  !*** ./src/node_modules/string_decoder/node_modules/safe-buffer/index.js ***!
  \***************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js")
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/backend.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/backend.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkOptions: () => (/* binding */ checkOptions),
/* harmony export */   isBackend: () => (/* binding */ isBackend),
/* harmony export */   isBackendConfig: () => (/* binding */ isBackendConfig)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");


/** @internal */
function isBackend(arg) {
    return arg != null && typeof arg == 'object' && 'isAvailable' in arg && typeof arg.isAvailable == 'function' && 'create' in arg && typeof arg.create == 'function';
}
/**
 * Checks that `options` object is valid for the file system options.
 * @internal
 */
async function checkOptions(backend, options) {
    if (typeof options != 'object' || options === null) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EINVAL, 'Invalid options');
    }
    // Check for required options.
    for (const [optName, opt] of Object.entries(backend.options)) {
        const providedValue = options?.[optName];
        if (providedValue === undefined || providedValue === null) {
            if (!opt.required) {
                continue;
            }
            /* Required option not provided.
            if any incorrect options provided, which ones are close to the provided one?
            (edit distance 5 === close)*/
            const incorrectOptions = Object.keys(options)
                .filter(o => !(o in backend.options))
                .map((a) => {
                return { str: a, distance: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.levenshtein)(optName, a) };
            })
                .filter(o => o.distance < 5)
                .sort((a, b) => a.distance - b.distance);
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EINVAL, `${backend.name}: Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` You provided '${incorrectOptions[0].str}', did you mean '${optName}'.` : ''}`);
        }
        // Option provided, check type.
        const typeMatches = Array.isArray(opt.type) ? opt.type.indexOf(typeof providedValue) != -1 : typeof providedValue == opt.type;
        if (!typeMatches) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EINVAL, `${backend.name}: Value provided for option ${optName} is not the proper type. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(', ')}}` : opt.type}, but received ${typeof providedValue}`);
        }
        if (opt.validator) {
            await opt.validator(providedValue);
        }
        // Otherwise: All good!
    }
}
/** @internal */
function isBackendConfig(arg) {
    return arg != null && typeof arg == 'object' && 'backend' in arg && isBackend(arg.backend);
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/fetch.js":
/*!*************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/fetch.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fetch: () => (/* binding */ Fetch),
/* harmony export */   FetchFS: () => (/* binding */ FetchFS)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file_index.js */ "./src/node_modules/@zenfs/core/dist/backends/file_index.js");


async function fetchFile(path, type, init) {
    const response = await fetch(path, init).catch((e) => {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, e.message, path);
    });
    if (!response.ok) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, 'fetch failed: response returned code ' + response.status, path);
    }
    switch (type) {
        case 'buffer': {
            const arrayBuffer = await response.arrayBuffer().catch((e) => {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, e.message, path);
            });
            return new Uint8Array(arrayBuffer);
        }
        case 'json':
            return response.json().catch((e) => {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, e.message, path);
            });
        default:
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EINVAL, 'Invalid download type: ' + type);
    }
}
/**
 * A simple filesystem backed by HTTP using the `fetch` API.
 *
 *
 * Index objects look like the following:
 *
 * ```json
 * {
 * 	"version": 1,
 * 	"entries": {
 * 		"/home": { ... },
 * 		"/home/jvilk": { ... },
 * 		"/home/james": { ... }
 * 	}
 * }
 * ```
 *
 * Each entry contains the stats associated with the file.
 */
class FetchFS extends _file_index_js__WEBPACK_IMPORTED_MODULE_1__.IndexFS {
    async ready() {
        if (this._isInitialized) {
            return;
        }
        await super.ready();
        if (this._disableSync) {
            return;
        }
        /**
         * Iterate over all of the files and cache their contents
         */
        for (const [path, stats] of this.index.files()) {
            await this.getData(path, stats);
        }
    }
    constructor({ index = 'index.json', baseUrl = '', requestInit }) {
        // prefix url must end in a directory separator.
        if (baseUrl.at(-1) != '/') {
            baseUrl += '/';
        }
        super(typeof index != 'string' ? index : fetchFile(index, 'json', requestInit));
        this.baseUrl = baseUrl;
        this.requestInit = requestInit;
    }
    metadata() {
        return {
            ...super.metadata(),
            name: FetchFS.name,
            readonly: true,
        };
    }
    /**
     * Preload the `path` into the index.
     */
    preload(path, buffer) {
        const stats = this.index.get(path);
        if (!stats) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOENT', path, 'preload');
        }
        if (!stats.isFile()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EISDIR', path, 'preload');
        }
        stats.size = buffer.length;
        stats.fileData = buffer;
    }
    /**
     * @todo Be lazier about actually requesting the data?
     */
    async getData(path, stats) {
        if (stats.fileData) {
            return stats.fileData;
        }
        const data = await fetchFile(this.baseUrl + (path.startsWith('/') ? path.slice(1) : path), 'buffer', this.requestInit);
        stats.fileData = data;
        return data;
    }
    getDataSync(path, stats) {
        if (stats.fileData) {
            return stats.fileData;
        }
        throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.ENODATA, '', path, 'getData');
    }
}
const _Fetch = {
    name: 'Fetch',
    options: {
        index: { type: ['string', 'object'], required: false },
        baseUrl: { type: 'string', required: false },
        requestInit: { type: 'object', required: false },
    },
    isAvailable() {
        return typeof globalThis.fetch == 'function';
    },
    create(options) {
        return new FetchFS(options);
    },
};
const Fetch = _Fetch;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/file_index.js":
/*!******************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/file_index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Index: () => (/* binding */ Index),
/* harmony export */   IndexFS: () => (/* binding */ IndexFS),
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
/* harmony import */ var utilium__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! utilium */ "./src/node_modules/utilium/dist/index.js");
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");
/* harmony import */ var _mixins_readonly_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../mixins/readonly.js */ "./src/node_modules/@zenfs/core/dist/mixins/readonly.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* Note: this file is named file_index.ts because Typescript has special behavior regarding index.ts which can't be disabled. */








const version = 1;
/**
 * An index of files
 * @internal
 */
class Index extends Map {
    /**
     * Convenience method
     */
    files() {
        const files = new Map();
        for (const [path, stats] of this) {
            if (stats.isFile()) {
                files.set(path, stats);
            }
        }
        return files;
    }
    /**
     * Converts the index to JSON
     */
    toJSON() {
        return {
            version,
            entries: Object.fromEntries(this),
        };
    }
    /**
     * Converts the index to a string
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
    /**
     * Returns the files in the directory `dir`.
     * This is expensive so it is only called once per directory.
     */
    dirEntries(dir) {
        const entries = [];
        for (const entry of this.keys()) {
            if ((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_1__.dirname)(entry) == dir) {
                entries.push((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_1__.basename)(entry));
            }
        }
        return entries;
    }
    /**
     * Loads the index from JSON data
     */
    fromJSON(json) {
        if (json.version != version) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EINVAL, 'Index version mismatch');
        }
        this.clear();
        for (const [path, data] of Object.entries(json.entries)) {
            const stats = new _stats_js__WEBPACK_IMPORTED_MODULE_6__.Stats(data);
            if (stats.isDirectory()) {
                stats.fileData = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeUTF8)(JSON.stringify(this.dirEntries(path)));
            }
            this.set(path, stats);
        }
    }
    /**
     * Parses an index from a string
     */
    static parse(data) {
        if (!(0,utilium__WEBPACK_IMPORTED_MODULE_0__.isJSON)(data)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EINVAL, 'Invalid JSON');
        }
        const json = JSON.parse(data);
        const index = new Index();
        index.fromJSON(json);
        return index;
    }
}
class IndexFS extends (0,_mixins_readonly_js__WEBPACK_IMPORTED_MODULE_5__.Readonly)(_filesystem_js__WEBPACK_IMPORTED_MODULE_4__.FileSystem) {
    async ready() {
        await super.ready();
        if (this._isInitialized) {
            return;
        }
        this.index.fromJSON(await this.indexData);
        this._isInitialized = true;
    }
    constructor(indexData) {
        super();
        this.indexData = indexData;
        this.index = new Index();
        this._isInitialized = false;
    }
    async reloadFiles() {
        for (const [path, stats] of this.index.files()) {
            delete stats.fileData;
            stats.fileData = await this.getData(path, stats);
        }
    }
    reloadFilesSync() {
        for (const [path, stats] of this.index.files()) {
            delete stats.fileData;
            stats.fileData = this.getDataSync(path, stats);
        }
    }
    stat(path) {
        return Promise.resolve(this.statSync(path));
    }
    statSync(path) {
        if (!this.index.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENOENT', path, 'stat');
        }
        return this.index.get(path);
    }
    async openFile(path, flag) {
        if ((0,_file_js__WEBPACK_IMPORTED_MODULE_3__.isWriteable)(flag)) {
            // You can't write to files on this file system.
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EPERM, path);
        }
        // Check if the path exists, and is a file.
        const stats = this.index.get(path);
        if (!stats) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENOENT', path, 'openFile');
        }
        return new _file_js__WEBPACK_IMPORTED_MODULE_3__.NoSyncFile(this, path, flag, stats, stats.isDirectory() ? stats.fileData : await this.getData(path, stats));
    }
    openFileSync(path, flag) {
        if ((0,_file_js__WEBPACK_IMPORTED_MODULE_3__.isWriteable)(flag)) {
            // You can't write to files on this file system.
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EPERM, path);
        }
        // Check if the path exists, and is a file.
        const stats = this.index.get(path);
        if (!stats) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENOENT', path, 'openFile');
        }
        return new _file_js__WEBPACK_IMPORTED_MODULE_3__.NoSyncFile(this, path, flag, stats, stats.isDirectory() ? stats.fileData : this.getDataSync(path, stats));
    }
    readdir(path) {
        return Promise.resolve(this.readdirSync(path));
    }
    readdirSync(path) {
        // Check if it exists.
        const stats = this.index.get(path);
        if (!stats) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENOENT', path, 'readdir');
        }
        const content = JSON.parse((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeUTF8)(stats.fileData));
        if (!Array.isArray(content)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENODATA', path, 'readdir');
        }
        if (!content.every(item => typeof item == 'string')) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('ENODATA', path, 'readdir');
        }
        return content;
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/memory.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/memory.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InMemory: () => (/* binding */ InMemory),
/* harmony export */   InMemoryStore: () => (/* binding */ InMemoryStore)
/* harmony export */ });
/* harmony import */ var _store_fs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store/fs.js */ "./src/node_modules/@zenfs/core/dist/backends/store/fs.js");
/* harmony import */ var _store_simple_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/simple.js */ "./src/node_modules/@zenfs/core/dist/backends/store/simple.js");


/**
 * A simple in-memory store
 */
class InMemoryStore extends Map {
    constructor(name = 'tmp') {
        super();
        this.name = name;
    }
    async sync() { }
    clearSync() {
        this.clear();
    }
    transaction() {
        return new _store_simple_js__WEBPACK_IMPORTED_MODULE_1__.SimpleTransaction(this);
    }
}
/**
 * A simple in-memory file system backed by an InMemoryStore.
 * Files are not persisted across page loads.
 */
const _InMemory = {
    name: 'InMemory',
    isAvailable() {
        return true;
    },
    options: {
        name: { type: 'string', required: false },
    },
    create({ name }) {
        const fs = new _store_fs_js__WEBPACK_IMPORTED_MODULE_0__.StoreFS(new InMemoryStore(name));
        fs.checkRootSync();
        return fs;
    },
};
const InMemory = _InMemory;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/overlay.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/overlay.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Overlay: () => (/* binding */ Overlay),
/* harmony export */   OverlayFS: () => (/* binding */ OverlayFS),
/* harmony export */   UnmutexedOverlayFS: () => (/* binding */ UnmutexedOverlayFS)
/* harmony export */ });
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");
/* harmony import */ var _mixins_mutexed_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mixins/mutexed.js */ "./src/node_modules/@zenfs/core/dist/mixins/mutexed.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});






/** @internal */
const deletionLogPath = '/.deleted';
/**
 * OverlayFS makes a read-only filesystem writable by storing writes on a second, writable file system.
 * Deletes are persisted via metadata stored on the writable file system.
 *
 * This class contains no locking whatsoever. It is mutexed to prevent races.
 *
 * @internal
 */
class UnmutexedOverlayFS extends _filesystem_js__WEBPACK_IMPORTED_MODULE_3__.FileSystem {
    async ready() {
        await this.readable.ready();
        await this.writable.ready();
        await this._ready;
    }
    constructor({ writable, readable }) {
        super();
        this._isInitialized = false;
        this._deletedFiles = new Set();
        this._deleteLog = '';
        // If 'true', we have scheduled a delete log update.
        this._deleteLogUpdatePending = false;
        // If 'true', a delete log update is needed after the scheduled delete log
        // update finishes.
        this._deleteLogUpdateNeeded = false;
        this.writable = writable;
        this.readable = readable;
        if (this.writable.metadata().readonly) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Writable file system must be writable.');
        }
        this._ready = this._initialize();
    }
    metadata() {
        return {
            ...super.metadata(),
            name: OverlayFS.name,
        };
    }
    async sync(path, data, stats) {
        await this.copyForWrite(path);
        if (!(await this.writable.exists(path))) {
            await this.writable.createFile(path, 'w', 0o644);
        }
        await this.writable.sync(path, data, stats);
    }
    syncSync(path, data, stats) {
        this.copyForWriteSync(path);
        this.writable.syncSync(path, data, stats);
    }
    /**
     * Called once to load up metadata stored on the writable file system.
     * @internal
     */
    async _initialize() {
        if (this._isInitialized) {
            return;
        }
        // Read deletion log, process into metadata.
        try {
            const file = await this.writable.openFile(deletionLogPath, (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)('r'));
            const { size } = await file.stat();
            const { buffer } = await file.read(new Uint8Array(size));
            this._deleteLog = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.decodeUTF8)(buffer);
        }
        catch (err) {
            if (err.errno !== _error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.ENOENT) {
                throw err;
            }
        }
        this._isInitialized = true;
        this._reparseDeletionLog();
    }
    getDeletionLog() {
        return this._deleteLog;
    }
    async restoreDeletionLog(log) {
        this._deleteLog = log;
        this._reparseDeletionLog();
        await this.updateLog('');
    }
    async rename(oldPath, newPath) {
        this.checkInitialized();
        this.checkPath(oldPath);
        this.checkPath(newPath);
        await this.copyForWrite(oldPath);
        try {
            await this.writable.rename(oldPath, newPath);
        }
        catch {
            if (this._deletedFiles.has(oldPath)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', oldPath, 'rename');
            }
        }
    }
    renameSync(oldPath, newPath) {
        this.checkInitialized();
        this.checkPath(oldPath);
        this.checkPath(newPath);
        this.copyForWriteSync(oldPath);
        try {
            this.writable.renameSync(oldPath, newPath);
        }
        catch {
            if (this._deletedFiles.has(oldPath)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', oldPath, 'rename');
            }
        }
    }
    async stat(path) {
        this.checkInitialized();
        try {
            return await this.writable.stat(path);
        }
        catch {
            if (this._deletedFiles.has(path)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'stat');
            }
            const oldStat = await this.readable.stat(path);
            // Make the oldStat's mode writable.
            oldStat.mode |= 0o222;
            return oldStat;
        }
    }
    statSync(path) {
        this.checkInitialized();
        try {
            return this.writable.statSync(path);
        }
        catch {
            if (this._deletedFiles.has(path)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'stat');
            }
            const oldStat = this.readable.statSync(path);
            // Make the oldStat's mode writable.
            oldStat.mode |= 0o222;
            return oldStat;
        }
    }
    async openFile(path, flag) {
        if (await this.writable.exists(path)) {
            return this.writable.openFile(path, flag);
        }
        // Create an OverlayFile.
        const file = await this.readable.openFile(path, (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)('r'));
        const stats = await file.stat();
        const { buffer } = await file.read(new Uint8Array(stats.size));
        return new _file_js__WEBPACK_IMPORTED_MODULE_2__.PreloadFile(this, path, flag, stats, buffer);
    }
    openFileSync(path, flag) {
        if (this.writable.existsSync(path)) {
            return this.writable.openFileSync(path, flag);
        }
        // Create an OverlayFile.
        const file = this.readable.openFileSync(path, (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)('r'));
        const stats = file.statSync();
        const data = new Uint8Array(stats.size);
        file.readSync(data);
        return new _file_js__WEBPACK_IMPORTED_MODULE_2__.PreloadFile(this, path, flag, stats, data);
    }
    async createFile(path, flag, mode) {
        this.checkInitialized();
        await this.writable.createFile(path, flag, mode);
        return this.openFile(path, flag);
    }
    createFileSync(path, flag, mode) {
        this.checkInitialized();
        this.writable.createFileSync(path, flag, mode);
        return this.openFileSync(path, flag);
    }
    async link(srcpath, dstpath) {
        this.checkInitialized();
        await this.copyForWrite(srcpath);
        await this.writable.link(srcpath, dstpath);
    }
    linkSync(srcpath, dstpath) {
        this.checkInitialized();
        this.copyForWriteSync(srcpath);
        this.writable.linkSync(srcpath, dstpath);
    }
    async unlink(path) {
        this.checkInitialized();
        this.checkPath(path);
        if (!(await this.exists(path))) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'unlink');
        }
        if (await this.writable.exists(path)) {
            await this.writable.unlink(path);
        }
        // if it still exists add to the delete log
        if (await this.exists(path)) {
            await this.deletePath(path);
        }
    }
    unlinkSync(path) {
        this.checkInitialized();
        this.checkPath(path);
        if (!this.existsSync(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'unlink');
        }
        if (this.writable.existsSync(path)) {
            this.writable.unlinkSync(path);
        }
        // if it still exists add to the delete log
        if (this.existsSync(path)) {
            void this.deletePath(path);
        }
    }
    async rmdir(path) {
        this.checkInitialized();
        if (!(await this.exists(path))) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'rmdir');
        }
        if (await this.writable.exists(path)) {
            await this.writable.rmdir(path);
        }
        if (!(await this.exists(path))) {
            return;
        }
        // Check if directory is empty.
        if ((await this.readdir(path)).length) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTEMPTY', path, 'rmdir');
        }
        await this.deletePath(path);
    }
    rmdirSync(path) {
        this.checkInitialized();
        if (!this.existsSync(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'rmdir');
        }
        if (this.writable.existsSync(path)) {
            this.writable.rmdirSync(path);
        }
        if (!this.existsSync(path)) {
            return;
        }
        // Check if directory is empty.
        if (this.readdirSync(path).length) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTEMPTY', path, 'rmdir');
        }
        void this.deletePath(path);
    }
    async mkdir(path, mode) {
        this.checkInitialized();
        if (await this.exists(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path, 'mkdir');
        }
        // The below will throw should any of the parent directories fail to exist on _writable.
        await this.createParentDirectories(path);
        await this.writable.mkdir(path, mode);
    }
    mkdirSync(path, mode) {
        this.checkInitialized();
        if (this.existsSync(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path, 'mkdir');
        }
        // The below will throw should any of the parent directories fail to exist on _writable.
        this.createParentDirectoriesSync(path);
        this.writable.mkdirSync(path, mode);
    }
    async readdir(path) {
        this.checkInitialized();
        // Readdir in both, check delete log on RO file system's listing, merge, return.
        const contents = [];
        try {
            contents.push(...(await this.writable.readdir(path)));
        }
        catch {
            // NOP.
        }
        try {
            contents.push(...(await this.readable.readdir(path)).filter((fPath) => !this._deletedFiles.has(`${path}/${fPath}`)));
        }
        catch {
            // NOP.
        }
        const seenMap = {};
        return contents.filter((path) => {
            const result = !seenMap[path];
            seenMap[path] = true;
            return result;
        });
    }
    readdirSync(path) {
        this.checkInitialized();
        // Readdir in both, check delete log on RO file system's listing, merge, return.
        let contents = [];
        try {
            contents = contents.concat(this.writable.readdirSync(path));
        }
        catch {
            // NOP.
        }
        try {
            contents = contents.concat(this.readable.readdirSync(path).filter((fPath) => !this._deletedFiles.has(`${path}/${fPath}`)));
        }
        catch {
            // NOP.
        }
        const seenMap = {};
        return contents.filter((path) => {
            const result = !seenMap[path];
            seenMap[path] = true;
            return result;
        });
    }
    async deletePath(path) {
        this._deletedFiles.add(path);
        await this.updateLog(`d${path}\n`);
    }
    async updateLog(addition) {
        this._deleteLog += addition;
        if (this._deleteLogUpdatePending) {
            this._deleteLogUpdateNeeded = true;
            return;
        }
        this._deleteLogUpdatePending = true;
        const log = await this.writable.openFile(deletionLogPath, (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)('w'));
        try {
            await log.write((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.encodeUTF8)(this._deleteLog));
            if (this._deleteLogUpdateNeeded) {
                this._deleteLogUpdateNeeded = false;
                await this.updateLog('');
            }
        }
        catch (e) {
            this._deleteLogError = e;
        }
        finally {
            this._deleteLogUpdatePending = false;
        }
    }
    _reparseDeletionLog() {
        this._deletedFiles.clear();
        for (const entry of this._deleteLog.split('\n')) {
            if (!entry.startsWith('d')) {
                continue;
            }
            // If the log entry begins w/ 'd', it's a deletion.
            this._deletedFiles.add(entry.slice(1));
        }
    }
    checkInitialized() {
        if (!this._isInitialized) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EPERM, 'OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it.');
        }
        if (!this._deleteLogError) {
            return;
        }
        const error = this._deleteLogError;
        delete this._deleteLogError;
        throw error;
    }
    checkPath(path) {
        if (path == deletionLogPath) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EPERM', path, 'checkPath');
        }
    }
    /**
     * Create the needed parent directories on the writable storage should they not exist.
     * Use modes from the read-only storage.
     */
    createParentDirectoriesSync(path) {
        let parent = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(path);
        const toCreate = [];
        while (!this.writable.existsSync(parent)) {
            toCreate.push(parent);
            parent = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(parent);
        }
        for (const path of toCreate.reverse()) {
            this.writable.mkdirSync(path, this.statSync(path).mode);
        }
    }
    /**
     * Create the needed parent directories on the writable storage should they not exist.
     * Use modes from the read-only storage.
     */
    async createParentDirectories(path) {
        let parent = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(path);
        const toCreate = [];
        while (!(await this.writable.exists(parent))) {
            toCreate.push(parent);
            parent = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(parent);
        }
        for (const path of toCreate.reverse()) {
            const stats = await this.stat(path);
            await this.writable.mkdir(path, stats.mode);
        }
    }
    /**
     * Helper function:
     * - Ensures p is on writable before proceeding. Throws an error if it doesn't exist.
     * - Calls f to perform operation on writable.
     */
    copyForWriteSync(path) {
        if (!this.existsSync(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'copyForWrite');
        }
        if (!this.writable.existsSync((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(path))) {
            this.createParentDirectoriesSync(path);
        }
        if (!this.writable.existsSync(path)) {
            this.copyToWritableSync(path);
        }
    }
    async copyForWrite(path) {
        if (!(await this.exists(path))) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'copyForWrite');
        }
        if (!(await this.writable.exists((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(path)))) {
            await this.createParentDirectories(path);
        }
        if (!(await this.writable.exists(path))) {
            return this.copyToWritable(path);
        }
    }
    /**
     * Copy from readable to writable storage.
     * PRECONDITION: File does not exist on writable storage.
     */
    copyToWritableSync(path) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const stats = this.statSync(path);
            if (stats.isDirectory()) {
                this.writable.mkdirSync(path, stats.mode);
                return;
            }
            const data = new Uint8Array(stats.size);
            const readable = __addDisposableResource(env_1, this.readable.openFileSync(path, 'r'), false);
            readable.readSync(data);
            const writable = __addDisposableResource(env_1, this.writable.createFileSync(path, 'w', stats.mode | 0o222), false);
            writable.writeSync(data);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    async copyToWritable(path) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const stats = await this.stat(path);
            if (stats.isDirectory()) {
                await this.writable.mkdir(path, stats.mode);
                return;
            }
            const data = new Uint8Array(stats.size);
            const readable = __addDisposableResource(env_2, await this.readable.openFile(path, 'r'), true);
            await readable.read(data);
            const writable = __addDisposableResource(env_2, await this.writable.createFile(path, 'w', stats.mode | 0o222), true);
            await writable.write(data);
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_2);
            if (result_1)
                await result_1;
        }
    }
}
/**
 * OverlayFS makes a read-only filesystem writable by storing writes on a second,
 * writable file system. Deletes are persisted via metadata stored on the writable
 * file system.
 * @internal
 */
class OverlayFS extends (0,_mixins_mutexed_js__WEBPACK_IMPORTED_MODULE_4__.Mutexed)(UnmutexedOverlayFS) {
}
const _Overlay = {
    name: 'Overlay',
    options: {
        writable: {
            type: 'object',
            required: true,
            description: 'The file system to write modified files to.',
        },
        readable: {
            type: 'object',
            required: true,
            description: 'The file system that initially populates this file system.',
        },
    },
    isAvailable() {
        return true;
    },
    create(options) {
        return new OverlayFS(options);
    },
};
const Overlay = _Overlay;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/port/fs.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/port/fs.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Port: () => (/* binding */ Port),
/* harmony export */   PortFS: () => (/* binding */ PortFS),
/* harmony export */   PortFile: () => (/* binding */ PortFile),
/* harmony export */   attachFS: () => (/* binding */ attachFS),
/* harmony export */   detachFS: () => (/* binding */ detachFS),
/* harmony export */   handleRequest: () => (/* binding */ handleRequest),
/* harmony export */   resolveRemoteMount: () => (/* binding */ resolveRemoteMount)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./src/node_modules/@zenfs/core/dist/config.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");
/* harmony import */ var _mixins_async_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mixins/async.js */ "./src/node_modules/@zenfs/core/dist/mixins/async.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _memory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../memory.js */ "./src/node_modules/@zenfs/core/dist/backends/memory.js");
/* harmony import */ var _rpc_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./rpc.js */ "./src/node_modules/@zenfs/core/dist/backends/port/rpc.js");








class PortFile extends _file_js__WEBPACK_IMPORTED_MODULE_2__.File {
    constructor(fs, fd, path, position) {
        super(fs, path);
        this.fs = fs;
        this.fd = fd;
        this.position = position;
    }
    rpc(method, ...args) {
        return _rpc_js__WEBPACK_IMPORTED_MODULE_7__.request({
            scope: 'file',
            fd: this.fd,
            method,
            args,
        }, this.fs.options);
    }
    _throwNoSync(syscall) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.ENOTSUP, 'Synchronous operations not supported on PortFile', this.path, syscall);
    }
    async stat() {
        return new _stats_js__WEBPACK_IMPORTED_MODULE_5__.Stats(await this.rpc('stat'));
    }
    statSync() {
        this._throwNoSync('stat');
    }
    truncate(len) {
        return this.rpc('truncate', len);
    }
    truncateSync() {
        this._throwNoSync('truncate');
    }
    write(buffer, offset, length, position) {
        return this.rpc('write', buffer, offset, length, position);
    }
    writeSync() {
        this._throwNoSync('write');
    }
    async read(buffer, offset, length, position) {
        const result = await this.rpc('read', buffer, offset, length, position);
        return result;
    }
    readSync() {
        this._throwNoSync('read');
    }
    chown(uid, gid) {
        return this.rpc('chown', uid, gid);
    }
    chownSync() {
        this._throwNoSync('chown');
    }
    chmod(mode) {
        return this.rpc('chmod', mode);
    }
    chmodSync() {
        this._throwNoSync('chmod');
    }
    utimes(atime, mtime) {
        return this.rpc('utimes', atime, mtime);
    }
    utimesSync() {
        this._throwNoSync('utimes');
    }
    _setType(type) {
        return this.rpc('_setType', type);
    }
    _setTypeSync() {
        this._throwNoSync('_setType');
    }
    close() {
        return this.rpc('close');
    }
    closeSync() {
        this._throwNoSync('close');
    }
    sync() {
        return this.rpc('sync');
    }
    syncSync() {
        this._throwNoSync('sync');
    }
}
/**
 * PortFS lets you access an FS instance that is running in a port, or the other way around.
 *
 * Note that *direct* synchronous operations are not permitted on the PortFS,
 * regardless of the configuration option of the remote FS.
 */
class PortFS extends (0,_mixins_async_js__WEBPACK_IMPORTED_MODULE_4__.Async)(_filesystem_js__WEBPACK_IMPORTED_MODULE_3__.FileSystem) {
    /**
     * Constructs a new PortFS instance that connects with the FS running on `options.port`.
     */
    constructor(options) {
        super();
        this.options = options;
        /**
         * @hidden
         */
        this._sync = _memory_js__WEBPACK_IMPORTED_MODULE_6__.InMemory.create({ name: 'port-tmpfs' });
        this.port = options.port;
        _rpc_js__WEBPACK_IMPORTED_MODULE_7__.attach(this.port, _rpc_js__WEBPACK_IMPORTED_MODULE_7__.handleResponse);
    }
    metadata() {
        return {
            ...super.metadata(),
            name: 'PortFS',
        };
    }
    rpc(method, ...args) {
        return _rpc_js__WEBPACK_IMPORTED_MODULE_7__.request({
            scope: 'fs',
            method,
            args,
        }, { ...this.options, fs: this });
    }
    async ready() {
        await this.rpc('ready');
        await super.ready();
    }
    rename(oldPath, newPath) {
        return this.rpc('rename', oldPath, newPath);
    }
    async stat(path) {
        return new _stats_js__WEBPACK_IMPORTED_MODULE_5__.Stats(await this.rpc('stat', path));
    }
    sync(path, data, stats) {
        return this.rpc('sync', path, data, stats);
    }
    openFile(path, flag) {
        return this.rpc('openFile', path, flag);
    }
    createFile(path, flag, mode) {
        return this.rpc('createFile', path, flag, mode);
    }
    unlink(path) {
        return this.rpc('unlink', path);
    }
    rmdir(path) {
        return this.rpc('rmdir', path);
    }
    mkdir(path, mode) {
        return this.rpc('mkdir', path, mode);
    }
    readdir(path) {
        return this.rpc('readdir', path);
    }
    exists(path) {
        return this.rpc('exists', path);
    }
    link(srcpath, dstpath) {
        return this.rpc('link', srcpath, dstpath);
    }
}
let nextFd = 0;
const descriptors = new Map();
/** @internal */
async function handleRequest(port, fs, request) {
    if (!_rpc_js__WEBPACK_IMPORTED_MODULE_7__.isMessage(request)) {
        return;
    }
    const { method, args, id, scope, stack } = request;
    let value, error = false;
    try {
        switch (scope) {
            case 'fs':
                // @ts-expect-error 2556
                value = await fs[method](...args);
                if (value instanceof _file_js__WEBPACK_IMPORTED_MODULE_2__.File) {
                    descriptors.set(++nextFd, value);
                    value = {
                        fd: nextFd,
                        path: value.path,
                        position: value.position,
                    };
                }
                break;
            case 'file': {
                const { fd } = request;
                if (!descriptors.has(fd)) {
                    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EBADF);
                }
                // @ts-expect-error 2556
                value = await descriptors.get(fd)[method](...args);
                if (method == 'close') {
                    descriptors.delete(fd);
                }
                break;
            }
            default:
                return;
        }
    }
    catch (e) {
        value = e instanceof _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError ? e.toJSON() : e.toString();
        error = true;
    }
    port.postMessage({ _zenfs: true, scope, id, error, method, stack, value });
}
function attachFS(port, fs) {
    _rpc_js__WEBPACK_IMPORTED_MODULE_7__.attach(port, request => handleRequest(port, fs, request));
}
function detachFS(port, fs) {
    _rpc_js__WEBPACK_IMPORTED_MODULE_7__.detach(port, request => handleRequest(port, fs, request));
}
const _Port = {
    name: 'Port',
    options: {
        port: {
            type: 'object',
            required: true,
            validator(port) {
                // Check for a `postMessage` function.
                if (typeof port?.postMessage != 'function') {
                    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'option must be a port.');
                }
            },
        },
        timeout: {
            type: 'number',
            required: false,
        },
    },
    isAvailable() {
        return true;
    },
    create(options) {
        return new PortFS(options);
    },
};
const Port = _Port;
async function resolveRemoteMount(port, config, _depth = 0) {
    const stopAndReplay = _rpc_js__WEBPACK_IMPORTED_MODULE_7__.catchMessages(port);
    const fs = await (0,_config_js__WEBPACK_IMPORTED_MODULE_0__.resolveMountConfig)(config, _depth);
    attachFS(port, fs);
    stopAndReplay(fs);
    return fs;
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/port/rpc.js":
/*!****************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/port/rpc.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attach: () => (/* binding */ attach),
/* harmony export */   catchMessages: () => (/* binding */ catchMessages),
/* harmony export */   detach: () => (/* binding */ detach),
/* harmony export */   handleResponse: () => (/* binding */ handleResponse),
/* harmony export */   isMessage: () => (/* binding */ isMessage),
/* harmony export */   request: () => (/* binding */ request)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _fs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fs.js */ "./src/node_modules/@zenfs/core/dist/backends/port/fs.js");
/* eslint-disable @typescript-eslint/no-explicit-any */


function isFileData(value) {
    return typeof value == 'object' && value != null && 'fd' in value && 'path' in value && 'position' in value;
}
// general types
function isMessage(arg) {
    return typeof arg == 'object' && arg != null && '_zenfs' in arg && !!arg._zenfs;
}
const executors = new Map();
function request(request, { port, timeout = 1000, fs } = {}) {
    const stack = '\n' + new Error().stack.slice('Error:'.length);
    if (!port) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EINVAL');
    }
    return new Promise((resolve, reject) => {
        const id = Math.random().toString(16).slice(10);
        executors.set(id, { resolve, reject, fs });
        port.postMessage({ ...request, _zenfs: true, id, stack });
        const _ = setTimeout(() => {
            const error = new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, 'RPC Failed');
            error.stack += stack;
            reject(error);
            if (typeof _ == 'object')
                _.unref();
        }, timeout);
    });
}
function handleResponse(response) {
    if (!isMessage(response)) {
        return;
    }
    const { id, value, error, stack } = response;
    if (!executors.has(id)) {
        const error = new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, 'Invalid RPC id:' + id);
        error.stack += stack;
        throw error;
    }
    const { resolve, reject, fs } = executors.get(id);
    if (error) {
        const e = typeof value == 'string' ? new Error(value) : _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.fromJSON(value);
        e.stack += stack;
        reject(e);
        executors.delete(id);
        return;
    }
    if (isFileData(value)) {
        const { fd, path, position } = value;
        const file = new _fs_js__WEBPACK_IMPORTED_MODULE_1__.PortFile(fs, fd, path, position);
        resolve(file);
        executors.delete(id);
        return;
    }
    resolve(value);
    executors.delete(id);
    return;
}
function attach(port, handler) {
    if (!port) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EINVAL');
    }
    port['on' in port ? 'on' : 'addEventListener']('message', (message) => {
        handler('data' in message ? message.data : message);
    });
}
function detach(port, handler) {
    if (!port) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EINVAL');
    }
    port['off' in port ? 'off' : 'removeEventListener']('message', (message) => {
        handler('data' in message ? message.data : message);
    });
}
function catchMessages(port) {
    const events = [];
    const handler = events.push.bind(events);
    attach(port, handler);
    return function (fs) {
        detach(port, handler);
        for (const event of events) {
            const request = ('data' in event ? event.data : event);
            void (0,_fs_js__WEBPACK_IMPORTED_MODULE_1__.handleRequest)(port, fs, request);
        }
    };
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/store/fs.js":
/*!****************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/store/fs.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StoreFS: () => (/* binding */ StoreFS)
/* harmony export */ });
/* harmony import */ var _credentials_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../credentials.js */ "./src/node_modules/@zenfs/core/dist/credentials.js");
/* harmony import */ var _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../emulation/constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");
/* harmony import */ var _inode_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../inode.js */ "./src/node_modules/@zenfs/core/dist/inode.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var utilium__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! utilium */ "./src/node_modules/utilium/dist/index.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});









const maxInodeAllocTries = 5;
/**
 * A file system which uses a key-value store.
 *
 * We use a unique ID for each node in the file system. The root node has a fixed ID.
 * @todo Introduce Node ID caching.
 * @todo Check modes.
 * @internal
 */
class StoreFS extends _filesystem_js__WEBPACK_IMPORTED_MODULE_5__.FileSystem {
    async ready() {
        if (this._initialized) {
            return;
        }
        await this.checkRoot();
        this._initialized = true;
    }
    constructor(store) {
        super();
        this.store = store;
        this._initialized = false;
    }
    metadata() {
        return {
            ...super.metadata(),
            name: this.store.name,
        };
    }
    /**
     * Delete all contents stored in the file system.
     * @deprecated
     */
    async empty() {
        await this.store.clear();
        // Root always exists.
        await this.checkRoot();
    }
    /**
     * Delete all contents stored in the file system.
     * @deprecated
     */
    emptySync() {
        this.store.clearSync();
        // Root always exists.
        this.checkRootSync();
    }
    /**
     * @todo Make rename compatible with the cache.
     */
    async rename(oldPath, newPath) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_1, this.store.transaction(), true);
            const _old = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(oldPath), _new = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(newPath), 
            // Remove oldPath from parent's directory listing.
            oldDirNode = await this.findInode(tx, _old.dir, 'rename'), oldDirList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, oldDirNode.data, _old.dir, 'rename'));
            if (!oldDirList[_old.base]) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', oldPath, 'rename');
            }
            const ino = oldDirList[_old.base];
            delete oldDirList[_old.base];
            /*
                Can't move a folder inside itself.
                This ensures that the check passes only if `oldPath` is a subpath of `_new.dir`.
                We append '/' to avoid matching folders that are a substring of the bottom-most folder in the path.
            */
            if ((_new.dir + '/').indexOf(oldPath + '/') === 0) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EBUSY, _old.dir);
            }
            // Add newPath to parent's directory listing.
            const sameParent = _new.dir == _old.dir;
            // Prevent us from re-grabbing the same directory listing, which still contains `old_path.base.`
            const newDirNode = sameParent ? oldDirNode : await this.findInode(tx, _new.dir, 'rename');
            const newDirList = sameParent ? oldDirList : (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, newDirNode.data, _new.dir, 'rename'));
            if (newDirList[_new.base]) {
                // If it's a file, delete it, if it's a directory, throw a permissions error.
                const existing = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, newDirList[_new.base], newPath, 'rename'));
                if (!existing.toStats().isFile()) {
                    throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', newPath, 'rename');
                }
                await tx.remove(existing.data);
                await tx.remove(newDirList[_new.base]);
            }
            newDirList[_new.base] = ino;
            // Commit the two changed directory listings.
            await tx.set(oldDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(oldDirList));
            await tx.set(newDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(newDirList));
            await tx.commit();
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_1);
            if (result_1)
                await result_1;
        }
    }
    renameSync(oldPath, newPath) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_2, this.store.transaction(), false);
            const _old = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(oldPath), _new = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(newPath), 
            // Remove oldPath from parent's directory listing.
            oldDirNode = this.findInodeSync(tx, _old.dir, 'rename'), oldDirList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, oldDirNode.data, _old.dir, 'rename'));
            if (!oldDirList[_old.base]) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', oldPath, 'rename');
            }
            const ino = oldDirList[_old.base];
            delete oldDirList[_old.base];
            /*
                Can't move a folder inside itself.
                This ensures that the check passes only if `oldPath` is a subpath of `_new.dir`.
                We append '/' to avoid matching folders that are a substring of the bottom-most folder in the path.
            */
            if ((_new.dir + '/').indexOf(oldPath + '/') == 0) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EBUSY, _old.dir);
            }
            // Add newPath to parent's directory listing.
            const sameParent = _new.dir === _old.dir;
            // Prevent us from re-grabbing the same directory listing, which still contains `old_path.base.`
            const newDirNode = sameParent ? oldDirNode : this.findInodeSync(tx, _new.dir, 'rename');
            const newDirList = sameParent ? oldDirList : (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, newDirNode.data, _new.dir, 'rename'));
            if (newDirList[_new.base]) {
                // If it's a file, delete it, if it's a directory, throw a permissions error.
                const existing = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, newDirList[_new.base], newPath, 'rename'));
                if (!existing.toStats().isFile()) {
                    throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', newPath, 'rename');
                }
                tx.removeSync(existing.data);
                tx.removeSync(newDirList[_new.base]);
            }
            newDirList[_new.base] = ino;
            // Commit the two changed directory listings.
            tx.setSync(oldDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(oldDirList));
            tx.setSync(newDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(newDirList));
            tx.commitSync();
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            __disposeResources(env_2);
        }
    }
    async stat(path) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_3, this.store.transaction(), true);
            return (await this.findInode(tx, path, 'stat')).toStats();
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            const result_2 = __disposeResources(env_3);
            if (result_2)
                await result_2;
        }
    }
    statSync(path) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_4, this.store.transaction(), false);
            return this.findInodeSync(tx, path, 'stat').toStats();
        }
        catch (e_4) {
            env_4.error = e_4;
            env_4.hasError = true;
        }
        finally {
            __disposeResources(env_4);
        }
    }
    async createFile(path, flag, mode) {
        const node = await this.commitNew(path, _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG, mode, new Uint8Array(), 'createFile');
        return new _file_js__WEBPACK_IMPORTED_MODULE_4__.PreloadFile(this, path, flag, node.toStats(), new Uint8Array());
    }
    createFileSync(path, flag, mode) {
        const node = this.commitNewSync(path, _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG, mode, new Uint8Array(), 'createFile');
        return new _file_js__WEBPACK_IMPORTED_MODULE_4__.PreloadFile(this, path, flag, node.toStats(), new Uint8Array());
    }
    async openFile(path, flag) {
        const env_5 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_5, this.store.transaction(), true);
            const node = await this.findInode(tx, path, 'openFile');
            const data = await this.get(tx, node.data, path, 'openFile');
            return new _file_js__WEBPACK_IMPORTED_MODULE_4__.PreloadFile(this, path, flag, node.toStats(), data);
        }
        catch (e_5) {
            env_5.error = e_5;
            env_5.hasError = true;
        }
        finally {
            const result_3 = __disposeResources(env_5);
            if (result_3)
                await result_3;
        }
    }
    openFileSync(path, flag) {
        const env_6 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_6, this.store.transaction(), false);
            const node = this.findInodeSync(tx, path, 'openFile');
            const data = this.getSync(tx, node.data, path, 'openFile');
            return new _file_js__WEBPACK_IMPORTED_MODULE_4__.PreloadFile(this, path, flag, node.toStats(), data);
        }
        catch (e_6) {
            env_6.error = e_6;
            env_6.hasError = true;
        }
        finally {
            __disposeResources(env_6);
        }
    }
    async unlink(path) {
        return this.remove(path, false, 'unlink');
    }
    unlinkSync(path) {
        this.removeSync(path, false, 'unlink');
    }
    async rmdir(path) {
        if ((await this.readdir(path)).length) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTEMPTY', path, 'rmdir');
        }
        await this.remove(path, true, 'rmdir');
    }
    rmdirSync(path) {
        if (this.readdirSync(path).length) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTEMPTY', path, 'rmdir');
        }
        this.removeSync(path, true, 'rmdir');
    }
    async mkdir(path, mode) {
        await this.commitNew(path, _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR, mode, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeUTF8)('{}'), 'mkdir');
    }
    mkdirSync(path, mode) {
        this.commitNewSync(path, _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR, mode, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeUTF8)('{}'), 'mkdir');
    }
    async readdir(path) {
        const env_7 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_7, this.store.transaction(), true);
            const node = await this.findInode(tx, path, 'readdir');
            return Object.keys((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, node.data, path, 'readdir')));
        }
        catch (e_7) {
            env_7.error = e_7;
            env_7.hasError = true;
        }
        finally {
            const result_4 = __disposeResources(env_7);
            if (result_4)
                await result_4;
        }
    }
    readdirSync(path) {
        const env_8 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_8, this.store.transaction(), false);
            const node = this.findInodeSync(tx, path, 'readdir');
            return Object.keys((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, node.data, path, 'readdir')));
        }
        catch (e_8) {
            env_8.error = e_8;
            env_8.hasError = true;
        }
        finally {
            __disposeResources(env_8);
        }
    }
    /**
     * Updated the inode and data node at `path`
     * @todo Ensure mtime updates properly, and use that to determine if a data update is required.
     */
    async sync(path, data, stats) {
        const env_9 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_9, this.store.transaction(), true);
            // We use _findInode because we actually need the INode id.
            const fileInodeId = await this._findInode(tx, path, 'sync'), fileInode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, fileInodeId, path, 'sync')), inodeChanged = fileInode.update(stats);
            // Sync data.
            await tx.set(fileInode.data, data);
            // Sync metadata.
            if (inodeChanged) {
                await tx.set(fileInodeId, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(fileInode));
            }
            await tx.commit();
        }
        catch (e_9) {
            env_9.error = e_9;
            env_9.hasError = true;
        }
        finally {
            const result_5 = __disposeResources(env_9);
            if (result_5)
                await result_5;
        }
    }
    /**
     * Updated the inode and data node at `path`
     * @todo Ensure mtime updates properly, and use that to determine if a data update is required.
     */
    syncSync(path, data, stats) {
        const env_10 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_10, this.store.transaction(), false);
            // We use _findInode because we actually need the INode id.
            const fileInodeId = this._findInodeSync(tx, path, 'sync'), fileInode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, fileInodeId, path, 'sync')), inodeChanged = fileInode.update(stats);
            // Sync data.
            tx.setSync(fileInode.data, data);
            // Sync metadata.
            if (inodeChanged) {
                tx.setSync(fileInodeId, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(fileInode));
            }
            tx.commitSync();
        }
        catch (e_10) {
            env_10.error = e_10;
            env_10.hasError = true;
        }
        finally {
            __disposeResources(env_10);
        }
    }
    async link(target, link) {
        const env_11 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_11, this.store.transaction(), true);
            const newDir = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(link), newDirNode = await this.findInode(tx, newDir, 'link'), listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, newDirNode.data, newDir, 'link'));
            const ino = await this._findInode(tx, target, 'link');
            const node = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, ino, target, 'link'));
            node.nlink++;
            listing[(0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(link)] = ino;
            tx.setSync(ino, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(node));
            tx.setSync(newDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            tx.commitSync();
        }
        catch (e_11) {
            env_11.error = e_11;
            env_11.hasError = true;
        }
        finally {
            const result_6 = __disposeResources(env_11);
            if (result_6)
                await result_6;
        }
    }
    linkSync(target, link) {
        const env_12 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_12, this.store.transaction(), false);
            const newDir = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(link), newDirNode = this.findInodeSync(tx, newDir, 'link'), listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, newDirNode.data, newDir, 'link'));
            const ino = this._findInodeSync(tx, target, 'link');
            const node = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, ino, target, 'link'));
            node.nlink++;
            listing[(0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(link)] = ino;
            tx.setSync(ino, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(node));
            tx.setSync(newDirNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            tx.commitSync();
        }
        catch (e_12) {
            env_12.error = e_12;
            env_12.hasError = true;
        }
        finally {
            __disposeResources(env_12);
        }
    }
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    async checkRoot() {
        const env_13 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_13, this.store.transaction(), true);
            if (await tx.get(_inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno)) {
                return;
            }
            // Create new inode. o777, owned by root:root
            const inode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode();
            inode.ino = _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno;
            inode.mode = 0o777 | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR;
            // If the root doesn't exist, the first random ID shouldn't exist either.
            await tx.set(inode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeUTF8)('{}'));
            await tx.set(_inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(inode));
            await tx.commit();
        }
        catch (e_13) {
            env_13.error = e_13;
            env_13.hasError = true;
        }
        finally {
            const result_7 = __disposeResources(env_13);
            if (result_7)
                await result_7;
        }
    }
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    checkRootSync() {
        const env_14 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_14, this.store.transaction(), false);
            if (tx.getSync(_inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno)) {
                return;
            }
            // Create new inode, mode o777, owned by root:root
            const inode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode();
            inode.ino = _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno;
            inode.mode = 0o777 | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR;
            // If the root doesn't exist, the first random ID shouldn't exist either.
            tx.setSync(inode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeUTF8)('{}'));
            tx.setSync(_inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(inode));
            tx.commitSync();
        }
        catch (e_14) {
            env_14.error = e_14;
            env_14.hasError = true;
        }
        finally {
            __disposeResources(env_14);
        }
    }
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     */
    async _findInode(tx, path, syscall, visited = new Set()) {
        if (visited.has(path)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EIO, 'Infinite loop detected while finding inode', path);
        }
        visited.add(path);
        if (path == '/') {
            return _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno;
        }
        const { dir: parent, base: filename } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path);
        const inode = parent == '/' ? new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno, parent, syscall)) : await this.findInode(tx, parent, syscall, visited);
        const dirList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, inode.data, parent, syscall));
        if (!(filename in dirList)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.resolve)(parent, filename), syscall);
        }
        return dirList[filename];
    }
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @return string The ID of the file's inode in the file system.
     */
    _findInodeSync(tx, path, syscall, visited = new Set()) {
        if (visited.has(path)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EIO, 'Infinite loop detected while finding inode', path);
        }
        visited.add(path);
        if (path == '/') {
            return _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno;
        }
        const { dir: parent, base: filename } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path);
        const inode = parent == '/' ? new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, _inode_js__WEBPACK_IMPORTED_MODULE_6__.rootIno, parent, syscall)) : this.findInodeSync(tx, parent, syscall, visited);
        const dir = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, inode.data, parent, syscall));
        if (!(filename in dir)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.resolve)(parent, filename), syscall);
        }
        return dir[filename];
    }
    /**
     * Finds the Inode of `path`.
     * @param path The path to look up.
     * @todo memoize/cache
     */
    async findInode(tx, path, syscall, visited = new Set()) {
        const ino = await this._findInode(tx, path, syscall, visited);
        return new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, ino, path, syscall));
    }
    /**
     * Finds the Inode of `path`.
     * @param path The path to look up.
     * @return The Inode of the path p.
     * @todo memoize/cache
     */
    findInodeSync(tx, path, syscall, visited = new Set()) {
        const ino = this._findInodeSync(tx, path, syscall, visited);
        return new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, ino, path, syscall));
    }
    /**
     * Given an ID, retrieves the corresponding data.
     * @param tx The transaction to use.
     * @param path The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    async get(tx, id, path, syscall) {
        const data = await tx.get(id);
        if (!data) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', path, syscall);
        }
        return data;
    }
    /**
     * Given an ID, retrieves the corresponding data.
     * @param tx The transaction to use.
     * @param path The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    getSync(tx, id, path, syscall) {
        const data = tx.getSync(id);
        if (!data) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', path, syscall);
        }
        return data;
    }
    /**
     * Adds a new node under a random ID. Retries before giving up in
     * the exceedingly unlikely chance that we try to reuse a random id.
     */
    async allocNew(tx, path, syscall) {
        for (let i = 0; i < maxInodeAllocTries; i++) {
            const ino = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.randomBigInt)();
            if (await tx.get(ino)) {
                continue;
            }
            return ino;
        }
        throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.ENOSPC, 'No IDs available', path, syscall);
    }
    /**
     * Creates a new node under a random ID. Retries before giving up in
     * the exceedingly unlikely chance that we try to reuse a random id.
     * @return The ino that the data was stored under.
     */
    allocNewSync(tx, path, syscall) {
        for (let i = 0; i < maxInodeAllocTries; i++) {
            const ino = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.randomBigInt)();
            if (tx.getSync(ino)) {
                continue;
            }
            return ino;
        }
        throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.ENOSPC, 'No IDs available', path, syscall);
    }
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with `mode`.
     * Note: This will commit the transaction.
     * @param path The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     */
    async commitNew(path, type, mode, data, syscall) {
        const env_15 = { stack: [], error: void 0, hasError: false };
        try {
            /*
                The root always exists.
                If we don't check this prior to taking steps below,
                we will create a file with name '' in root if path is '/'.
            */
            if (path == '/') {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, syscall);
            }
            const tx = __addDisposableResource(env_15, this.store.transaction(), true);
            const { dir: parentPath, base: fname } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path);
            const parent = await this.findInode(tx, parentPath, syscall);
            const listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, parent.data, parentPath, syscall));
            // Check if file already exists.
            if (listing[fname]) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, syscall);
            }
            // Commit data.
            const inode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode();
            inode.ino = await this.allocNew(tx, path, syscall);
            inode.data = await this.allocNew(tx, path, syscall);
            inode.mode = mode | type;
            inode.uid = parent.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_ISUID ? parent.uid : _credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.uid;
            inode.gid = parent.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_ISGID ? parent.gid : _credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.gid;
            inode.size = data.length;
            await tx.set(inode.ino, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(inode));
            await tx.set(inode.data, data);
            // Update and commit parent directory listing.
            listing[fname] = inode.ino;
            await tx.set(parent.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            await tx.commit();
            return inode;
        }
        catch (e_15) {
            env_15.error = e_15;
            env_15.hasError = true;
        }
        finally {
            const result_8 = __disposeResources(env_15);
            if (result_8)
                await result_8;
        }
    }
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with `mode`.
     * Note: This will commit the transaction.
     * @param path The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     * @return The Inode for the new file.
     */
    commitNewSync(path, type, mode, data, syscall) {
        const env_16 = { stack: [], error: void 0, hasError: false };
        try {
            /*
                The root always exists.
                If we don't check this prior to taking steps below,
                we will create a file with name '' in root if path is '/'.
            */
            if (path == '/') {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, syscall);
            }
            const tx = __addDisposableResource(env_16, this.store.transaction(), false);
            const { dir: parentPath, base: fname } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path);
            const parent = this.findInodeSync(tx, parentPath, syscall);
            const listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, parent.data, parentPath, syscall));
            // Check if file already exists.
            if (listing[fname]) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, syscall);
            }
            // Commit data.
            const inode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode();
            inode.ino = this.allocNewSync(tx, path, syscall);
            inode.data = this.allocNewSync(tx, path, syscall);
            inode.size = data.length;
            inode.mode = mode | type;
            inode.uid = parent.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_ISUID ? parent.uid : _credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.uid;
            inode.gid = parent.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_ISGID ? parent.gid : _credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.gid;
            // Update and commit parent directory listing.
            tx.setSync(inode.ino, (0,utilium__WEBPACK_IMPORTED_MODULE_8__.serialize)(inode));
            tx.setSync(inode.data, data);
            listing[fname] = inode.ino;
            tx.setSync(parent.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            tx.commitSync();
            return inode;
        }
        catch (e_16) {
            env_16.error = e_16;
            env_16.hasError = true;
        }
        finally {
            __disposeResources(env_16);
        }
    }
    /**
     * Remove all traces of `path` from the file system.
     * @param path The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    async remove(path, isDir, syscall) {
        const env_17 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_17, this.store.transaction(), true);
            const { dir: parent, base: fileName } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path), parentNode = await this.findInode(tx, parent, syscall), listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(await this.get(tx, parentNode.data, parent, syscall));
            if (!listing[fileName]) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', path, 'remove');
            }
            const fileIno = listing[fileName];
            // Get file inode.
            const fileNode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(await this.get(tx, fileIno, path, syscall));
            // Remove from directory listing of parent.
            delete listing[fileName];
            if (!isDir && fileNode.toStats().isDirectory()) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EISDIR', path, 'remove');
            }
            await tx.set(parentNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            if (--fileNode.nlink < 1) {
                // remove file
                await tx.remove(fileNode.data);
                await tx.remove(fileIno);
            }
            // Success.
            await tx.commit();
        }
        catch (e_17) {
            env_17.error = e_17;
            env_17.hasError = true;
        }
        finally {
            const result_9 = __disposeResources(env_17);
            if (result_9)
                await result_9;
        }
    }
    /**
     * Remove all traces of `path` from the file system.
     * @param path The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    removeSync(path, isDir, syscall) {
        const env_18 = { stack: [], error: void 0, hasError: false };
        try {
            const tx = __addDisposableResource(env_18, this.store.transaction(), false);
            const { dir: parent, base: fileName } = (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.parse)(path), parentNode = this.findInodeSync(tx, parent, syscall), listing = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.decodeDirListing)(this.getSync(tx, parentNode.data, parent, syscall)), fileIno = listing[fileName];
            if (!fileIno) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOENT', path, 'remove');
            }
            // Get file inode.
            const fileNode = new _inode_js__WEBPACK_IMPORTED_MODULE_6__.Inode(this.getSync(tx, fileIno, path, syscall));
            // Remove from directory listing of parent.
            delete listing[fileName];
            if (!isDir && fileNode.toStats().isDirectory()) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EISDIR', path, 'remove');
            }
            // Update directory listing.
            tx.setSync(parentNode.data, (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.encodeDirListing)(listing));
            if (--fileNode.nlink < 1) {
                // remove file
                tx.removeSync(fileNode.data);
                tx.removeSync(fileIno);
            }
            // Success.
            tx.commitSync();
        }
        catch (e_18) {
            env_18.error = e_18;
            env_18.hasError = true;
        }
        finally {
            __disposeResources(env_18);
        }
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/store/simple.js":
/*!********************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/store/simple.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimpleAsyncStore: () => (/* binding */ SimpleAsyncStore),
/* harmony export */   SimpleTransaction: () => (/* binding */ SimpleTransaction)
/* harmony export */ });
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store.js */ "./src/node_modules/@zenfs/core/dist/backends/store/store.js");

/**
 * An interface for simple asynchronous stores that don't have special support for transactions and such.
 * This class adds caching at the store level.
 */
class SimpleAsyncStore {
    constructor() {
        this.cache = new Map();
        this.queue = new Set();
    }
    keys() {
        return this.cache.keys();
    }
    get(id) {
        return this.cache.get(id);
    }
    set(id, data) {
        this.cache.set(id, data);
        this.queue.add(this._set(id, data));
    }
    delete(id) {
        this.cache.delete(id);
        this.queue.add(this._delete(id));
    }
    clearSync() {
        this.cache.clear();
        this.queue.add(this.clear());
    }
    async sync() {
        for (const [ino, data] of await this.entries()) {
            if (!this.cache.has(ino)) {
                this.cache.set(ino, data);
            }
        }
        for (const promise of this.queue) {
            await promise;
        }
    }
    transaction() {
        return new SimpleTransaction(this);
    }
}
/**
 * Transaction for simple stores.
 * @see SimpleSyncStore
 * @see SimpleAsyncStore
 */
class SimpleTransaction extends _store_js__WEBPACK_IMPORTED_MODULE_0__.SyncTransaction {
    constructor() {
        super(...arguments);
        /**
         * Stores data in the keys we modify prior to modifying them.
         * Allows us to roll back commits.
         */
        this.originalData = new Map();
        /**
         * List of keys modified in this transaction, if any.
         */
        this.modifiedKeys = new Set();
    }
    keysSync() {
        return this.store.keys();
    }
    getSync(id) {
        const val = this.store.get(id);
        this.stashOldValue(id, val);
        return val;
    }
    setSync(id, data) {
        this.markModified(id);
        return this.store.set(id, data);
    }
    removeSync(id) {
        this.markModified(id);
        this.store.delete(id);
    }
    commitSync() {
        this.done = true;
    }
    abortSync() {
        if (!this.done) {
            return;
        }
        // Rollback old values.
        for (const key of this.modifiedKeys) {
            const value = this.originalData.get(key);
            if (!value) {
                // Key didn't exist.
                this.store.delete(key);
            }
            else {
                // Key existed. Store old value.
                this.store.set(key, value);
            }
        }
        this.done = true;
    }
    /**
     * Stashes given key value pair into `originalData` if it doesn't already
     * exist. Allows us to stash values the program is requesting anyway to
     * prevent needless `get` requests if the program modifies the data later
     * on during the transaction.
     */
    stashOldValue(id, value) {
        // Keep only the earliest value in the transaction.
        if (!this.originalData.has(id)) {
            this.originalData.set(id, value);
        }
    }
    /**
     * Marks `ino` as modified, and stashes its value if it has not been
     * stashed already.
     */
    markModified(id) {
        this.modifiedKeys.add(id);
        if (!this.originalData.has(id)) {
            this.originalData.set(id, this.store.get(id));
        }
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/backends/store/store.js":
/*!*******************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/backends/store/store.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncTransaction: () => (/* binding */ AsyncTransaction),
/* harmony export */   SyncTransaction: () => (/* binding */ SyncTransaction),
/* harmony export */   Transaction: () => (/* binding */ Transaction)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../polyfills.js */ "./src/node_modules/@zenfs/core/dist/polyfills.js");


/**
 * A transaction for a store.
 */
class Transaction {
    constructor(store) {
        this.store = store;
        /**
         * Whether the transaction was committed or aborted
         */
        this.done = false;
    }
    async [Symbol.asyncDispose]() {
        if (this.done) {
            return;
        }
        await this.abort();
    }
    [Symbol.dispose]() {
        if (this.done) {
            return;
        }
        this.abortSync();
    }
}
/**
 * Transaction that implements asynchronous operations with synchronous ones
 */
class SyncTransaction extends Transaction {
    /* eslint-disable @typescript-eslint/require-await */
    async keys() {
        return this.keysSync();
    }
    async get(id) {
        return this.getSync(id);
    }
    async set(id, data) {
        return this.setSync(id, data);
    }
    async remove(id) {
        return this.removeSync(id);
    }
    async commit() {
        return this.commitSync();
    }
    async abort() {
        return this.abortSync();
    }
}
/**
 * Transaction that only supports asynchronous operations
 */
class AsyncTransaction extends Transaction {
    keysSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.keysSync');
    }
    getSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.getSync');
    }
    setSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.setSync');
    }
    removeSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.removeSync');
    }
    commitSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.commitSync');
    }
    abortSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'AsyncTransaction.abortSync');
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/config.js":
/*!*****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/config.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configure: () => (/* binding */ configure),
/* harmony export */   configureSingle: () => (/* binding */ configureSingle),
/* harmony export */   resolveMountConfig: () => (/* binding */ resolveMountConfig)
/* harmony export */ });
/* harmony import */ var _backends_backend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./backends/backend.js */ "./src/node_modules/@zenfs/core/dist/backends/backend.js");
/* harmony import */ var _credentials_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./credentials.js */ "./src/node_modules/@zenfs/core/dist/credentials.js");
/* harmony import */ var _devices_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./devices.js */ "./src/node_modules/@zenfs/core/dist/devices.js");
/* harmony import */ var _emulation_cache_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./emulation/cache.js */ "./src/node_modules/@zenfs/core/dist/emulation/cache.js");
/* harmony import */ var _emulation_config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./emulation/config.js */ "./src/node_modules/@zenfs/core/dist/emulation/config.js");
/* harmony import */ var _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./emulation/index.js */ "./src/node_modules/@zenfs/core/dist/emulation/index.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");








function isMountConfig(arg) {
    return (0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.isBackendConfig)(arg) || (0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.isBackend)(arg) || arg instanceof _filesystem_js__WEBPACK_IMPORTED_MODULE_7__.FileSystem;
}
/**
 * Retrieve a file system with `configuration`.
 * @see MountConfiguration
 */
async function resolveMountConfig(configuration, _depth = 0) {
    if (typeof configuration !== 'object' || configuration == null) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_6__.Errno.EINVAL, 'Invalid options on mount configuration');
    }
    if (!isMountConfig(configuration)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_6__.Errno.EINVAL, 'Invalid mount configuration');
    }
    if (configuration instanceof _filesystem_js__WEBPACK_IMPORTED_MODULE_7__.FileSystem) {
        await configuration.ready();
        return configuration;
    }
    if ((0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.isBackend)(configuration)) {
        configuration = { backend: configuration };
    }
    for (const [key, value] of Object.entries(configuration)) {
        if (key == 'backend') {
            continue;
        }
        if (!isMountConfig(value)) {
            continue;
        }
        if (_depth > 10) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_6__.Errno.EINVAL, 'Invalid configuration, too deep and possibly infinite');
        }
        configuration[key] = await resolveMountConfig(value, ++_depth);
    }
    const { backend } = configuration;
    if (!(await backend.isAvailable())) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_6__.Errno.EPERM, 'Backend not available: ' + backend.name);
    }
    await (0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.checkOptions)(backend, configuration);
    const mount = (await backend.create(configuration));
    mount._disableSync = configuration.disableAsyncCache || false;
    await mount.ready();
    return mount;
}
/**
 * Configures ZenFS with single mount point /
 */
async function configureSingle(configuration) {
    if (!(0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.isBackendConfig)(configuration)) {
        throw new TypeError('Invalid single mount point configuration');
    }
    const resolved = await resolveMountConfig(configuration);
    _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.umount('/');
    _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.mount('/', resolved);
}
/**
 * Like `fs.mount`, but it also creates missing directories.
 * @privateRemarks
 * This is implemented as a separate function to avoid a circular dependency between emulation/shared.ts and other emulation layer files.
 * @internal
 */
async function mount(path, mount) {
    if (path == '/') {
        _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.mount(path, mount);
        return;
    }
    const stats = await _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.promises.stat(path).catch(() => null);
    if (!stats) {
        await _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.promises.mkdir(path, { recursive: true });
    }
    else if (!stats.isDirectory()) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError.With('ENOTDIR', path, 'configure');
    }
    _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.mount(path, mount);
}
/**
 * Configures ZenFS with `configuration`
 * @see Configuration
 */
async function configure(configuration) {
    const uid = 'uid' in configuration ? configuration.uid || 0 : 0;
    const gid = 'gid' in configuration ? configuration.gid || 0 : 0;
    Object.assign(_credentials_js__WEBPACK_IMPORTED_MODULE_1__.credentials, { uid, gid, suid: uid, sgid: gid, euid: uid, egid: gid });
    _emulation_cache_js__WEBPACK_IMPORTED_MODULE_3__.stats.isEnabled = configuration.cacheStats ?? false;
    _emulation_cache_js__WEBPACK_IMPORTED_MODULE_3__.paths.isEnabled = configuration.cachePaths ?? false;
    _emulation_config_js__WEBPACK_IMPORTED_MODULE_4__.config.checkAccess = !configuration.disableAccessChecks;
    _emulation_config_js__WEBPACK_IMPORTED_MODULE_4__.config.updateOnRead = !configuration.disableUpdateOnRead;
    _emulation_config_js__WEBPACK_IMPORTED_MODULE_4__.config.syncImmediately = !configuration.onlySyncOnClose;
    if (configuration.mounts) {
        const toMount = [];
        let unmountRoot = false;
        for (const [point, mountConfig] of Object.entries(configuration.mounts)) {
            if (!point.startsWith('/')) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_6__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_6__.Errno.EINVAL, 'Mount points must have absolute paths');
            }
            if ((0,_backends_backend_js__WEBPACK_IMPORTED_MODULE_0__.isBackendConfig)(mountConfig)) {
                mountConfig.disableAsyncCache ?? (mountConfig.disableAsyncCache = configuration.disableAsyncCache || false);
            }
            if (point == '/')
                unmountRoot = true;
            toMount.push([point, await resolveMountConfig(mountConfig)]);
        }
        if (unmountRoot)
            _emulation_index_js__WEBPACK_IMPORTED_MODULE_5__.umount('/');
        await Promise.all(toMount.map(([point, fs]) => mount(point, fs)));
    }
    if (configuration.addDevices) {
        const devfs = new _devices_js__WEBPACK_IMPORTED_MODULE_2__.DeviceFS();
        devfs.addDefaults();
        await devfs.ready();
        await mount('/dev', devfs);
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/credentials.js":
/*!**********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/credentials.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   credentials: () => (/* binding */ credentials),
/* harmony export */   rootCredentials: () => (/* binding */ rootCredentials)
/* harmony export */ });
const credentials = {
    uid: 0,
    gid: 0,
    suid: 0,
    sgid: 0,
    euid: 0,
    egid: 0,
};
/**
 * @deprecated
 */
const rootCredentials = {
    uid: 0,
    gid: 0,
    suid: 0,
    sgid: 0,
    euid: 0,
    egid: 0,
};


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/devices.js":
/*!******************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/devices.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeviceFS: () => (/* binding */ DeviceFS),
/* harmony export */   DeviceFile: () => (/* binding */ DeviceFile),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fullDevice: () => (/* binding */ fullDevice),
/* harmony export */   nullDevice: () => (/* binding */ nullDevice),
/* harmony export */   randomDevice: () => (/* binding */ randomDevice),
/* harmony export */   zeroDevice: () => (/* binding */ zeroDevice)
/* harmony export */ });
/* harmony import */ var _backends_memory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./backends/memory.js */ "./src/node_modules/@zenfs/core/dist/backends/memory.js");
/* harmony import */ var _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./backends/store/fs.js */ "./src/node_modules/@zenfs/core/dist/backends/store/fs.js");
/* harmony import */ var _emulation_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./emulation/constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/*
This is a great resource: https://www.kernel.org/doc/html/latest/admin-guide/devices.html
*/
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});







/**
 * The base class for device files
 * This class only does some simple things:
 * It implements `truncate` using `write` and it has non-device methods throw.
 * It is up to device drivers to implement the rest of the functionality.
 */
class DeviceFile extends _file_js__WEBPACK_IMPORTED_MODULE_4__.File {
    constructor(fs, path, device) {
        super(fs, path);
        this.fs = fs;
        this.device = device;
        this.position = 0;
    }
    get driver() {
        return this.device.driver;
    }
    get stats() {
        return { mode: (this.driver.isBuffered ? _emulation_constants_js__WEBPACK_IMPORTED_MODULE_2__.S_IFBLK : _emulation_constants_js__WEBPACK_IMPORTED_MODULE_2__.S_IFCHR) | 0o666 };
    }
    async stat() {
        return Promise.resolve(new _stats_js__WEBPACK_IMPORTED_MODULE_5__.Stats(this.stats));
    }
    statSync() {
        return new _stats_js__WEBPACK_IMPORTED_MODULE_5__.Stats(this.stats);
    }
    readSync(buffer, offset, length, position) {
        return this.driver.read(this, buffer, offset, length, position);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async read(buffer, offset, length) {
        return { bytesRead: this.readSync(buffer, offset, length), buffer };
    }
    writeSync(buffer, offset = 0, length = buffer.length, position) {
        return this.driver.write(this, buffer, offset, length, position);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async write(buffer, offset, length, position) {
        return this.writeSync(buffer, offset, length, position);
    }
    async truncate(length) {
        const { size } = await this.stat();
        const buffer = new Uint8Array(length > size ? length - size : 0);
        await this.write(buffer, 0, buffer.length, length > size ? size : length);
    }
    truncateSync(length) {
        const { size } = this.statSync();
        const buffer = new Uint8Array(length > size ? length - size : 0);
        this.writeSync(buffer, 0, buffer.length, length > size ? size : length);
    }
    closeSync() {
        this.driver.close?.(this);
    }
    close() {
        this.closeSync();
        return Promise.resolve();
    }
    syncSync() {
        this.driver.sync?.(this);
    }
    sync() {
        this.syncSync();
        return Promise.resolve();
    }
    chown() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'chown');
    }
    chownSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'chown');
    }
    chmod() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'chmod');
    }
    chmodSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'chmod');
    }
    utimes() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'utimes');
    }
    utimesSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, 'utimes');
    }
    _setType() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, '_setType');
    }
    _setTypeSync() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOTSUP', this.path, '_setType');
    }
}
/**
 * A temporary file system that manages and interfaces with devices
 */
class DeviceFS extends _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_1__.StoreFS {
    /**
     * Creates a new device at `path` relative to the `DeviceFS` root.
     */
    createDevice(path, driver) {
        if (this.existsSync(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, 'mknod');
        }
        let ino = 1n;
        while (this.store.has(ino))
            ino++;
        const dev = {
            driver,
            ino,
            data: {},
            minor: 0,
            major: 0,
            ...driver.init?.(ino),
        };
        this.devices.set(path, dev);
        return dev;
    }
    /**
     * Adds default devices
     */
    addDefaults() {
        this.createDevice('/null', nullDevice);
        this.createDevice('/zero', zeroDevice);
        this.createDevice('/full', fullDevice);
        this.createDevice('/random', randomDevice);
    }
    constructor() {
        super(new _backends_memory_js__WEBPACK_IMPORTED_MODULE_0__.InMemoryStore('devfs'));
        this.devices = new Map();
    }
    async rename(oldPath, newPath) {
        if (this.devices.has(oldPath)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', oldPath, 'rename');
        }
        if (this.devices.has(newPath)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', newPath, 'rename');
        }
        return super.rename(oldPath, newPath);
    }
    renameSync(oldPath, newPath) {
        if (this.devices.has(oldPath)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', oldPath, 'rename');
        }
        if (this.devices.has(newPath)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', newPath, 'rename');
        }
        return super.renameSync(oldPath, newPath);
    }
    async stat(path) {
        if (this.devices.has(path)) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const file = __addDisposableResource(env_1, await this.openFile(path, 'r'), true);
                return file.stat();
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                const result_1 = __disposeResources(env_1);
                if (result_1)
                    await result_1;
            }
        }
        return super.stat(path);
    }
    statSync(path) {
        if (this.devices.has(path)) {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const file = __addDisposableResource(env_2, this.openFileSync(path, 'r'), false);
                return file.statSync();
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                __disposeResources(env_2);
            }
        }
        return super.statSync(path);
    }
    async openFile(path, flag) {
        if (this.devices.has(path)) {
            return new DeviceFile(this, path, this.devices.get(path));
        }
        return await super.openFile(path, flag);
    }
    openFileSync(path, flag) {
        if (this.devices.has(path)) {
            return new DeviceFile(this, path, this.devices.get(path));
        }
        return super.openFileSync(path, flag);
    }
    async createFile(path, flag, mode) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, 'createFile');
        }
        return super.createFile(path, flag, mode);
    }
    createFileSync(path, flag, mode) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, 'createFile');
        }
        return super.createFileSync(path, flag, mode);
    }
    async unlink(path) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', path, 'unlink');
        }
        return super.unlink(path);
    }
    unlinkSync(path) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', path, 'unlink');
        }
        return super.unlinkSync(path);
    }
    async rmdir(path) {
        return super.rmdir(path);
    }
    rmdirSync(path) {
        return super.rmdirSync(path);
    }
    async mkdir(path, mode) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, 'mkdir');
        }
        return super.mkdir(path, mode);
    }
    mkdirSync(path, mode) {
        if (this.devices.has(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', path, 'mkdir');
        }
        return super.mkdirSync(path, mode);
    }
    async readdir(path) {
        const entries = await super.readdir(path);
        for (const dev of this.devices.keys()) {
            if ((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_6__.dirname)(dev) == path) {
                entries.push((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_6__.basename)(dev));
            }
        }
        return entries;
    }
    readdirSync(path) {
        const entries = super.readdirSync(path);
        for (const dev of this.devices.keys()) {
            if ((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_6__.dirname)(dev) == path) {
                entries.push((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_6__.basename)(dev));
            }
        }
        return entries;
    }
    async link(target, link) {
        if (this.devices.has(target)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', target, 'rmdir');
        }
        if (this.devices.has(link)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', link, 'link');
        }
        return super.link(target, link);
    }
    linkSync(target, link) {
        if (this.devices.has(target)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EPERM', target, 'rmdir');
        }
        if (this.devices.has(link)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('EEXIST', link, 'link');
        }
        return super.linkSync(target, link);
    }
    async sync(path, data, stats) {
        if (this.devices.has(path)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EINVAL, 'Attempted to sync a device incorrectly (bug)', path, 'sync');
        }
        return super.sync(path, data, stats);
    }
    syncSync(path, data, stats) {
        if (this.devices.has(path)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_3__.Errno.EINVAL, 'Attempted to sync a device incorrectly (bug)', path, 'sync');
        }
        return super.syncSync(path, data, stats);
    }
}
function defaultWrite(file, buffer, offset, length) {
    file.position += length;
    return length;
}
/**
 * Simulates the `/dev/null` device.
 * - Reads return 0 bytes (EOF).
 * - Writes discard data, advancing the file position.
 * @experimental
 */
const nullDevice = {
    name: 'null',
    init() {
        return { major: 1, minor: 3 };
    },
    read() {
        return 0;
    },
    write: defaultWrite,
};
/**
 * Simulates the `/dev/zero` device
 * Provides an infinite stream of zeroes when read.
 * Discards any data written to it.
 *
 * - Reads fill the buffer with zeroes.
 * - Writes discard data but update the file position.
 * - Provides basic file metadata, treating it as a character device.
 * @experimental
 */
const zeroDevice = {
    name: 'zero',
    init() {
        return { major: 1, minor: 5 };
    },
    read(file, buffer, offset = 0, length = buffer.byteLength) {
        const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        for (let i = offset; i < offset + length; i++) {
            data[i] = 0;
        }
        file.position += length;
        return length;
    },
    write: defaultWrite,
};
/**
 * Simulates the `/dev/full` device.
 * - Reads behave like `/dev/zero` (returns zeroes).
 * - Writes always fail with ENOSPC (no space left on device).
 * @experimental
 */
const fullDevice = {
    name: 'full',
    init() {
        return { major: 1, minor: 7 };
    },
    read(file, buffer, offset = 0, length = buffer.byteLength) {
        const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        for (let i = offset; i < offset + length; i++) {
            data[i] = 0;
        }
        file.position += length;
        return length;
    },
    write(file) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_3__.ErrnoError.With('ENOSPC', file.path, 'write');
    },
};
/**
 * Simulates the `/dev/random` device.
 * - Reads return random bytes.
 * - Writes discard data, advancing the file position.
 * @experimental
 */
const randomDevice = {
    name: 'random',
    init() {
        return { major: 1, minor: 8 };
    },
    read(file, buffer, offset = 0, length = buffer.byteLength) {
        const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        for (let i = offset; i < offset + length; i++) {
            data[i] = Math.floor(Math.random() * 256);
        }
        file.position += length;
        return length;
    },
    write: defaultWrite,
};
/**
 * Shortcuts for importing.
 * @experimental
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    null: nullDevice,
    zero: zeroDevice,
    full: fullDevice,
    random: randomDevice,
});


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/async.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/async.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   access: () => (/* binding */ access),
/* harmony export */   appendFile: () => (/* binding */ appendFile),
/* harmony export */   chmod: () => (/* binding */ chmod),
/* harmony export */   chown: () => (/* binding */ chown),
/* harmony export */   close: () => (/* binding */ close),
/* harmony export */   copyFile: () => (/* binding */ copyFile),
/* harmony export */   cp: () => (/* binding */ cp),
/* harmony export */   createReadStream: () => (/* binding */ createReadStream),
/* harmony export */   createWriteStream: () => (/* binding */ createWriteStream),
/* harmony export */   exists: () => (/* binding */ exists),
/* harmony export */   fchmod: () => (/* binding */ fchmod),
/* harmony export */   fchown: () => (/* binding */ fchown),
/* harmony export */   fdatasync: () => (/* binding */ fdatasync),
/* harmony export */   fstat: () => (/* binding */ fstat),
/* harmony export */   fsync: () => (/* binding */ fsync),
/* harmony export */   ftruncate: () => (/* binding */ ftruncate),
/* harmony export */   futimes: () => (/* binding */ futimes),
/* harmony export */   lchmod: () => (/* binding */ lchmod),
/* harmony export */   lchown: () => (/* binding */ lchown),
/* harmony export */   link: () => (/* binding */ link),
/* harmony export */   lstat: () => (/* binding */ lstat),
/* harmony export */   lutimes: () => (/* binding */ lutimes),
/* harmony export */   mkdir: () => (/* binding */ mkdir),
/* harmony export */   mkdtemp: () => (/* binding */ mkdtemp),
/* harmony export */   open: () => (/* binding */ open),
/* harmony export */   openAsBlob: () => (/* binding */ openAsBlob),
/* harmony export */   opendir: () => (/* binding */ opendir),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   readFile: () => (/* binding */ readFile),
/* harmony export */   readdir: () => (/* binding */ readdir),
/* harmony export */   readlink: () => (/* binding */ readlink),
/* harmony export */   readv: () => (/* binding */ readv),
/* harmony export */   realpath: () => (/* binding */ realpath),
/* harmony export */   rename: () => (/* binding */ rename),
/* harmony export */   rm: () => (/* binding */ rm),
/* harmony export */   rmdir: () => (/* binding */ rmdir),
/* harmony export */   stat: () => (/* binding */ stat),
/* harmony export */   statfs: () => (/* binding */ statfs),
/* harmony export */   symlink: () => (/* binding */ symlink),
/* harmony export */   truncate: () => (/* binding */ truncate),
/* harmony export */   unlink: () => (/* binding */ unlink),
/* harmony export */   unwatchFile: () => (/* binding */ unwatchFile),
/* harmony export */   utimes: () => (/* binding */ utimes),
/* harmony export */   watch: () => (/* binding */ watch),
/* harmony export */   watchFile: () => (/* binding */ watchFile),
/* harmony export */   write: () => (/* binding */ write),
/* harmony export */   writeFile: () => (/* binding */ writeFile),
/* harmony export */   writev: () => (/* binding */ writev)
/* harmony export */ });
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _promises_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./promises.js */ "./src/node_modules/@zenfs/core/dist/emulation/promises.js");
/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared.js */ "./src/node_modules/@zenfs/core/dist/emulation/shared.js");
/* harmony import */ var _streams_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./streams.js */ "./src/node_modules/@zenfs/core/dist/emulation/streams.js");
/* harmony import */ var _watchers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./watchers.js */ "./src/node_modules/@zenfs/core/dist/emulation/watchers.js");









const nop = () => { };
/**
 * Asynchronous rename. No arguments other than a possible exception are given to the completion callback.
 */
function rename(oldPath, newPath, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.rename(oldPath, newPath)
        .then(() => cb())
        .catch(cb);
}
rename;
/**
 * Test whether or not `path` exists by checking with the file system.
 * Then call the callback argument with either true or false.
 * @deprecated Use {@link stat} or {@link access} instead.
 */
function exists(path, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.exists(path)
        .then(cb)
        .catch(() => cb(false));
}
exists;
function stat(path, options, callback = nop) {
    callback = typeof options == 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.stat(path, typeof options != 'function' ? options : {})
        .then(stats => callback(undefined, stats))
        .catch(callback);
}
stat;
function lstat(path, options, callback = nop) {
    callback = typeof options == 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.lstat(path, typeof options != 'function' ? options : {})
        .then(stats => callback(undefined, stats))
        .catch(callback);
}
lstat;
function truncate(path, cbLen = 0, cb = nop) {
    cb = typeof cbLen === 'function' ? cbLen : cb;
    const len = typeof cbLen === 'number' ? cbLen : 0;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.truncate(path, len)
        .then(() => cb())
        .catch(cb);
}
truncate;
function unlink(path, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.unlink(path)
        .then(() => cb())
        .catch(cb);
}
unlink;
function open(path, flag, cbMode, cb = nop) {
    const mode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizeMode)(cbMode, 0o644);
    cb = typeof cbMode === 'function' ? cbMode : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.open(path, flag, mode)
        .then(handle => cb(undefined, handle.fd))
        .catch(cb);
}
open;
function readFile(filename, options, cb = nop) {
    cb = typeof options === 'function' ? options : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.readFile(filename, typeof options === 'function' ? null : options)
        .then(data => cb(undefined, data))
        .catch(cb);
}
readFile;
function writeFile(filename, data, cbEncOpts, cb = nop) {
    cb = typeof cbEncOpts === 'function' ? cbEncOpts : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.writeFile(filename, data, typeof cbEncOpts != 'function' ? cbEncOpts : null)
        .then(() => cb(undefined))
        .catch(cb);
}
writeFile;
function appendFile(filename, data, cbEncOpts, cb = nop) {
    const optionsOrEncoding = typeof cbEncOpts != 'function' ? cbEncOpts : undefined;
    cb = typeof cbEncOpts === 'function' ? cbEncOpts : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.appendFile(filename, data, optionsOrEncoding)
        .then(() => cb())
        .catch(cb);
}
appendFile;
function fstat(fd, options, cb = nop) {
    cb = typeof options == 'function' ? options : cb;
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_6__.fd2file)(fd)
        .stat()
        .then(stats => cb(undefined, typeof options == 'object' && options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_2__.BigIntStats(stats) : stats))
        .catch(cb);
}
fstat;
function close(fd, cb = nop) {
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .close()
        .then(() => cb())
        .catch(cb);
}
close;
function ftruncate(fd, lenOrCB, cb = nop) {
    const length = typeof lenOrCB === 'number' ? lenOrCB : 0;
    cb = typeof lenOrCB === 'function' ? lenOrCB : cb;
    const file = (0,_shared_js__WEBPACK_IMPORTED_MODULE_6__.fd2file)(fd);
    if (length < 0) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL);
    }
    file.truncate(length)
        .then(() => cb())
        .catch(cb);
}
ftruncate;
function fsync(fd, cb = nop) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_6__.fd2file)(fd)
        .sync()
        .then(() => cb())
        .catch(cb);
}
fsync;
function fdatasync(fd, cb = nop) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_6__.fd2file)(fd)
        .datasync()
        .then(() => cb())
        .catch(cb);
}
fdatasync;
function write(fd, data, cbPosOff, cbLenEnc, cbPosEnc, cb = nop) {
    let buffer, offset, length, position, encoding;
    const handle = new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd);
    if (typeof data === 'string') {
        // Signature 1: (fd, string, [position?, [encoding?]], cb?)
        encoding = 'utf8';
        switch (typeof cbPosOff) {
            case 'function':
                // (fd, string, cb)
                cb = cbPosOff;
                break;
            case 'number':
                // (fd, string, position, encoding?, cb?)
                position = cbPosOff;
                encoding = typeof cbLenEnc === 'string' ? cbLenEnc : 'utf8';
                cb = typeof cbPosEnc === 'function' ? cbPosEnc : cb;
                break;
            default:
                // ...try to find the callback and get out of here!
                cb = (typeof cbLenEnc === 'function' ? cbLenEnc : typeof cbPosEnc === 'function' ? cbPosEnc : cb);
                cb(new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid arguments.'));
                return;
        }
        buffer = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data);
        offset = 0;
        length = buffer.length;
        const _cb = cb;
        handle
            .write(buffer, offset, length, position)
            .then(({ bytesWritten }) => _cb(undefined, bytesWritten, buffer.toString(encoding)))
            .catch(_cb);
    }
    else {
        // Signature 2: (fd, buffer, offset, length, position?, cb?)
        buffer = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data.buffer);
        offset = cbPosOff;
        length = cbLenEnc;
        position = typeof cbPosEnc === 'number' ? cbPosEnc : null;
        const _cb = (typeof cbPosEnc === 'function' ? cbPosEnc : cb);
        void handle
            .write(buffer, offset, length, position)
            .then(({ bytesWritten }) => _cb(undefined, bytesWritten, buffer))
            .catch(_cb);
    }
}
write;
/**
 * Read data from the file specified by `fd`.
 * @param buffer The buffer that the data will be written to.
 * @param offset The offset within the buffer where writing will start.
 * @param length An integer specifying the number of bytes to read.
 * @param position An integer specifying where to begin reading from in the file.
 * If position is null, data will be read from the current file position.
 * @param cb The number is the number of bytes read
 */
function read(fd, buffer, offset, length, position, cb = nop) {
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .read(buffer, offset, length, position)
        .then(({ bytesRead, buffer }) => cb(undefined, bytesRead, buffer))
        .catch(cb);
}
read;
function fchown(fd, uid, gid, cb = nop) {
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .chown(uid, gid)
        .then(() => cb())
        .catch(cb);
}
fchown;
function fchmod(fd, mode, cb) {
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .chmod(mode)
        .then(() => cb())
        .catch(cb);
}
fchmod;
/**
 * Change the file timestamps of a file referenced by the supplied file descriptor.
 */
function futimes(fd, atime, mtime, cb = nop) {
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .utimes(atime, mtime)
        .then(() => cb())
        .catch(cb);
}
futimes;
function rmdir(path, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.rmdir(path)
        .then(() => cb())
        .catch(cb);
}
rmdir;
/**
 * Asynchronous `mkdir`.
 * @param mode defaults to `0777`
 */
function mkdir(path, mode, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.mkdir(path, mode)
        .then(() => cb())
        .catch(cb);
}
mkdir;
function readdir(path, _options, cb = nop) {
    cb = typeof _options == 'function' ? _options : cb;
    const options = typeof _options != 'function' ? _options : {};
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.readdir(path, options)
        .then(entries => cb(undefined, entries))
        .catch(cb);
}
readdir;
function link(existing, newpath, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.link(existing, newpath)
        .then(() => cb())
        .catch(cb);
}
link;
function symlink(target, path, typeOrCB, cb = nop) {
    const type = typeof typeOrCB === 'string' ? typeOrCB : 'file';
    cb = typeof typeOrCB === 'function' ? typeOrCB : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.symlink(target, path, type)
        .then(() => cb())
        .catch(cb);
}
symlink;
function readlink(path, options, callback = nop) {
    callback = typeof options == 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.readlink(path)
        .then(result => callback(undefined, result))
        .catch(callback);
}
readlink;
function chown(path, uid, gid, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.chown(path, uid, gid)
        .then(() => cb())
        .catch(cb);
}
chown;
function lchown(path, uid, gid, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.lchown(path, uid, gid)
        .then(() => cb())
        .catch(cb);
}
lchown;
function chmod(path, mode, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.chmod(path, mode)
        .then(() => cb())
        .catch(cb);
}
chmod;
function lchmod(path, mode, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.lchmod(path, mode)
        .then(() => cb())
        .catch(cb);
}
lchmod;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
function utimes(path, atime, mtime, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.utimes(path, atime, mtime)
        .then(() => cb())
        .catch(cb);
}
utimes;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
function lutimes(path, atime, mtime, cb = nop) {
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.lutimes(path, atime, mtime)
        .then(() => cb())
        .catch(cb);
}
lutimes;
function realpath(path, arg2, cb = nop) {
    cb = typeof arg2 === 'function' ? arg2 : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.realpath(path, typeof arg2 === 'function' ? null : arg2)
        .then(result => cb(undefined, result))
        .catch(cb);
}
realpath;
function access(path, cbMode, cb = nop) {
    const mode = typeof cbMode === 'number' ? cbMode : _constants_js__WEBPACK_IMPORTED_MODULE_4__.R_OK;
    cb = typeof cbMode === 'function' ? cbMode : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.access(path, mode)
        .then(() => cb())
        .catch(cb);
}
access;
const statWatchers = new Map();
function watchFile(path, options, listener) {
    const normalizedPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(path.toString());
    const opts = typeof options != 'function' ? options : {};
    if (typeof options == 'function') {
        listener = options;
    }
    if (!listener) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'No listener specified', path.toString(), 'watchFile');
    }
    if (statWatchers.has(normalizedPath)) {
        const entry = statWatchers.get(normalizedPath);
        if (entry) {
            entry.listeners.add(listener);
        }
        return;
    }
    const watcher = new _watchers_js__WEBPACK_IMPORTED_MODULE_8__.StatWatcher(normalizedPath, opts);
    watcher.on('change', (curr, prev) => {
        const entry = statWatchers.get(normalizedPath);
        if (!entry) {
            return;
        }
        for (const listener of entry.listeners) {
            listener(curr, prev);
        }
    });
    statWatchers.set(normalizedPath, { watcher, listeners: new Set() });
}
watchFile;
/**
 * Stop watching for changes on a file.
 *
 * If the `listener` is specified, only that particular listener is removed.
 * If no `listener` is specified, all listeners are removed, and the file is no longer watched.
 *
 * @param path The path to the file to stop watching.
 * @param listener Optional listener to remove.
 */
function unwatchFile(path, listener = nop) {
    const normalizedPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(path.toString());
    const entry = statWatchers.get(normalizedPath);
    if (entry) {
        if (listener && listener !== nop) {
            entry.listeners.delete(listener);
        }
        else {
            // If no listener is specified, remove all listeners
            entry.listeners.clear();
        }
        if (entry.listeners.size === 0) {
            // No more listeners, stop the watcher
            entry.watcher.stop();
            statWatchers.delete(normalizedPath);
        }
    }
}
unwatchFile;
function watch(path, options, listener) {
    const watcher = new _watchers_js__WEBPACK_IMPORTED_MODULE_8__.FSWatcher((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(path), typeof options == 'object' ? options : {});
    listener = typeof options == 'function' ? options : listener;
    watcher.on('change', listener || nop);
    return watcher;
}
watch;
/**
 * Opens a file in read mode and creates a Node.js-like ReadStream.
 *
 * @param path The path to the file to be opened.
 * @param options Options for the ReadStream and file opening (e.g., `encoding`, `highWaterMark`, `mode`).
 * @returns A ReadStream object for interacting with the file's contents.
 */
function createReadStream(path, options) {
    options = typeof options == 'object' ? options : { encoding: options };
    let handle;
    const stream = new _streams_js__WEBPACK_IMPORTED_MODULE_7__.ReadStream({
        highWaterMark: options.highWaterMark || 64 * 1024,
        encoding: options.encoding || 'utf8',
        async read(size) {
            try {
                handle || (handle = await _promises_js__WEBPACK_IMPORTED_MODULE_5__.open(path, 'r', options?.mode));
                const result = await handle.read(new Uint8Array(size), 0, size, handle.file.position);
                stream.push(!result.bytesRead ? null : result.buffer.slice(0, result.bytesRead));
                handle.file.position += result.bytesRead;
                if (!result.bytesRead) {
                    await handle.close();
                }
            }
            catch (error) {
                await handle?.close();
                stream.destroy(error);
            }
        },
        destroy(error, callback) {
            handle
                ?.close()
                .then(() => callback(error))
                .catch(nop);
        },
    });
    stream.path = path.toString();
    return stream;
}
createReadStream;
/**
 * Opens a file in write mode and creates a Node.js-like WriteStream.
 *
 * @param path The path to the file to be opened.
 * @param options Options for the WriteStream and file opening (e.g., `encoding`, `highWaterMark`, `mode`).
 * @returns A WriteStream object for writing to the file.
 */
function createWriteStream(path, options) {
    options = typeof options == 'object' ? options : { encoding: options };
    let handle;
    const stream = new _streams_js__WEBPACK_IMPORTED_MODULE_7__.WriteStream({
        highWaterMark: options?.highWaterMark,
        async write(chunk, encoding, callback) {
            try {
                handle || (handle = await _promises_js__WEBPACK_IMPORTED_MODULE_5__.open(path, 'w', options?.mode || 0o666));
                await handle.write(chunk, 0, encoding);
                callback(undefined);
            }
            catch (error) {
                await handle?.close();
                callback(error);
            }
        },
        destroy(error, callback) {
            callback(error);
            handle
                ?.close()
                .then(() => callback(error))
                .catch(callback);
        },
        final(callback) {
            handle
                ?.close()
                .then(() => callback())
                .catch(callback);
        },
    });
    stream.path = path.toString();
    return stream;
}
createWriteStream;
function rm(path, options, callback = nop) {
    callback = typeof options === 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.rm(path, typeof options === 'function' ? undefined : options)
        .then(() => callback(undefined))
        .catch(callback);
}
rm;
function mkdtemp(prefix, options, callback = nop) {
    callback = typeof options === 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.mkdtemp(prefix, typeof options != 'function' ? options : null)
        .then(result => callback(undefined, result))
        .catch(callback);
}
mkdtemp;
function copyFile(src, dest, flags, callback = nop) {
    callback = typeof flags === 'function' ? flags : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.copyFile(src, dest, typeof flags === 'function' ? undefined : flags)
        .then(() => callback(undefined))
        .catch(callback);
}
copyFile;
function readv(fd, buffers, position, cb = nop) {
    cb = typeof position === 'function' ? position : cb;
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .readv(buffers, typeof position === 'function' ? undefined : position)
        .then(({ buffers, bytesRead }) => cb(undefined, bytesRead, buffers))
        .catch(cb);
}
readv;
function writev(fd, buffers, position, cb = nop) {
    cb = typeof position === 'function' ? position : cb;
    new _promises_js__WEBPACK_IMPORTED_MODULE_5__.FileHandle(fd)
        .writev(buffers, typeof position === 'function' ? undefined : position)
        .then(({ buffers, bytesWritten }) => cb(undefined, bytesWritten, buffers))
        .catch(cb);
}
writev;
function opendir(path, options, cb = nop) {
    cb = typeof options === 'function' ? options : cb;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.opendir(path, typeof options === 'function' ? undefined : options)
        .then(result => cb(undefined, result))
        .catch(cb);
}
opendir;
function cp(source, destination, opts, callback = nop) {
    callback = typeof opts === 'function' ? opts : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.cp(source, destination, typeof opts === 'function' ? undefined : opts)
        .then(() => callback(undefined))
        .catch(callback);
}
cp;
function statfs(path, options, callback = nop) {
    callback = typeof options === 'function' ? options : callback;
    _promises_js__WEBPACK_IMPORTED_MODULE_5__.statfs(path, typeof options === 'function' ? undefined : options)
        .then(result => callback(undefined, result))
        .catch(callback);
}
statfs;
async function openAsBlob(path, options) {
    const handle = await _promises_js__WEBPACK_IMPORTED_MODULE_5__.open(path.toString(), 'r');
    const buffer = await handle.readFile();
    await handle.close();
    return new Blob([buffer], options);
}
openAsBlob;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/cache.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/cache.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cache: () => (/* binding */ Cache),
/* harmony export */   paths: () => (/* binding */ paths),
/* harmony export */   stats: () => (/* binding */ stats)
/* harmony export */ });
/* Experimental caching */
/**
 * Used for caching data
 * @internal
 */
class Cache {
    constructor() {
        this.isEnabled = false;
        this.sync = new Map();
        this.async = new Map();
    }
    /**
     * Gets data from the cache, if is exists and the cache is enabled.
     */
    getSync(path) {
        if (!this.isEnabled)
            return;
        return this.sync.get(path);
    }
    /**
     * Adds data if the cache is enabled
     */
    setSync(path, value) {
        if (!this.isEnabled)
            return;
        this.sync.set(path, value);
        this.async.set(path, Promise.resolve(value));
    }
    /**
     * Clears the cache if it is enabled
     */
    clearSync() {
        if (!this.isEnabled)
            return;
        this.sync.clear();
    }
    /**
     * Gets data from the cache, if it exists and the cache is enabled.
     */
    get(path) {
        if (!this.isEnabled)
            return;
        return this.async.get(path);
    }
    /**
     * Adds data if the cache is enabled
     */
    set(path, value) {
        if (!this.isEnabled)
            return;
        this.async.set(path, value);
        void value.then(v => this.sync.set(path, v));
    }
    /**
     * Clears the cache if it is enabled
     */
    clear() {
        if (!this.isEnabled)
            return;
        this.async.clear();
    }
}
/**
 * Used to cache
 */
const stats = new Cache();
/**
 * Used to cache realpath lookups
 */
const paths = new Cache();


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/config.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/config.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
const config = {
    /**
     * Whether to perform access checks
     */
    checkAccess: true,
    /**
     * Whether to mark a file as dirty after updating its `atime` when read from
     */
    updateOnRead: true,
    /**
     * Whether to immediately sync when files are changed
     */
    syncImmediately: true,
    /**
     * If a file's buffer is not large enough to store content when writing and the buffer can't be resized, reuse the buffer passed to write()
     */
    unsafeBufferReplace: false,
};


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/constants.js":
/*!******************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/constants.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COPYFILE_EXCL: () => (/* binding */ COPYFILE_EXCL),
/* harmony export */   COPYFILE_FICLONE: () => (/* binding */ COPYFILE_FICLONE),
/* harmony export */   COPYFILE_FICLONE_FORCE: () => (/* binding */ COPYFILE_FICLONE_FORCE),
/* harmony export */   F_OK: () => (/* binding */ F_OK),
/* harmony export */   O_APPEND: () => (/* binding */ O_APPEND),
/* harmony export */   O_CREAT: () => (/* binding */ O_CREAT),
/* harmony export */   O_DIRECT: () => (/* binding */ O_DIRECT),
/* harmony export */   O_DIRECTORY: () => (/* binding */ O_DIRECTORY),
/* harmony export */   O_DSYNC: () => (/* binding */ O_DSYNC),
/* harmony export */   O_EXCL: () => (/* binding */ O_EXCL),
/* harmony export */   O_NOATIME: () => (/* binding */ O_NOATIME),
/* harmony export */   O_NOCTTY: () => (/* binding */ O_NOCTTY),
/* harmony export */   O_NOFOLLOW: () => (/* binding */ O_NOFOLLOW),
/* harmony export */   O_NONBLOCK: () => (/* binding */ O_NONBLOCK),
/* harmony export */   O_RDONLY: () => (/* binding */ O_RDONLY),
/* harmony export */   O_RDWR: () => (/* binding */ O_RDWR),
/* harmony export */   O_SYMLINK: () => (/* binding */ O_SYMLINK),
/* harmony export */   O_SYNC: () => (/* binding */ O_SYNC),
/* harmony export */   O_TRUNC: () => (/* binding */ O_TRUNC),
/* harmony export */   O_WRONLY: () => (/* binding */ O_WRONLY),
/* harmony export */   R_OK: () => (/* binding */ R_OK),
/* harmony export */   S_IFBLK: () => (/* binding */ S_IFBLK),
/* harmony export */   S_IFCHR: () => (/* binding */ S_IFCHR),
/* harmony export */   S_IFDIR: () => (/* binding */ S_IFDIR),
/* harmony export */   S_IFIFO: () => (/* binding */ S_IFIFO),
/* harmony export */   S_IFLNK: () => (/* binding */ S_IFLNK),
/* harmony export */   S_IFMT: () => (/* binding */ S_IFMT),
/* harmony export */   S_IFREG: () => (/* binding */ S_IFREG),
/* harmony export */   S_IFSOCK: () => (/* binding */ S_IFSOCK),
/* harmony export */   S_IRGRP: () => (/* binding */ S_IRGRP),
/* harmony export */   S_IROTH: () => (/* binding */ S_IROTH),
/* harmony export */   S_IRUSR: () => (/* binding */ S_IRUSR),
/* harmony export */   S_IRWXG: () => (/* binding */ S_IRWXG),
/* harmony export */   S_IRWXO: () => (/* binding */ S_IRWXO),
/* harmony export */   S_IRWXU: () => (/* binding */ S_IRWXU),
/* harmony export */   S_ISGID: () => (/* binding */ S_ISGID),
/* harmony export */   S_ISUID: () => (/* binding */ S_ISUID),
/* harmony export */   S_ISVTX: () => (/* binding */ S_ISVTX),
/* harmony export */   S_IWGRP: () => (/* binding */ S_IWGRP),
/* harmony export */   S_IWOTH: () => (/* binding */ S_IWOTH),
/* harmony export */   S_IWUSR: () => (/* binding */ S_IWUSR),
/* harmony export */   S_IXGRP: () => (/* binding */ S_IXGRP),
/* harmony export */   S_IXOTH: () => (/* binding */ S_IXOTH),
/* harmony export */   S_IXUSR: () => (/* binding */ S_IXUSR),
/* harmony export */   UV_FS_O_FILEMAP: () => (/* binding */ UV_FS_O_FILEMAP),
/* harmony export */   W_OK: () => (/* binding */ W_OK),
/* harmony export */   X_OK: () => (/* binding */ X_OK),
/* harmony export */   size_max: () => (/* binding */ size_max)
/* harmony export */ });
/*
FS Constants
See https://nodejs.org/api/fs.html#file-access-constants

Note: Many of these are pulled from
https://github.com/torvalds/linux/blob/master/include/uapi/linux/stat.h
*/
// File Access Constants
/** File is visible to the calling process. */
const F_OK = 0;
/** File can be read by the calling process. */
const R_OK = 4;
/** File can be written by the calling process. */
const W_OK = 2;
/** File can be executed by the calling process. */
const X_OK = 1;
// File Copy Constants
/** Constant for fs.copyFile. Flag indicating the destination file should not be overwritten if it already exists. */
const COPYFILE_EXCL = 1;
/**
 * Constant for fs.copyFile. Copy operation will attempt to create a copy-on-write reflink.
 * If the underlying platform does not support copy-on-write, then a fallback copy mechanism is used.
 */
const COPYFILE_FICLONE = 2;
/**
 * Constant for fs.copyFile. Copy operation will attempt to create a copy-on-write reflink.
 * If the underlying platform does not support copy-on-write, then the operation will fail with an error.
 */
const COPYFILE_FICLONE_FORCE = 4;
// File Open Constants
/** Flag indicating to open a file for read-only access. */
const O_RDONLY = 0;
/** Flag indicating to open a file for write-only access. */
const O_WRONLY = 1;
/** Flag indicating to open a file for read-write access. */
const O_RDWR = 2;
/** Flag indicating to create the file if it does not already exist. */
const O_CREAT = 0x40; // bit 6
/** Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists. */
const O_EXCL = 0x80; // bit 7
/**
 * Flag indicating that if path identifies a terminal device,
 * opening the path shall not cause that terminal to become the controlling terminal for the process
 * (if the process does not already have one).
 */
const O_NOCTTY = 0x100; // bit 8
/** Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero. */
const O_TRUNC = 0x200; // bit 9
/** Flag indicating that data will be appended to the end of the file. */
const O_APPEND = 0x400; // bit 10
/** Flag indicating that the open should fail if the path is not a directory. */
const O_DIRECTORY = 0x10000; // bit 16
/**
 * constant for fs.open().
 * Flag indicating reading accesses to the file system will no longer result in
 * an update to the atime information associated with the file.
 * This flag is available on Linux operating systems only.
 */
const O_NOATIME = 0x40000; // bit 18
/** Flag indicating that the open should fail if the path is a symbolic link. */
const O_NOFOLLOW = 0x20000; // bit 17
/** Flag indicating that the file is opened for synchronous I/O. */
const O_SYNC = 0x101000; // bit 20 and bit 12
/** Flag indicating that the file is opened for synchronous I/O with write operations waiting for data integrity. */
const O_DSYNC = 0x1000; // bit 12
/** Flag indicating to open the symbolic link itself rather than the resource it is pointing to. */
const O_SYMLINK = 0x8000; // bit 15
/** When set, an attempt will be made to minimize caching effects of file I/O. */
const O_DIRECT = 0x4000; // bit 14
/** Flag indicating to open the file in nonblocking mode when possible. */
const O_NONBLOCK = 0x800; // bit 11
// File Type Constants
/** Bit mask used to extract the file type from mode. */
const S_IFMT = 0xf000;
/** File type constant for a socket. */
const S_IFSOCK = 0xc000;
/** File type constant for a symbolic link. */
const S_IFLNK = 0xa000;
/** File type constant for a regular file. */
const S_IFREG = 0x8000;
/** File type constant for a block-oriented device file. */
const S_IFBLK = 0x6000;
/** File type constant for a directory. */
const S_IFDIR = 0x4000;
/** File type constant for a character-oriented device file. */
const S_IFCHR = 0x2000;
/** File type constant for a FIFO/pipe. */
const S_IFIFO = 0x1000;
/** Set user id */
const S_ISUID = 0o4000;
/** Set group id */
const S_ISGID = 0o2000;
/** Sticky bit */
const S_ISVTX = 0o1000;
// File Mode Constants
/** File mode indicating readable, writable and executable by owner. */
const S_IRWXU = 0o700;
/** File mode indicating readable by owner. */
const S_IRUSR = 0o400;
/** File mode indicating writable by owner. */
const S_IWUSR = 0o200;
/** File mode indicating executable by owner. */
const S_IXUSR = 0o100;
/** File mode indicating readable, writable and executable by group. */
const S_IRWXG = 0o70;
/** File mode indicating readable by group. */
const S_IRGRP = 0o40;
/** File mode indicating writable by group. */
const S_IWGRP = 0o20;
/** File mode indicating executable by group. */
const S_IXGRP = 0o10;
/** File mode indicating readable, writable and executable by others. */
const S_IRWXO = 7;
/** File mode indicating readable by others. */
const S_IROTH = 4;
/** File mode indicating writable by others. */
const S_IWOTH = 2;
/** File mode indicating executable by others. */
const S_IXOTH = 1;
/**
 * When set, a memory file mapping is used to access the file.
 * This flag is ignored since a unix-like FS is emulated
 */
const UV_FS_O_FILEMAP = 0;
/**
 * Max 32-bit integer
 * @hidden
 */
const size_max = 2 ** 32 - 1;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/dir.js":
/*!************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/dir.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dir: () => (/* binding */ Dir),
/* harmony export */   Dirent: () => (/* binding */ Dirent)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _promises_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./promises.js */ "./src/node_modules/@zenfs/core/dist/emulation/promises.js");
/* harmony import */ var _sync_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sync.js */ "./src/node_modules/@zenfs/core/dist/emulation/sync.js");




class Dirent {
    get name() {
        return (0,_path_js__WEBPACK_IMPORTED_MODULE_1__.basename)(this.path);
    }
    constructor(path, stats) {
        this.path = path;
        this.stats = stats;
    }
    get parentPath() {
        return this.path;
    }
    isFile() {
        return this.stats.isFile();
    }
    isDirectory() {
        return this.stats.isDirectory();
    }
    isBlockDevice() {
        return this.stats.isBlockDevice();
    }
    isCharacterDevice() {
        return this.stats.isCharacterDevice();
    }
    isSymbolicLink() {
        return this.stats.isSymbolicLink();
    }
    isFIFO() {
        return this.stats.isFIFO();
    }
    isSocket() {
        return this.stats.isSocket();
    }
}
/**
 * A class representing a directory stream.
 */
class Dir {
    checkClosed() {
        if (this.closed) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EBADF, 'Can not use closed Dir');
        }
    }
    constructor(path) {
        this.path = path;
        this.closed = false;
    }
    close(cb) {
        this.closed = true;
        if (!cb) {
            return Promise.resolve();
        }
        cb();
    }
    /**
     * Synchronously close the directory's underlying resource handle.
     * Subsequent reads will result in errors.
     */
    closeSync() {
        this.closed = true;
    }
    async _read() {
        this.checkClosed();
        this._entries ?? (this._entries = await (0,_promises_js__WEBPACK_IMPORTED_MODULE_2__.readdir)(this.path, { withFileTypes: true }));
        if (!this._entries.length) {
            return null;
        }
        return this._entries.shift() ?? null;
    }
    read(cb) {
        if (!cb) {
            return this._read();
        }
        void this._read().then(value => cb(undefined, value));
    }
    /**
     * Synchronously read the next directory entry via `readdir(3)` as a `Dirent`.
     * If there are no more directory entries to read, null will be returned.
     * Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms.
     */
    readSync() {
        this.checkClosed();
        this._entries ?? (this._entries = (0,_sync_js__WEBPACK_IMPORTED_MODULE_3__.readdirSync)(this.path, { withFileTypes: true }));
        if (!this._entries.length) {
            return null;
        }
        return this._entries.shift() ?? null;
    }
    async next() {
        const value = await this._read();
        if (value) {
            return { done: false, value };
        }
        await this.close();
        return { done: true, value: undefined };
    }
    /**
     * Asynchronously iterates over the directory via `readdir(3)` until all entries have been read.
     */
    [Symbol.asyncIterator]() {
        return this;
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/index.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BigIntStatsFs: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_7__.BigIntStatsFs),
/* harmony export */   Dir: () => (/* reexport safe */ _dir_js__WEBPACK_IMPORTED_MODULE_5__.Dir),
/* harmony export */   Dirent: () => (/* reexport safe */ _dir_js__WEBPACK_IMPORTED_MODULE_5__.Dirent),
/* harmony export */   ReadStream: () => (/* reexport safe */ _streams_js__WEBPACK_IMPORTED_MODULE_4__.ReadStream),
/* harmony export */   Stats: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_7__.Stats),
/* harmony export */   StatsFs: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_7__.StatsFs),
/* harmony export */   WriteStream: () => (/* reexport safe */ _streams_js__WEBPACK_IMPORTED_MODULE_4__.WriteStream),
/* harmony export */   _synced: () => (/* reexport safe */ _shared_js__WEBPACK_IMPORTED_MODULE_6__._synced),
/* harmony export */   access: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.access),
/* harmony export */   accessSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.accessSync),
/* harmony export */   appendFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.appendFile),
/* harmony export */   appendFileSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.appendFileSync),
/* harmony export */   chmod: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.chmod),
/* harmony export */   chmodSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.chmodSync),
/* harmony export */   chown: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.chown),
/* harmony export */   chownSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.chownSync),
/* harmony export */   close: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.close),
/* harmony export */   closeSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.closeSync),
/* harmony export */   constants: () => (/* reexport module object */ _constants_js__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   copyFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.copyFile),
/* harmony export */   copyFileSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.copyFileSync),
/* harmony export */   cp: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.cp),
/* harmony export */   cpSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.cpSync),
/* harmony export */   createReadStream: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.createReadStream),
/* harmony export */   createWriteStream: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.createWriteStream),
/* harmony export */   exists: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.exists),
/* harmony export */   existsSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.existsSync),
/* harmony export */   fchmod: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.fchmod),
/* harmony export */   fchmodSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.fchmodSync),
/* harmony export */   fchown: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.fchown),
/* harmony export */   fchownSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.fchownSync),
/* harmony export */   fdatasync: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.fdatasync),
/* harmony export */   fdatasyncSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.fdatasyncSync),
/* harmony export */   fstat: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.fstat),
/* harmony export */   fstatSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.fstatSync),
/* harmony export */   fsync: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.fsync),
/* harmony export */   fsyncSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.fsyncSync),
/* harmony export */   ftruncate: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.ftruncate),
/* harmony export */   ftruncateSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.ftruncateSync),
/* harmony export */   futimes: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.futimes),
/* harmony export */   futimesSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.futimesSync),
/* harmony export */   lchmod: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.lchmod),
/* harmony export */   lchmodSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.lchmodSync),
/* harmony export */   lchown: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.lchown),
/* harmony export */   lchownSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.lchownSync),
/* harmony export */   link: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.link),
/* harmony export */   linkSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.linkSync),
/* harmony export */   lopenSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.lopenSync),
/* harmony export */   lstat: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.lstat),
/* harmony export */   lstatSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.lstatSync),
/* harmony export */   lutimes: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.lutimes),
/* harmony export */   lutimesSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.lutimesSync),
/* harmony export */   mkdir: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.mkdir),
/* harmony export */   mkdirSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.mkdirSync),
/* harmony export */   mkdtemp: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.mkdtemp),
/* harmony export */   mkdtempSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.mkdtempSync),
/* harmony export */   mount: () => (/* reexport safe */ _shared_js__WEBPACK_IMPORTED_MODULE_6__.mount),
/* harmony export */   mountObject: () => (/* reexport safe */ _shared_js__WEBPACK_IMPORTED_MODULE_6__.mountObject),
/* harmony export */   mounts: () => (/* reexport safe */ _shared_js__WEBPACK_IMPORTED_MODULE_6__.mounts),
/* harmony export */   open: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.open),
/* harmony export */   openAsBlob: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.openAsBlob),
/* harmony export */   openSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.openSync),
/* harmony export */   opendir: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.opendir),
/* harmony export */   opendirSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.opendirSync),
/* harmony export */   promises: () => (/* reexport module object */ _promises_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   read: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   readFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.readFile),
/* harmony export */   readFileSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.readFileSync),
/* harmony export */   readSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.readSync),
/* harmony export */   readdir: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.readdir),
/* harmony export */   readdirSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.readdirSync),
/* harmony export */   readlink: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.readlink),
/* harmony export */   readlinkSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.readlinkSync),
/* harmony export */   readv: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.readv),
/* harmony export */   readvSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.readvSync),
/* harmony export */   realpath: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.realpath),
/* harmony export */   realpathSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.realpathSync),
/* harmony export */   rename: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.rename),
/* harmony export */   renameSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.renameSync),
/* harmony export */   rm: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.rm),
/* harmony export */   rmSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.rmSync),
/* harmony export */   rmdir: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.rmdir),
/* harmony export */   rmdirSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.rmdirSync),
/* harmony export */   stat: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.stat),
/* harmony export */   statSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.statSync),
/* harmony export */   statfs: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.statfs),
/* harmony export */   statfsSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.statfsSync),
/* harmony export */   symlink: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.symlink),
/* harmony export */   symlinkSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.symlinkSync),
/* harmony export */   truncate: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.truncate),
/* harmony export */   truncateSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.truncateSync),
/* harmony export */   umount: () => (/* reexport safe */ _shared_js__WEBPACK_IMPORTED_MODULE_6__.umount),
/* harmony export */   unlink: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.unlink),
/* harmony export */   unlinkSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.unlinkSync),
/* harmony export */   unwatchFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.unwatchFile),
/* harmony export */   utimes: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.utimes),
/* harmony export */   utimesSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.utimesSync),
/* harmony export */   watch: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.watch),
/* harmony export */   watchFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.watchFile),
/* harmony export */   write: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.write),
/* harmony export */   writeFile: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.writeFile),
/* harmony export */   writeFileSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.writeFileSync),
/* harmony export */   writeSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.writeSync),
/* harmony export */   writev: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.writev),
/* harmony export */   writevSync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_1__.writevSync)
/* harmony export */ });
/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async.js */ "./src/node_modules/@zenfs/core/dist/emulation/async.js");
/* harmony import */ var _sync_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sync.js */ "./src/node_modules/@zenfs/core/dist/emulation/sync.js");
/* harmony import */ var _promises_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./promises.js */ "./src/node_modules/@zenfs/core/dist/emulation/promises.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _streams_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./streams.js */ "./src/node_modules/@zenfs/core/dist/emulation/streams.js");
/* harmony import */ var _dir_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dir.js */ "./src/node_modules/@zenfs/core/dist/emulation/dir.js");
/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared.js */ "./src/node_modules/@zenfs/core/dist/emulation/shared.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");










/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/path.js":
/*!*************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/path.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basename: () => (/* binding */ basename),
/* harmony export */   cd: () => (/* binding */ cd),
/* harmony export */   cwd: () => (/* binding */ cwd),
/* harmony export */   dirname: () => (/* binding */ dirname),
/* harmony export */   extname: () => (/* binding */ extname),
/* harmony export */   format: () => (/* binding */ format),
/* harmony export */   formatExt: () => (/* binding */ formatExt),
/* harmony export */   isAbsolute: () => (/* binding */ isAbsolute),
/* harmony export */   join: () => (/* binding */ join),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   normalizeString: () => (/* binding */ normalizeString),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   relative: () => (/* binding */ relative),
/* harmony export */   resolve: () => (/* binding */ resolve),
/* harmony export */   sep: () => (/* binding */ sep)
/* harmony export */ });
/*
Copyright Joyent, Inc. and other Node contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
let cwd = '/';
function cd(path) {
    cwd = resolve(cwd, path);
}
const sep = '/';
function validateObject(str, name) {
    if (typeof str != 'object') {
        throw new TypeError(`"${name}" is not an object`);
    }
}
// Resolves . and .. elements in a path with directory names
function normalizeString(path, allowAboveRoot) {
    let res = '';
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let char = '\x00';
    for (let i = 0; i <= path.length; ++i) {
        if (i < path.length) {
            char = path[i];
        }
        else if (char == '/') {
            break;
        }
        else {
            char = '/';
        }
        if (char == '/') {
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            }
            else if (dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.at(-1) !== '.' || res.at(-2) !== '.') {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf('/');
                        if (lastSlashIndex === -1) {
                            res = '';
                            lastSegmentLength = 0;
                        }
                        else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                    else if (res.length !== 0) {
                        res = '';
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    res += res.length > 0 ? '/..' : '..';
                    lastSegmentLength = 2;
                }
            }
            else {
                if (res.length > 0)
                    res += '/' + path.slice(lastSlash + 1, i);
                else
                    res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        }
        else if (char === '.' && dots !== -1) {
            ++dots;
        }
        else {
            dots = -1;
        }
    }
    return res;
}
function formatExt(ext) {
    return ext ? `${ext[0] === '.' ? '' : '.'}${ext}` : '';
}
function resolve(...parts) {
    let resolved = '';
    for (const part of [...parts.reverse(), cwd]) {
        if (!part.length) {
            continue;
        }
        resolved = `${part}/${resolved}`;
        if (part.startsWith('/')) {
            break;
        }
    }
    const absolute = resolved.startsWith('/');
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when cwd fails)
    // Normalize the path
    resolved = normalizeString(resolved, !absolute);
    if (absolute) {
        return `/${resolved}`;
    }
    return resolved.length ? resolved : '/';
}
function normalize(path) {
    if (!path.length)
        return '.';
    const isAbsolute = path.startsWith('/');
    const trailingSeparator = path.endsWith('/');
    // Normalize the path
    path = normalizeString(path, !isAbsolute);
    if (!path.length) {
        if (isAbsolute)
            return '/';
        return trailingSeparator ? './' : '.';
    }
    if (trailingSeparator)
        path += '/';
    return isAbsolute ? `/${path}` : path;
}
function isAbsolute(path) {
    return path.startsWith('/');
}
function join(...parts) {
    if (!parts.length)
        return '.';
    const joined = parts.join('/');
    if (!joined?.length)
        return '.';
    return normalize(joined);
}
function relative(from, to) {
    if (from === to)
        return '';
    // Trim leading forward slashes.
    from = resolve(from);
    to = resolve(to);
    if (from === to)
        return '';
    const fromStart = 1;
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    const toStart = 1;
    const toLen = to.length - toStart;
    // Compare paths to find the longest common path from root
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i < length; i++) {
        const fromCode = from[fromStart + i];
        if (fromCode !== to[toStart + i])
            break;
        else if (fromCode === '/')
            lastCommonSep = i;
    }
    if (i === length) {
        if (toLen > length) {
            if (to[toStart + i] === '/') {
                // We get here if `from` is the exact base path for `to`.
                // For example: from='/foo/bar'; to='/foo/bar/baz'
                return to.slice(toStart + i + 1);
            }
            if (i === 0) {
                // We get here if `from` is the root
                // For example: from='/'; to='/foo'
                return to.slice(toStart + i);
            }
        }
        else if (fromLen > length) {
            if (from[fromStart + i] === '/') {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='/foo/bar/baz'; to='/foo/bar'
                lastCommonSep = i;
            }
            else if (i === 0) {
                // We get here if `to` is the root.
                // For example: from='/foo/bar'; to='/'
                lastCommonSep = 0;
            }
        }
    }
    let out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`.
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from[i] === '/') {
            out += out.length === 0 ? '..' : '/..';
        }
    }
    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts.
    return `${out}${to.slice(toStart + lastCommonSep)}`;
}
function dirname(path) {
    if (path.length === 0)
        return '.';
    const hasRoot = path[0] === '/';
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
        if (path[i] === '/') {
            if (!matchedSlash) {
                end = i;
                break;
            }
        }
        else {
            // We saw the first non-path separator
            matchedSlash = false;
        }
    }
    if (end === -1)
        return hasRoot ? '/' : '.';
    if (hasRoot && end === 1)
        return '//';
    return path.slice(0, end);
}
function basename(path, suffix) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
        if (suffix === path)
            return '';
        let extIdx = suffix.length - 1;
        let firstNonSlashEnd = -1;
        for (let i = path.length - 1; i >= 0; --i) {
            if (path[i] === '/') {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else {
                if (firstNonSlashEnd === -1) {
                    // We saw the first non-path separator, remember this index in case
                    // we need it if the extension ends up not matching
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    // Try to match the explicit extension
                    if (path[i] === suffix[extIdx]) {
                        if (--extIdx === -1) {
                            // We matched the extension, so mark this as the end of our path component
                            end = i;
                        }
                    }
                    else {
                        // Extension does not match, so our result is the entire path component
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end)
            end = firstNonSlashEnd;
        else if (end === -1)
            end = path.length;
        return path.slice(start, end);
    }
    for (let i = path.length - 1; i >= 0; --i) {
        if (path[i] === '/') {
            // If we reached a path separator that was not part of a set of path separators at the end of the string, stop now
            if (!matchedSlash) {
                start = i + 1;
                break;
            }
        }
        else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our path component
            matchedSlash = false;
            end = i + 1;
        }
    }
    if (end === -1)
        return '';
    return path.slice(start, end);
}
function extname(path) {
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
        if (path[i] === '/') {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (path[i] === '.') {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
        return '';
    }
    return path.slice(startDot, end);
}
function format(pathObject) {
    validateObject(pathObject, 'pathObject');
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || `${pathObject.name || ''}${formatExt(pathObject.ext)}`;
    if (!dir) {
        return base;
    }
    return dir === pathObject.root ? `${dir}${base}` : `${dir}/${base}`;
}
function parse(path) {
    const isAbsolute = path.startsWith('/');
    const ret = { root: isAbsolute ? '/' : '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0)
        return ret;
    const start = isAbsolute ? 1 : 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    let preDotState = 0;
    // Get non-dir info
    for (; i >= start; --i) {
        if (path[i] === '/') {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (path[i] === '.') {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (end !== -1) {
        const start = startPart === 0 && isAbsolute ? 1 : startPart;
        if (startDot === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            ret.base = ret.name = path.slice(start, end);
        }
        else {
            ret.name = path.slice(start, startDot);
            ret.base = path.slice(start, end);
            ret.ext = path.slice(startDot, end);
        }
    }
    if (startPart > 0)
        ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute)
        ret.dir = '/';
    return ret;
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/promises.js":
/*!*****************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/promises.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileHandle: () => (/* binding */ FileHandle),
/* harmony export */   access: () => (/* binding */ access),
/* harmony export */   appendFile: () => (/* binding */ appendFile),
/* harmony export */   chmod: () => (/* binding */ chmod),
/* harmony export */   chown: () => (/* binding */ chown),
/* harmony export */   constants: () => (/* reexport module object */ _constants_js__WEBPACK_IMPORTED_MODULE_8__),
/* harmony export */   copyFile: () => (/* binding */ copyFile),
/* harmony export */   cp: () => (/* binding */ cp),
/* harmony export */   exists: () => (/* binding */ exists),
/* harmony export */   lchmod: () => (/* binding */ lchmod),
/* harmony export */   lchown: () => (/* binding */ lchown),
/* harmony export */   link: () => (/* binding */ link),
/* harmony export */   lstat: () => (/* binding */ lstat),
/* harmony export */   lutimes: () => (/* binding */ lutimes),
/* harmony export */   mkdir: () => (/* binding */ mkdir),
/* harmony export */   mkdtemp: () => (/* binding */ mkdtemp),
/* harmony export */   open: () => (/* binding */ open),
/* harmony export */   opendir: () => (/* binding */ opendir),
/* harmony export */   readFile: () => (/* binding */ readFile),
/* harmony export */   readdir: () => (/* binding */ readdir),
/* harmony export */   readlink: () => (/* binding */ readlink),
/* harmony export */   realpath: () => (/* binding */ realpath),
/* harmony export */   rename: () => (/* binding */ rename),
/* harmony export */   rm: () => (/* binding */ rm),
/* harmony export */   rmdir: () => (/* binding */ rmdir),
/* harmony export */   stat: () => (/* binding */ stat),
/* harmony export */   statfs: () => (/* binding */ statfs),
/* harmony export */   symlink: () => (/* binding */ symlink),
/* harmony export */   truncate: () => (/* binding */ truncate),
/* harmony export */   unlink: () => (/* binding */ unlink),
/* harmony export */   utimes: () => (/* binding */ utimes),
/* harmony export */   watch: () => (/* binding */ watch),
/* harmony export */   writeFile: () => (/* binding */ writeFile)
/* harmony export */ });
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../polyfills.js */ "./src/node_modules/@zenfs/core/dist/polyfills.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _cache_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cache.js */ "./src/node_modules/@zenfs/core/dist/emulation/cache.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config.js */ "./src/node_modules/@zenfs/core/dist/emulation/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _dir_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dir.js */ "./src/node_modules/@zenfs/core/dist/emulation/dir.js");
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shared.js */ "./src/node_modules/@zenfs/core/dist/emulation/shared.js");
/* harmony import */ var _streams_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./streams.js */ "./src/node_modules/@zenfs/core/dist/emulation/streams.js");
/* harmony import */ var _watchers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./watchers.js */ "./src/node_modules/@zenfs/core/dist/emulation/watchers.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */















class FileHandle {
    constructor(fdOrFile) {
        const isFile = typeof fdOrFile != 'number';
        this.fd = isFile ? (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.file2fd)(fdOrFile) : fdOrFile;
        this.file = isFile ? fdOrFile : (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fd2file)(fdOrFile);
    }
    /**
     * Asynchronous fchown(2) - Change ownership of a file.
     */
    async chown(uid, gid) {
        await this.file.chown(uid, gid);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronous fchmod(2) - Change permissions of a file.
     * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
     */
    async chmod(mode) {
        const numMode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeMode)(mode, -1);
        if (numMode < 0) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid mode.');
        }
        await this.file.chmod(numMode);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronous fdatasync(2) - synchronize a file's in-core state with storage device.
     */
    datasync() {
        return this.file.datasync();
    }
    /**
     * Asynchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
     */
    sync() {
        return this.file.sync();
    }
    /**
     * Asynchronous ftruncate(2) - Truncate a file to a specified length.
     * @param length If not specified, defaults to `0`.
     */
    async truncate(length) {
        length || (length = 0);
        if (length < 0) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL);
        }
        await this.file.truncate(length);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronously change file timestamps of the file.
     * @param atime The last access time. If a string is provided, it will be coerced to number.
     * @param mtime The last modified time. If a string is provided, it will be coerced to number.
     */
    async utimes(atime, mtime) {
        await this.file.utimes((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeTime)(atime), (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeTime)(mtime));
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronously append data to a file, creating the file if it does not exist. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for appending.
     * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
     * @param _options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
     * - `encoding` defaults to `'utf8'`.
     * - `mode` defaults to `0o666`.
     * - `flag` defaults to `'a'`.
     */
    async appendFile(data, _options = {}) {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, 'utf8', 'a', 0o644);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isAppendable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed to appendFile must allow for appending.');
        }
        if (typeof data != 'string' && !options.encoding) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Encoding not specified');
        }
        const encodedData = typeof data == 'string' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, options.encoding) : data;
        await this.file.write(encodedData, 0, encodedData.length);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronously reads data from the file.
     * The `FileHandle` must have been opened for reading.
     * @param buffer The buffer that the data will be written to.
     * @param offset The offset in the buffer at which to start writing.
     * @param length The number of bytes to read.
     * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
     */
    read(buffer, offset, length, position) {
        if (isNaN(+position)) {
            position = this.file.position;
        }
        return this.file.read(buffer, offset, length, position);
    }
    async readFile(_options) {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, null, 'r', 0o444);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isReadable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed must allow for reading.');
        }
        const { size } = await this.stat();
        const { buffer: data } = await this.file.read(new Uint8Array(size), 0, size, 0);
        const buffer = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data);
        return options.encoding ? buffer.toString(options.encoding) : buffer;
    }
    /**
     * Returns a `ReadableStream` that may be used to read the files data.
     *
     * An error will be thrown if this method is called more than once or is called after the `FileHandle` is closed or closing.
     *
     * While the `ReadableStream` will read the file to completion,
     * it will not close the `FileHandle` automatically.
     * User code must still call the `fileHandle.close()` method.
     *
     * @since v17.0.0
     * @experimental
     */
    readableWebStream(options = {}) {
        // Note: using an arrow function to preserve `this`
        const start = async (controller) => {
            try {
                const chunkSize = 64 * 1024, maxChunks = 1e7;
                let i = 0, position = 0, bytesRead = NaN;
                while (bytesRead > 0) {
                    const result = await this.read(new Uint8Array(chunkSize), 0, chunkSize, position);
                    if (!result.bytesRead) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(result.buffer.slice(0, result.bytesRead));
                    position += result.bytesRead;
                    if (++i >= maxChunks) {
                        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EFBIG, 'Too many iterations on readable stream', this.file.path, 'FileHandle.readableWebStream');
                    }
                    bytesRead = result.bytesRead;
                }
            }
            catch (e) {
                controller.error(e);
            }
        };
        const _gt = globalThis;
        if (!('ReadableStream' in _gt)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.ENOSYS, 'ReadableStream is missing on globalThis');
        }
        return new _gt.ReadableStream({ start, type: options.type });
    }
    /**
     * @todo Implement
     */
    readLines(options) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.file.path, 'FileHandle.readLines');
    }
    [Symbol.asyncDispose]() {
        return this.close();
    }
    async stat(opts) {
        const stats = await this.file.stat();
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', this.file.path, 'stat');
        }
        return opts?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_4__.BigIntStats(stats) : stats;
    }
    async write(data, posOrOff, lenOrEnc, position) {
        let buffer, offset, length;
        if (typeof data === 'string') {
            // Signature 1: (fd, string, [position?, [encoding?]])
            position = typeof posOrOff === 'number' ? posOrOff : null;
            const encoding = typeof lenOrEnc === 'string' ? lenOrEnc : 'utf8';
            offset = 0;
            buffer = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, encoding);
            length = buffer.length;
        }
        else {
            // Signature 2: (fd, buffer, offset, length, position?)
            buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            offset = posOrOff;
            length = lenOrEnc;
            position = typeof position === 'number' ? position : null;
        }
        position ?? (position = this.file.position);
        const bytesWritten = await this.file.write(buffer, offset, length, position);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
        return { buffer, bytesWritten };
    }
    /**
     * Asynchronously writes data to a file, replacing the file if it already exists. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for writing.
     * It is unsafe to call `writeFile()` multiple times on the same file without waiting for the `Promise` to be resolved (or rejected).
     * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
     * @param _options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
     * - `encoding` defaults to `'utf8'`.
     * - `mode` defaults to `0o666`.
     * - `flag` defaults to `'w'`.
     */
    async writeFile(data, _options = {}) {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, 'utf8', 'w', 0o644);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isWriteable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed must allow for writing.');
        }
        if (typeof data != 'string' && !options.encoding) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Encoding not specified');
        }
        const encodedData = typeof data == 'string' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, options.encoding) : data;
        await this.file.write(encodedData, 0, encodedData.length, 0);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('change', this.file.path);
    }
    /**
     * Asynchronous close(2) - close a `FileHandle`.
     */
    async close() {
        await this.file.close();
        _shared_js__WEBPACK_IMPORTED_MODULE_11__.fdMap.delete(this.fd);
    }
    /**
     * Asynchronous `writev`. Writes from multiple buffers.
     * @param buffers An array of Uint8Array buffers.
     * @param position The position in the file where to begin writing.
     * @returns The number of bytes written.
     */
    async writev(buffers, position) {
        let bytesWritten = 0;
        for (const buffer of buffers) {
            bytesWritten += (await this.write(buffer, 0, buffer.length, position + bytesWritten)).bytesWritten;
        }
        return { bytesWritten, buffers };
    }
    /**
     * Asynchronous `readv`. Reads into multiple buffers.
     * @param buffers An array of Uint8Array buffers.
     * @param position The position in the file where to begin reading.
     * @returns The number of bytes read.
     */
    async readv(buffers, position) {
        let bytesRead = 0;
        for (const buffer of buffers) {
            bytesRead += (await this.read(buffer, 0, buffer.byteLength, position + bytesRead)).bytesRead;
        }
        return { bytesRead, buffers };
    }
    /**
     * Creates a stream for reading from the file.
     * @param options Options for the readable stream
     */
    createReadStream(options) {
        const stream = new _streams_js__WEBPACK_IMPORTED_MODULE_12__.ReadStream({
            highWaterMark: options?.highWaterMark || 64 * 1024,
            encoding: options.encoding,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            read: async (size) => {
                try {
                    const result = await this.read(new Uint8Array(size), 0, size, this.file.position);
                    stream.push(!result.bytesRead ? null : result.buffer.slice(0, result.bytesRead)); // Push data or null for EOF
                    this.file.position += result.bytesRead;
                }
                catch (error) {
                    stream.destroy(error);
                }
            },
        });
        stream.path = this.file.path;
        return stream;
    }
    /**
     * Creates a stream for writing to the file.
     * @param options Options for the writeable stream.
     */
    createWriteStream(options) {
        const streamOptions = {
            highWaterMark: options?.highWaterMark,
            encoding: options?.encoding,
            write: async (chunk, encoding, callback) => {
                try {
                    const { bytesWritten } = await this.write(chunk, null, encoding);
                    callback(bytesWritten == chunk.length ? null : new Error('Failed to write full chunk'));
                }
                catch (error) {
                    callback(error);
                }
            },
        };
        const stream = new _streams_js__WEBPACK_IMPORTED_MODULE_12__.WriteStream(streamOptions);
        stream.path = this.file.path;
        return stream;
    }
}
async function rename(oldPath, newPath) {
    oldPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(oldPath);
    newPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(newPath);
    const src = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(oldPath);
    const dst = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(newPath);
    if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(oldPath))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', oldPath, 'rename');
    }
    try {
        if (src.mountPoint == dst.mountPoint) {
            await src.fs.rename(src.path, dst.path);
            (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', oldPath.toString());
            return;
        }
        await writeFile(newPath, await readFile(oldPath));
        await unlink(oldPath);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', oldPath.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [src.path]: oldPath, [dst.path]: newPath });
    }
}
rename;
/**
 * Test whether or not `path` exists by checking with the file system.
 */
async function exists(path) {
    try {
        const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(await realpath(path));
        return await fs.exists(resolved);
    }
    catch (e) {
        if (e instanceof _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError && e.code == 'ENOENT') {
            return false;
        }
        throw e;
    }
}
async function stat(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(await realpath(path));
    try {
        const stats = await fs.stat(resolved);
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'stat');
        }
        return options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_4__.BigIntStats(stats) : stats;
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolved]: path });
    }
}
stat;
async function lstat(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    try {
        const stats = await fs.stat(resolved);
        return options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_4__.BigIntStats(stats) : stats;
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolved]: path });
    }
}
lstat;
// FILE-ONLY METHODS
async function truncate(path, len = 0) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_1, await open(path, 'r+'), true);
        await handle.truncate(len);
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        const result_1 = __disposeResources(env_1);
        if (result_1)
            await result_1;
    }
}
truncate;
async function unlink(path) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    try {
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await (_cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get(path) || fs.stat(resolved))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'unlink');
        }
        await fs.unlink(resolved);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', path.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolved]: path });
    }
}
unlink;
/**
 * Opens a file. This helper handles the complexity of file flags.
 * @internal
 */
async function _open(path, _flag, _mode = 0o644, resolveSymlinks) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const mode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeMode)(_mode, 0o644), flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(_flag);
    path = resolveSymlinks ? await realpath(path) : path;
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    const stats = await fs.stat(resolved).catch(() => null);
    if (!stats) {
        if ((!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isWriteable)(flag) && !(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isAppendable)(flag)) || flag == 'r+') {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, '_open');
        }
        // Create the file
        const parentStats = await fs.stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(resolved));
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !parentStats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(path), '_open');
        }
        if (!parentStats.isDirectory()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(path), '_open');
        }
        return new FileHandle(await fs.createFile(resolved, flag, mode));
    }
    if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !stats.hasAccess((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.flagToMode)(flag))) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', path, '_open');
    }
    if ((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isExclusive)(flag)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path, '_open');
    }
    const handle = new FileHandle(await fs.openFile(resolved, flag));
    /*
        In a previous implementation, we deleted the file and
        re-created it. However, this created a race condition if another
        asynchronous request was trying to read the file, as the file
        would not exist for a small period of time.
    */
    if ((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isTruncating)(flag)) {
        await handle.truncate(0);
    }
    return handle;
}
/**
 * Asynchronous file open.
 * @see http://www.manpagez.com/man/2/open/
 * @param flag Handles the complexity of the various file modes. See its API for more details.
 * @param mode Mode to use to open the file. Can be ignored if the filesystem doesn't support permissions.
 */
async function open(path, flag = 'r', mode = 0o644) {
    return await _open(path, flag, mode, true);
}
open;
async function readFile(path, _options) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, null, 'r', 0o644);
        const handle = __addDisposableResource(env_2, typeof path == 'object' && 'fd' in path ? path : await open(path, options.flag, options.mode), true);
        return await handle.readFile(options);
    }
    catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
    }
    finally {
        const result_2 = __disposeResources(env_2);
        if (result_2)
            await result_2;
    }
}
readFile;
/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 *
 * The encoding option is ignored if data is a buffer.
 * @option encoding Defaults to `'utf8'`.
 * @option mode Defaults to `0644`.
 * @option flag Defaults to `'w'`.
 */
async function writeFile(path, data, _options) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, 'utf8', 'w+', 0o644);
        const handle = __addDisposableResource(env_3, path instanceof FileHandle ? path : await open(path.toString(), options.flag, options.mode), true);
        const _data = typeof data == 'string' ? data : data;
        if (typeof _data != 'string' && !(_data instanceof Uint8Array)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Iterables and streams not supported', handle.file.path, 'writeFile');
        }
        await handle.writeFile(_data, options);
    }
    catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
    }
    finally {
        const result_3 = __disposeResources(env_3);
        if (result_3)
            await result_3;
    }
}
writeFile;
/**
 * Asynchronously append data to a file, creating the file if it not yet exists.
 * @option encoding Defaults to `'utf8'`.
 * @option mode Defaults to `0644`.
 * @option flag Defaults to `'a'`.
 */
async function appendFile(path, data, _options) {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeOptions)(_options, 'utf8', 'a', 0o644);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isAppendable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed to appendFile must allow for appending.');
        }
        if (typeof data != 'string' && !options.encoding) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Encoding not specified');
        }
        const encodedData = typeof data == 'string' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        const handle = __addDisposableResource(env_4, typeof path == 'object' && 'fd' in path ? path : await open(path, options.flag, options.mode), true);
        await handle.appendFile(encodedData, options);
    }
    catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
    }
    finally {
        const result_4 = __disposeResources(env_4);
        if (result_4)
            await result_4;
    }
}
appendFile;
// DIRECTORY-ONLY METHODS
async function rmdir(path) {
    path = await realpath(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    try {
        const stats = await (_cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get(path) || fs.stat(resolved));
        if (!stats) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'rmdir');
        }
        if (!stats.isDirectory()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', resolved, 'rmdir');
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'rmdir');
        }
        await fs.rmdir(resolved);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', path.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolved]: path });
    }
}
rmdir;
async function mkdir(path, options) {
    options = typeof options === 'object' ? options : { mode: options };
    const mode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizeMode)(options?.mode, 0o777);
    path = await realpath(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    const errorPaths = { [resolved]: path };
    try {
        if (!options?.recursive) {
            if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await fs.stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(resolved))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(resolved), 'mkdir');
            }
            await fs.mkdir(resolved, mode);
            (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', path.toString());
            return;
        }
        const dirs = [];
        for (let dir = resolved, origDir = path; !(await fs.exists(dir)); dir = (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(dir), origDir = (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(origDir)) {
            dirs.unshift(dir);
            errorPaths[dir] = origDir;
        }
        for (const dir of dirs) {
            if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await fs.stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(dir))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(dir), 'mkdir');
            }
            await fs.mkdir(dir, mode);
            (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', dir);
        }
        return dirs[0];
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, errorPaths);
    }
}
mkdir;
async function readdir(path, options) {
    options = typeof options === 'object' ? options : { encoding: options };
    path = await realpath(path);
    const handleError = (e) => {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolved]: path });
    };
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    const _stats = _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get(path) || fs.stat(resolved).catch(handleError);
    _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.set(path, _stats);
    const stats = await _stats;
    if (!stats) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, 'readdir');
    }
    if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.R_OK)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', path, 'readdir');
    }
    if (!stats.isDirectory()) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', path, 'readdir');
    }
    const entries = await fs.readdir(resolved).catch(handleError);
    const values = [];
    const addEntry = async (entry) => {
        let entryStats;
        if (options?.recursive || options?.withFileTypes) {
            const _entryStats = _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(path, entry)) || fs.stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(resolved, entry)).catch(handleError);
            _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.set((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(path, entry), _entryStats);
            entryStats = await _entryStats;
        }
        if (options?.withFileTypes) {
            values.push(new _dir_js__WEBPACK_IMPORTED_MODULE_9__.Dirent(entry, entryStats));
        }
        else if (options?.encoding == 'buffer') {
            values.push(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(entry));
        }
        else {
            values.push(entry);
        }
        if (!options?.recursive || !entryStats?.isDirectory())
            return;
        for (const subEntry of await readdir((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(path, entry), { ...options, _isIndirect: true })) {
            if (subEntry instanceof _dir_js__WEBPACK_IMPORTED_MODULE_9__.Dirent) {
                subEntry.path = (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(entry, subEntry.path);
                values.push(subEntry);
            }
            else if (buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.isBuffer(subEntry)) {
                // Convert Buffer to string, prefix with the full path
                values.push(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(entry, (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.decodeUTF8)(subEntry))));
            }
            else {
                values.push((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(entry, subEntry));
            }
        }
    };
    await Promise.all(entries.map(addEntry));
    if (!options?._isIndirect) {
        _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.clear();
    }
    return values;
}
readdir;
async function link(targetPath, linkPath) {
    targetPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(targetPath);
    linkPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(linkPath);
    const { fs, path } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(targetPath);
    const link = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(linkPath);
    if (fs != link.fs) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EXDEV', linkPath, 'link');
    }
    try {
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await fs.stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(targetPath))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(path), 'link');
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await stat((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(linkPath))).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.dirname)(linkPath), 'link');
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess && !(await fs.stat(path)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_8__.W_OK | _constants_js__WEBPACK_IMPORTED_MODULE_8__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', path, 'link');
        }
        return await fs.link(path, link.path);
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [link.path]: linkPath, [path]: targetPath });
    }
}
link;
/**
 * `symlink`.
 * @param target target path
 * @param path link path
 * @param type can be either `'dir'` or `'file'` (default is `'file'`)
 */
async function symlink(target, path, type = 'file') {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
        if (!['file', 'dir', 'junction'].includes(type)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid symlink type: ' + type);
        }
        if (await exists(path)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path.toString(), 'symlink');
        }
        const handle = __addDisposableResource(env_5, await _open(path, 'w+', 0o644, false), true);
        await handle.writeFile(target.toString());
        await handle.file._setType(_constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFLNK);
    }
    catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
    }
    finally {
        const result_5 = __disposeResources(env_5);
        if (result_5)
            await result_5;
    }
}
symlink;
async function readlink(path, options) {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_6, await _open((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path), 'r', 0o644, false), true);
        const value = await handle.readFile();
        const encoding = typeof options == 'object' ? options?.encoding : options;
        return encoding == 'buffer' ? value : value.toString(encoding);
    }
    catch (e_6) {
        env_6.error = e_6;
        env_6.hasError = true;
    }
    finally {
        const result_6 = __disposeResources(env_6);
        if (result_6)
            await result_6;
    }
}
readlink;
// PROPERTY OPERATIONS
async function chown(path, uid, gid) {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_7, await open(path, 'r+'), true);
        await handle.chown(uid, gid);
    }
    catch (e_7) {
        env_7.error = e_7;
        env_7.hasError = true;
    }
    finally {
        const result_7 = __disposeResources(env_7);
        if (result_7)
            await result_7;
    }
}
chown;
async function lchown(path, uid, gid) {
    const env_8 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_8, await _open(path, 'r+', 0o644, false), true);
        await handle.chown(uid, gid);
    }
    catch (e_8) {
        env_8.error = e_8;
        env_8.hasError = true;
    }
    finally {
        const result_8 = __disposeResources(env_8);
        if (result_8)
            await result_8;
    }
}
lchown;
async function chmod(path, mode) {
    const env_9 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_9, await open(path, 'r+'), true);
        await handle.chmod(mode);
    }
    catch (e_9) {
        env_9.error = e_9;
        env_9.hasError = true;
    }
    finally {
        const result_9 = __disposeResources(env_9);
        if (result_9)
            await result_9;
    }
}
chmod;
async function lchmod(path, mode) {
    const env_10 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_10, await _open(path, 'r+', 0o644, false), true);
        await handle.chmod(mode);
    }
    catch (e_10) {
        env_10.error = e_10;
        env_10.hasError = true;
    }
    finally {
        const result_10 = __disposeResources(env_10);
        if (result_10)
            await result_10;
    }
}
lchmod;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
async function utimes(path, atime, mtime) {
    const env_11 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_11, await open(path, 'r+'), true);
        await handle.utimes(atime, mtime);
    }
    catch (e_11) {
        env_11.error = e_11;
        env_11.hasError = true;
    }
    finally {
        const result_11 = __disposeResources(env_11);
        if (result_11)
            await result_11;
    }
}
utimes;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
async function lutimes(path, atime, mtime) {
    const env_12 = { stack: [], error: void 0, hasError: false };
    try {
        const handle = __addDisposableResource(env_12, await _open(path, 'r+', 0o644, false), true);
        await handle.utimes(new Date(atime), new Date(mtime));
    }
    catch (e_12) {
        env_12.error = e_12;
        env_12.hasError = true;
    }
    finally {
        const result_12 = __disposeResources(env_12);
        if (result_12)
            await result_12;
    }
}
lutimes;
async function realpath(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const { base, dir } = (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.parse)(path);
    const lpath = (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(dir == '/' ? '/' : await (_cache_js__WEBPACK_IMPORTED_MODULE_6__.paths.get(dir) || realpath(dir)), base);
    const { fs, path: resolvedPath, mountPoint } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(lpath);
    try {
        const _stats = _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get(lpath) || fs.stat(resolvedPath);
        _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.set(lpath, _stats);
        if (!(await _stats).isSymbolicLink()) {
            return lpath;
        }
        const target = mountPoint + (await readlink(lpath));
        return await (_cache_js__WEBPACK_IMPORTED_MODULE_6__.paths.get(target) || realpath(target));
    }
    catch (e) {
        if (e.code == 'ENOENT') {
            return path;
        }
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.fixError)(e, { [resolvedPath]: lpath });
    }
}
realpath;
function watch(filename, options = {}) {
    return {
        [Symbol.asyncIterator]() {
            const watcher = new _watchers_js__WEBPACK_IMPORTED_MODULE_13__.FSWatcher(filename.toString(), typeof options !== 'string' ? options : { encoding: options });
            // A queue to hold change events, since we need to resolve them in the async iterator
            const eventQueue = [];
            watcher.on('change', (eventType, filename) => {
                eventQueue.shift()?.({ value: { eventType, filename }, done: false });
            });
            function cleanup() {
                watcher.close();
                for (const resolve of eventQueue) {
                    resolve({ value: null, done: true });
                }
                eventQueue.length = 0; // Clear the queue
                return Promise.resolve({ value: null, done: true });
            }
            return {
                async next() {
                    const { promise, resolve } = Promise.withResolvers();
                    eventQueue.push(resolve);
                    return promise;
                },
                return: cleanup,
                throw: cleanup,
            };
        },
    };
}
watch;
async function access(path, mode = _constants_js__WEBPACK_IMPORTED_MODULE_8__.F_OK) {
    if (!_config_js__WEBPACK_IMPORTED_MODULE_7__.config.checkAccess)
        return;
    const stats = await stat(path);
    if (!stats.hasAccess(mode)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EACCES);
    }
}
access;
/**
 * Asynchronous `rm`. Removes files or directories (recursively).
 * @param path The path to the file or directory to remove.
 */
async function rm(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const stats = await (_cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.get(path) ||
        stat(path).catch((error) => {
            if (error.code == 'ENOENT' && options?.force)
                return undefined;
            throw error;
        }));
    if (!stats) {
        return;
    }
    _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.setSync(path, stats);
    switch (stats.mode & _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFMT) {
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFDIR:
            if (options?.recursive) {
                for (const entry of await readdir(path, { _isIndirect: true })) {
                    await rm((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(path, entry), { ...options, _isIndirect: true });
                }
            }
            await rmdir(path);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFREG:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFLNK:
            await unlink(path);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFBLK:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFCHR:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFIFO:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFSOCK:
        default:
            _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.clear();
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EPERM, 'File type not supported', path, 'rm');
    }
    if (!options?._isIndirect) {
        _cache_js__WEBPACK_IMPORTED_MODULE_6__.stats.clear();
    }
}
rm;
async function mkdtemp(prefix, options) {
    const encoding = typeof options === 'object' ? options?.encoding : options || 'utf8';
    const fsName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const resolvedPath = '/tmp/' + fsName;
    await mkdir(resolvedPath);
    return encoding == 'buffer' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(resolvedPath) : resolvedPath;
}
mkdtemp;
/**
 * Asynchronous `copyFile`. Copies a file.
 * @param src The source file.
 * @param dest The destination file.
 * @param mode Optional flags for the copy operation. Currently supports these flags:
 *    * `fs.constants.COPYFILE_EXCL`: If the destination file already exists, the operation fails.
 */
async function copyFile(src, dest, mode) {
    src = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(src);
    dest = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(dest);
    if (mode && mode & _constants_js__WEBPACK_IMPORTED_MODULE_8__.COPYFILE_EXCL && (await exists(dest))) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EEXIST, 'Destination file already exists.', dest, 'copyFile');
    }
    await writeFile(dest, await readFile(src));
    (0,_watchers_js__WEBPACK_IMPORTED_MODULE_13__.emitChange)('rename', dest.toString());
}
copyFile;
/**
 * Asynchronous `opendir`. Opens a directory.
 * @param path The path to the directory.
 * @param options Options for opening the directory.
 * @returns A `Dir` object representing the opened directory.
 * @todo Use options
 */
function opendir(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    return Promise.resolve(new _dir_js__WEBPACK_IMPORTED_MODULE_9__.Dir(path));
}
opendir;
/**
 * Asynchronous `cp`. Recursively copies a file or directory.
 * @param source The source file or directory.
 * @param destination The destination file or directory.
 * @param opts Options for the copy operation. Currently supports these options from Node.js 'fs.await cp':
 *   * `dereference`: Dereference symbolic links.
 *   * `errorOnExist`: Throw an error if the destination file or directory already exists.
 *   * `filter`: A function that takes a source and destination path and returns a boolean, indicating whether to copy `source` element.
 *   * `force`: Overwrite the destination if it exists, and overwrite existing readonly destination files.
 *   * `preserveTimestamps`: Preserve file timestamps.
 *   * `recursive`: If `true`, copies directories recursively.
 */
async function cp(source, destination, opts) {
    source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(source);
    destination = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(destination);
    const srcStats = await lstat(source); // Use lstat to follow symlinks if not dereferencing
    if (opts?.errorOnExist && (await exists(destination))) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EEXIST, 'Destination file or directory already exists.', destination, 'cp');
    }
    switch (srcStats.mode & _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFMT) {
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFDIR: {
            if (!opts?.recursive) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EISDIR, source + ' is a directory (not copied)', source, 'cp');
            }
            const [entries] = await Promise.all([readdir(source, { withFileTypes: true }), mkdir(destination, { recursive: true })] // Ensure the destination directory exists
            );
            const _cp = async (dirent) => {
                if (opts.filter && !opts.filter((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(source, dirent.name), (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(destination, dirent.name))) {
                    return; // Skip if the filter returns false
                }
                await cp((0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(source, dirent.name), (0,_path_js__WEBPACK_IMPORTED_MODULE_10__.join)(destination, dirent.name), opts);
            };
            await Promise.all(entries.map(_cp));
            break;
        }
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFREG:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFLNK:
            await copyFile(source, destination);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFBLK:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFCHR:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFIFO:
        case _constants_js__WEBPACK_IMPORTED_MODULE_8__.S_IFSOCK:
        default:
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EPERM, 'File type not supported', source, 'rm');
    }
    // Optionally preserve timestamps
    if (opts?.preserveTimestamps) {
        await utimes(destination, srcStats.atime, srcStats.mtime);
    }
}
cp;
function statfs(path, opts) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.normalizePath)(path);
    const { fs } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_11__.resolveMount)(path);
    return Promise.resolve((0,_shared_js__WEBPACK_IMPORTED_MODULE_11__._statfs)(fs, opts?.bigint));
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/shared.js":
/*!***************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/shared.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _statfs: () => (/* binding */ _statfs),
/* harmony export */   _synced: () => (/* binding */ _synced),
/* harmony export */   fd2file: () => (/* binding */ fd2file),
/* harmony export */   fdMap: () => (/* binding */ fdMap),
/* harmony export */   file2fd: () => (/* binding */ file2fd),
/* harmony export */   fixError: () => (/* binding */ fixError),
/* harmony export */   fixPaths: () => (/* binding */ fixPaths),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   mountObject: () => (/* binding */ mountObject),
/* harmony export */   mounts: () => (/* binding */ mounts),
/* harmony export */   resolveMount: () => (/* binding */ resolveMount),
/* harmony export */   umount: () => (/* binding */ umount)
/* harmony export */ });
/* harmony import */ var _backends_memory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../backends/memory.js */ "./src/node_modules/@zenfs/core/dist/backends/memory.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
// Utilities and shared data





// descriptors
const fdMap = new Map();
let nextFd = 100;
function file2fd(file) {
    const fd = nextFd++;
    fdMap.set(fd, file);
    return fd;
}
function fd2file(fd) {
    if (!fdMap.has(fd)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EBADF);
    }
    return fdMap.get(fd);
}
/**
 * The map of mount points
 * @internal
 */
const mounts = new Map();
// Set a default root.
mount('/', _backends_memory_js__WEBPACK_IMPORTED_MODULE_0__.InMemory.create({ name: 'root' }));
/**
 * Mounts the file system at `mountPoint`.
 */
function mount(mountPoint, fs) {
    if (mountPoint[0] !== '/') {
        mountPoint = '/' + mountPoint;
    }
    mountPoint = (0,_path_js__WEBPACK_IMPORTED_MODULE_3__.resolve)(mountPoint);
    if (mounts.has(mountPoint)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Mount point ' + mountPoint + ' is already in use.');
    }
    mounts.set(mountPoint, fs);
}
/**
 * Unmounts the file system at `mountPoint`.
 */
function umount(mountPoint) {
    if (mountPoint[0] !== '/') {
        mountPoint = '/' + mountPoint;
    }
    mountPoint = (0,_path_js__WEBPACK_IMPORTED_MODULE_3__.resolve)(mountPoint);
    if (!mounts.has(mountPoint)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Mount point ' + mountPoint + ' is already unmounted.');
    }
    mounts.delete(mountPoint);
}
/**
 * Gets the internal `FileSystem` for the path, then returns it along with the path relative to the FS' root
 */
function resolveMount(path) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.normalizePath)(path);
    const sortedMounts = [...mounts].sort((a, b) => (a[0].length > b[0].length ? -1 : 1)); // descending order of the string length
    for (const [mountPoint, fs] of sortedMounts) {
        // We know path is normalized, so it would be a substring of the mount point.
        if (mountPoint.length <= path.length && path.startsWith(mountPoint)) {
            path = path.slice(mountPoint.length > 1 ? mountPoint.length : 0); // Resolve the path relative to the mount point
            if (path === '') {
                path = '/';
            }
            return { fs, path, mountPoint };
        }
    }
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EIO, 'ZenFS not initialized with a file system');
}
/**
 * Wait for all file systems to be ready and synced.
 * May be removed at some point.
 * @experimental @internal
 */
async function _synced() {
    await Promise.all([...mounts.values()].map(m => m.ready()));
    return;
}
/**
 * Reverse maps the paths in text from the mounted FileSystem to the global path
 * @hidden
 */
function fixPaths(text, paths) {
    for (const [from, to] of Object.entries(paths)) {
        text = text?.replaceAll(from, to);
    }
    return text;
}
/**
 * Fix paths in error stacks
 * @hidden
 */
function fixError(e, paths) {
    if (typeof e.stack == 'string') {
        e.stack = fixPaths(e.stack, paths);
    }
    try {
        e.message = fixPaths(e.message, paths);
    }
    catch { }
    return e;
}
/**
 * @deprecated
 */
function mountObject(mounts) {
    if ('/' in mounts) {
        umount('/');
    }
    for (const [point, fs] of Object.entries(mounts)) {
        mount(point, fs);
    }
}
/**
 * @hidden
 */
function _statfs(fs, bigint) {
    const md = fs.metadata();
    const bs = md.blockSize || 4096;
    return {
        type: (bigint ? BigInt : Number)(md.type),
        bsize: (bigint ? BigInt : Number)(bs),
        ffree: (bigint ? BigInt : Number)(md.freeNodes || _constants_js__WEBPACK_IMPORTED_MODULE_4__.size_max),
        files: (bigint ? BigInt : Number)(md.totalNodes || _constants_js__WEBPACK_IMPORTED_MODULE_4__.size_max),
        bavail: (bigint ? BigInt : Number)(md.freeSpace / bs),
        bfree: (bigint ? BigInt : Number)(md.freeSpace / bs),
        blocks: (bigint ? BigInt : Number)(md.totalSpace / bs),
    };
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/streams.js":
/*!****************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/streams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReadStream: () => (/* binding */ ReadStream),
/* harmony export */   WriteStream: () => (/* binding */ WriteStream)
/* harmony export */ });
/* harmony import */ var readable_stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! readable-stream */ "./src/node_modules/readable-stream/lib/ours/browser.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");


class ReadStream extends readable_stream__WEBPACK_IMPORTED_MODULE_0__.Readable {
    close(callback = () => null) {
        try {
            super.destroy();
            super.emit('close');
            callback();
        }
        catch (err) {
            callback(new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EIO, err.toString()));
        }
    }
}
class WriteStream extends readable_stream__WEBPACK_IMPORTED_MODULE_0__.Writable {
    close(callback = () => null) {
        try {
            super.destroy();
            super.emit('close');
            callback();
        }
        catch (err) {
            callback(new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EIO, err.toString()));
        }
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/sync.js":
/*!*************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/sync.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   accessSync: () => (/* binding */ accessSync),
/* harmony export */   appendFileSync: () => (/* binding */ appendFileSync),
/* harmony export */   chmodSync: () => (/* binding */ chmodSync),
/* harmony export */   chownSync: () => (/* binding */ chownSync),
/* harmony export */   closeSync: () => (/* binding */ closeSync),
/* harmony export */   copyFileSync: () => (/* binding */ copyFileSync),
/* harmony export */   cpSync: () => (/* binding */ cpSync),
/* harmony export */   existsSync: () => (/* binding */ existsSync),
/* harmony export */   fchmodSync: () => (/* binding */ fchmodSync),
/* harmony export */   fchownSync: () => (/* binding */ fchownSync),
/* harmony export */   fdatasyncSync: () => (/* binding */ fdatasyncSync),
/* harmony export */   fstatSync: () => (/* binding */ fstatSync),
/* harmony export */   fsyncSync: () => (/* binding */ fsyncSync),
/* harmony export */   ftruncateSync: () => (/* binding */ ftruncateSync),
/* harmony export */   futimesSync: () => (/* binding */ futimesSync),
/* harmony export */   lchmodSync: () => (/* binding */ lchmodSync),
/* harmony export */   lchownSync: () => (/* binding */ lchownSync),
/* harmony export */   linkSync: () => (/* binding */ linkSync),
/* harmony export */   lopenSync: () => (/* binding */ lopenSync),
/* harmony export */   lstatSync: () => (/* binding */ lstatSync),
/* harmony export */   lutimesSync: () => (/* binding */ lutimesSync),
/* harmony export */   mkdirSync: () => (/* binding */ mkdirSync),
/* harmony export */   mkdtempSync: () => (/* binding */ mkdtempSync),
/* harmony export */   openSync: () => (/* binding */ openSync),
/* harmony export */   opendirSync: () => (/* binding */ opendirSync),
/* harmony export */   readFileSync: () => (/* binding */ readFileSync),
/* harmony export */   readSync: () => (/* binding */ readSync),
/* harmony export */   readdirSync: () => (/* binding */ readdirSync),
/* harmony export */   readlinkSync: () => (/* binding */ readlinkSync),
/* harmony export */   readvSync: () => (/* binding */ readvSync),
/* harmony export */   realpathSync: () => (/* binding */ realpathSync),
/* harmony export */   renameSync: () => (/* binding */ renameSync),
/* harmony export */   rmSync: () => (/* binding */ rmSync),
/* harmony export */   rmdirSync: () => (/* binding */ rmdirSync),
/* harmony export */   statSync: () => (/* binding */ statSync),
/* harmony export */   statfsSync: () => (/* binding */ statfsSync),
/* harmony export */   symlinkSync: () => (/* binding */ symlinkSync),
/* harmony export */   truncateSync: () => (/* binding */ truncateSync),
/* harmony export */   unlinkSync: () => (/* binding */ unlinkSync),
/* harmony export */   utimesSync: () => (/* binding */ utimesSync),
/* harmony export */   writeFileSync: () => (/* binding */ writeFileSync),
/* harmony export */   writeSync: () => (/* binding */ writeSync),
/* harmony export */   writevSync: () => (/* binding */ writevSync)
/* harmony export */ });
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer */ "./src/node_modules/buffer/index.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _cache_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cache.js */ "./src/node_modules/@zenfs/core/dist/emulation/cache.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.js */ "./src/node_modules/@zenfs/core/dist/emulation/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _dir_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dir.js */ "./src/node_modules/@zenfs/core/dist/emulation/dir.js");
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shared.js */ "./src/node_modules/@zenfs/core/dist/emulation/shared.js");
/* harmony import */ var _watchers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./watchers.js */ "./src/node_modules/@zenfs/core/dist/emulation/watchers.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});












function renameSync(oldPath, newPath) {
    oldPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(oldPath);
    newPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(newPath);
    const oldMount = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(oldPath);
    const newMount = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(newPath);
    if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(oldPath)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', oldPath, 'rename');
    }
    try {
        if (oldMount === newMount) {
            oldMount.fs.renameSync(oldMount.path, newMount.path);
            (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', oldPath.toString());
            return;
        }
        writeFileSync(newPath, readFileSync(oldPath));
        unlinkSync(oldPath);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', oldPath.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [oldMount.path]: oldPath, [newMount.path]: newPath });
    }
}
renameSync;
/**
 * Test whether or not `path` exists by checking with the file system.
 */
function existsSync(path) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    try {
        const { fs, path: resolvedPath } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(realpathSync(path));
        return fs.existsSync(resolvedPath);
    }
    catch (e) {
        if (e.errno == _error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.ENOENT) {
            return false;
        }
        throw e;
    }
}
existsSync;
function statSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(realpathSync(path));
    try {
        const stats = fs.statSync(resolved);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'stat');
        }
        return options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_3__.BigIntStats(stats) : stats;
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolved]: path });
    }
}
statSync;
function lstatSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(path);
    try {
        const stats = fs.statSync(resolved);
        return options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_3__.BigIntStats(stats) : stats;
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolved]: path });
    }
}
lstatSync;
function truncateSync(path, len = 0) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const file = __addDisposableResource(env_1, _openSync(path, 'r+'), false);
        len || (len = 0);
        if (len < 0) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL);
        }
        file.truncateSync(len);
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
}
truncateSync;
function unlinkSync(path) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(path);
    try {
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !(_cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.getSync(path) || fs.statSync(resolved)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'unlink');
        }
        fs.unlinkSync(resolved);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', path.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolved]: path });
    }
}
unlinkSync;
function _openSync(path, _flag, _mode, resolveSymlinks = true) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const mode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeMode)(_mode, 0o644), flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(_flag);
    path = resolveSymlinks ? realpathSync(path) : path;
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(path);
    let stats;
    try {
        stats = fs.statSync(resolved);
    }
    catch {
        // nothing
    }
    if (!stats) {
        if ((!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isWriteable)(flag) && !(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isAppendable)(flag)) || flag == 'r+') {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOENT', path, '_open');
        }
        // Create the file
        const parentStats = fs.statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(resolved));
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !parentStats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(path), '_open');
        }
        if (!parentStats.isDirectory()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(path), '_open');
        }
        return fs.createFileSync(resolved, flag, mode);
    }
    if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && (!stats.hasAccess(mode) || !stats.hasAccess((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.flagToMode)(flag)))) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', path, '_open');
    }
    if ((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isExclusive)(flag)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path, '_open');
    }
    const file = fs.openFileSync(resolved, flag);
    if ((0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isTruncating)(flag)) {
        file.truncateSync(0);
    }
    return file;
}
/**
 * Synchronous file open.
 * @see http://www.manpagez.com/man/2/open/
 */
function openSync(path, flag, mode = _constants_js__WEBPACK_IMPORTED_MODULE_7__.F_OK) {
    return (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.file2fd)(_openSync(path, flag, mode, true));
}
openSync;
/**
 * Opens a file or symlink
 * @internal
 */
function lopenSync(path, flag, mode) {
    return (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.file2fd)(_openSync(path, flag, mode, false));
}
function _readFileSync(fname, flag, resolveSymlinks) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
        // Get file.
        const file = __addDisposableResource(env_2, _openSync(fname, flag, 0o644, resolveSymlinks), false);
        const stat = file.statSync();
        // Allocate buffer.
        const data = new Uint8Array(stat.size);
        file.readSync(data, 0, stat.size, 0);
        return data;
    }
    catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
    }
    finally {
        __disposeResources(env_2);
    }
}
function readFileSync(path, _options = {}) {
    const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeOptions)(_options, null, 'r', 0o644);
    const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
    if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isReadable)(flag)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed to readFile must allow for reading.');
    }
    const data = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(_readFileSync(typeof path == 'number' ? (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(path).path : path.toString(), options.flag, true));
    return options.encoding ? data.toString(options.encoding) : data;
}
readFileSync;
function writeFileSync(path, data, _options = {}) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeOptions)(_options, 'utf8', 'w+', 0o644);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isWriteable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed to writeFile must allow for writing.');
        }
        if (typeof data != 'string' && !options.encoding) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Encoding not specified');
        }
        const encodedData = typeof data == 'string' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        if (!encodedData) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Data not specified');
        }
        const file = __addDisposableResource(env_3, _openSync(typeof path == 'number' ? (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(path).path : path.toString(), flag, options.mode, true), false);
        file.writeSync(encodedData, 0, encodedData.byteLength, 0);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('change', path.toString());
    }
    catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
    }
    finally {
        __disposeResources(env_3);
    }
}
writeFileSync;
/**
 * Asynchronously append data to a file, creating the file if it not yet exists.
 * @option encoding Defaults to `'utf8'`.
 * @option mode Defaults to `0644`.
 * @option flag Defaults to `'a+'`.
 */
function appendFileSync(filename, data, _options = {}) {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
        const options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeOptions)(_options, 'utf8', 'a+', 0o644);
        const flag = (0,_file_js__WEBPACK_IMPORTED_MODULE_2__.parseFlag)(options.flag);
        if (!(0,_file_js__WEBPACK_IMPORTED_MODULE_2__.isAppendable)(flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Flag passed to appendFile must allow for appending.');
        }
        if (typeof data != 'string' && !options.encoding) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Encoding not specified');
        }
        const encodedData = typeof data == 'string' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        const file = __addDisposableResource(env_4, _openSync(typeof filename == 'number' ? (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(filename).path : filename.toString(), flag, options.mode, true), false);
        file.writeSync(encodedData, 0, encodedData.byteLength);
    }
    catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
    }
    finally {
        __disposeResources(env_4);
    }
}
appendFileSync;
function fstatSync(fd, options) {
    const stats = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).statSync();
    return options?.bigint ? new _stats_js__WEBPACK_IMPORTED_MODULE_3__.BigIntStats(stats) : stats;
}
fstatSync;
function closeSync(fd) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).closeSync();
    _shared_js__WEBPACK_IMPORTED_MODULE_10__.fdMap.delete(fd);
}
closeSync;
function ftruncateSync(fd, len = 0) {
    len || (len = 0);
    if (len < 0) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL);
    }
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).truncateSync(len);
}
ftruncateSync;
function fsyncSync(fd) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).syncSync();
}
fsyncSync;
function fdatasyncSync(fd) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).datasyncSync();
}
fdatasyncSync;
function writeSync(fd, data, posOrOff, lenOrEnc, pos) {
    let buffer, offset, length, position;
    if (typeof data === 'string') {
        // Signature 1: (fd, string, [position?, [encoding?]])
        position = typeof posOrOff === 'number' ? posOrOff : null;
        const encoding = typeof lenOrEnc === 'string' ? lenOrEnc : 'utf8';
        offset = 0;
        buffer = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(data, encoding);
        length = buffer.byteLength;
    }
    else {
        // Signature 2: (fd, buffer, offset, length, position?)
        buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        offset = posOrOff;
        length = lenOrEnc;
        position = typeof pos === 'number' ? pos : null;
    }
    const file = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd);
    position ?? (position = file.position);
    const bytesWritten = file.writeSync(buffer, offset, length, position);
    (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('change', file.path);
    return bytesWritten;
}
writeSync;
/**
 * Read data from the file specified by `fd`.
 * @param buffer The buffer that the data will be written to.
 * @param offset The offset within the buffer where writing will start.
 * @param length An integer specifying the number of bytes to read.
 * @param position An integer specifying where to begin reading from in the file.
 * If position is null, data will be read from the current file position.
 */
function readSync(fd, buffer, options, length, position) {
    const file = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd);
    const offset = typeof options == 'object' ? options.offset : options;
    if (typeof options == 'object') {
        length = options.length;
        position = options.position;
    }
    position = Number(position);
    if (isNaN(position)) {
        position = file.position;
    }
    return file.readSync(buffer, offset, length, position);
}
readSync;
function fchownSync(fd, uid, gid) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).chownSync(uid, gid);
}
fchownSync;
function fchmodSync(fd, mode) {
    const numMode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeMode)(mode, -1);
    if (numMode < 0) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, `Invalid mode.`);
    }
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).chmodSync(numMode);
}
fchmodSync;
/**
 * Change the file timestamps of a file referenced by the supplied file descriptor.
 */
function futimesSync(fd, atime, mtime) {
    (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd).utimesSync((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeTime)(atime), (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeTime)(mtime));
}
futimesSync;
function rmdirSync(path) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(realpathSync(path));
    try {
        const stats = _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.getSync(path) || fs.statSync(resolved);
        if (!stats.isDirectory()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', resolved, 'rmdir');
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'rmdir');
        }
        fs.rmdirSync(resolved);
        (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', path.toString());
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolved]: path });
    }
}
rmdirSync;
function mkdirSync(path, options) {
    options = typeof options === 'object' ? options : { mode: options };
    const mode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeMode)(options?.mode, 0o777);
    path = realpathSync(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(path);
    const errorPaths = { [resolved]: path };
    try {
        if (!options?.recursive) {
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !fs.statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(resolved)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(resolved), 'mkdir');
            }
            return fs.mkdirSync(resolved, mode);
        }
        const dirs = [];
        for (let dir = resolved, original = path; !fs.existsSync(dir); dir = (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(dir), original = (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(original)) {
            dirs.unshift(dir);
            errorPaths[dir] = original;
        }
        for (const dir of dirs) {
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !fs.statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(dir)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
                throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(dir), 'mkdir');
            }
            fs.mkdirSync(dir, mode);
            (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', dir);
        }
        return dirs[0];
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, errorPaths);
    }
}
mkdirSync;
function readdirSync(path, options) {
    options = typeof options === 'object' ? options : { encoding: options };
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs, path: resolved } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(realpathSync(path));
    let entries;
    try {
        const stats = _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.getSync(path) || fs.statSync(resolved);
        _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.setSync(path, stats);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !stats.hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.R_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', resolved, 'readdir');
        }
        if (!stats.isDirectory()) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOTDIR', resolved, 'readdir');
        }
        entries = fs.readdirSync(resolved);
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolved]: path });
    }
    // Iterate over entries and handle recursive case if needed
    const values = [];
    for (const entry of entries) {
        const entryStat = _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.getSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(path, entry)) || fs.statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(resolved, entry));
        _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.setSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(path, entry), entryStat);
        if (options?.withFileTypes) {
            values.push(new _dir_js__WEBPACK_IMPORTED_MODULE_8__.Dirent(entry, entryStat));
        }
        else if (options?.encoding == 'buffer') {
            values.push(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(entry));
        }
        else {
            values.push(entry);
        }
        if (!entryStat.isDirectory() || !options?.recursive)
            continue;
        for (const subEntry of readdirSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(path, entry), { ...options, _isIndirect: true })) {
            if (subEntry instanceof _dir_js__WEBPACK_IMPORTED_MODULE_8__.Dirent) {
                subEntry.path = (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(entry, subEntry.path);
                values.push(subEntry);
            }
            else if (buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.isBuffer(subEntry)) {
                values.push(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(entry, (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.decodeUTF8)(subEntry))));
            }
            else {
                values.push((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(entry, subEntry));
            }
        }
    }
    if (!options?._isIndirect) {
        _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.clearSync();
    }
    return values;
}
readdirSync;
// SYMLINK METHODS
function linkSync(targetPath, linkPath) {
    targetPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(targetPath);
    if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(targetPath)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.R_OK)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(targetPath), 'link');
    }
    linkPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(linkPath);
    if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !statSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(linkPath)).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.dirname)(linkPath), 'link');
    }
    const { fs, path } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(targetPath);
    const link = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(linkPath);
    if (fs != link.fs) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EXDEV', linkPath, 'link');
    }
    try {
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess && !fs.statSync(path).hasAccess(_constants_js__WEBPACK_IMPORTED_MODULE_7__.W_OK)) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EACCES', path, 'link');
        }
        return fs.linkSync(path, linkPath);
    }
    catch (e) {
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [path]: targetPath, [link.path]: linkPath });
    }
}
linkSync;
/**
 * Synchronous `symlink`.
 * @param target target path
 * @param path link path
 * @param type can be either `'dir'` or `'file'` (default is `'file'`)
 */
function symlinkSync(target, path, type = 'file') {
    if (!['file', 'dir', 'junction'].includes(type)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid type: ' + type);
    }
    if (existsSync(path)) {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('EEXIST', path.toString(), 'symlink');
    }
    writeFileSync(path, target.toString());
    const file = _openSync(path, 'r+', 0o644, false);
    file._setTypeSync(_constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFLNK);
}
symlinkSync;
function readlinkSync(path, options) {
    const value = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(_readFileSync(path.toString(), 'r', false));
    const encoding = typeof options == 'object' ? options?.encoding : options;
    if (encoding == 'buffer') {
        return value;
    }
    return value.toString(encoding);
}
readlinkSync;
// PROPERTY OPERATIONS
function chownSync(path, uid, gid) {
    const fd = openSync(path, 'r+');
    fchownSync(fd, uid, gid);
    closeSync(fd);
}
chownSync;
function lchownSync(path, uid, gid) {
    const fd = lopenSync(path, 'r+');
    fchownSync(fd, uid, gid);
    closeSync(fd);
}
lchownSync;
function chmodSync(path, mode) {
    const fd = openSync(path, 'r+');
    fchmodSync(fd, mode);
    closeSync(fd);
}
chmodSync;
function lchmodSync(path, mode) {
    const fd = lopenSync(path, 'r+');
    fchmodSync(fd, mode);
    closeSync(fd);
}
lchmodSync;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
function utimesSync(path, atime, mtime) {
    const fd = openSync(path, 'r+');
    futimesSync(fd, atime, mtime);
    closeSync(fd);
}
utimesSync;
/**
 * Change file timestamps of the file referenced by the supplied path.
 */
function lutimesSync(path, atime, mtime) {
    const fd = lopenSync(path, 'r+');
    futimesSync(fd, atime, mtime);
    closeSync(fd);
}
lutimesSync;
function realpathSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { base, dir } = (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.parse)(path);
    const lpath = (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(dir == '/' ? '/' : _cache_js__WEBPACK_IMPORTED_MODULE_5__.paths.getSync(dir) || realpathSync(dir), base);
    const { fs, path: resolvedPath, mountPoint } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(lpath);
    try {
        const stats = fs.statSync(resolvedPath);
        if (!stats.isSymbolicLink()) {
            return lpath;
        }
        const target = mountPoint + readlinkSync(lpath, options).toString();
        return _cache_js__WEBPACK_IMPORTED_MODULE_5__.paths.getSync(target) || realpathSync(target);
    }
    catch (e) {
        if (e.code == 'ENOENT') {
            return path;
        }
        throw (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fixError)(e, { [resolvedPath]: lpath });
    }
}
realpathSync;
function accessSync(path, mode = 0o600) {
    if (!_config_js__WEBPACK_IMPORTED_MODULE_6__.config.checkAccess)
        return;
    if (!statSync(path).hasAccess(mode)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EACCES);
    }
}
accessSync;
/**
 * Synchronous `rm`. Removes files or directories (recursively).
 * @param path The path to the file or directory to remove.
 */
function rmSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    let stats;
    try {
        stats = _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.getSync(path) || statSync(path);
    }
    catch (error) {
        if (error.code != 'ENOENT' || !options?.force)
            throw error;
    }
    if (!stats) {
        return;
    }
    _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.setSync(path, stats);
    switch (stats.mode & _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFMT) {
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFDIR:
            if (options?.recursive) {
                for (const entry of readdirSync(path, { _isIndirect: true })) {
                    rmSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(path, entry), { ...options, _isIndirect: true });
                }
            }
            rmdirSync(path);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFREG:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFLNK:
            unlinkSync(path);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFBLK:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFCHR:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFIFO:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFSOCK:
        default:
            _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.clearSync();
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EPERM, 'File type not supported', path, 'rm');
    }
    if (!options?._isIndirect) {
        _cache_js__WEBPACK_IMPORTED_MODULE_5__.stats.clearSync();
    }
}
rmSync;
function mkdtempSync(prefix, options) {
    const encoding = typeof options === 'object' ? options?.encoding : options || 'utf8';
    const fsName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const resolvedPath = '/tmp/' + fsName;
    mkdirSync(resolvedPath);
    return encoding == 'buffer' ? buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(resolvedPath) : resolvedPath;
}
mkdtempSync;
/**
 * Synchronous `copyFile`. Copies a file.
 * @param flags Optional flags for the copy operation. Currently supports these flags:
 * - `fs.constants.COPYFILE_EXCL`: If the destination file already exists, the operation fails.
 */
function copyFileSync(source, destination, flags) {
    source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(source);
    destination = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(destination);
    if (flags && flags & _constants_js__WEBPACK_IMPORTED_MODULE_7__.COPYFILE_EXCL && existsSync(destination)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EEXIST, 'Destination file already exists.', destination, 'copyFile');
    }
    writeFileSync(destination, readFileSync(source));
    (0,_watchers_js__WEBPACK_IMPORTED_MODULE_11__.emitChange)('rename', destination.toString());
}
copyFileSync;
/**
 * Synchronous `readv`. Reads from a file descriptor into multiple buffers.
 * @param fd The file descriptor.
 * @param buffers An array of Uint8Array buffers.
 * @param position The position in the file where to begin reading.
 * @returns The number of bytes read.
 */
function readvSync(fd, buffers, position) {
    const file = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd);
    let bytesRead = 0;
    for (const buffer of buffers) {
        bytesRead += file.readSync(buffer, 0, buffer.byteLength, position + bytesRead);
    }
    return bytesRead;
}
readvSync;
/**
 * Synchronous `writev`. Writes from multiple buffers into a file descriptor.
 * @param fd The file descriptor.
 * @param buffers An array of Uint8Array buffers.
 * @param position The position in the file where to begin writing.
 * @returns The number of bytes written.
 */
function writevSync(fd, buffers, position) {
    const file = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.fd2file)(fd);
    let bytesWritten = 0;
    for (const buffer of buffers) {
        bytesWritten += file.writeSync(new Uint8Array(buffer.buffer), 0, buffer.byteLength, position + bytesWritten);
    }
    return bytesWritten;
}
writevSync;
/**
 * Synchronous `opendir`. Opens a directory.
 * @param path The path to the directory.
 * @param options Options for opening the directory.
 * @returns A `Dir` object representing the opened directory.
 * @todo Handle options
 */
function opendirSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    return new _dir_js__WEBPACK_IMPORTED_MODULE_8__.Dir(path);
}
opendirSync;
/**
 * Synchronous `cp`. Recursively copies a file or directory.
 * @param source The source file or directory.
 * @param destination The destination file or directory.
 * @param opts Options for the copy operation. Currently supports these options from Node.js 'fs.cpSync':
 * - `dereference`: Dereference symbolic links. *(unconfirmed)*
 * - `errorOnExist`: Throw an error if the destination file or directory already exists.
 * - `filter`: A function that takes a source and destination path and returns a boolean, indicating whether to copy `source` element.
 * - `force`: Overwrite the destination if it exists, and overwrite existing readonly destination files. *(unconfirmed)*
 * - `preserveTimestamps`: Preserve file timestamps.
 * - `recursive`: If `true`, copies directories recursively.
 */
function cpSync(source, destination, opts) {
    source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(source);
    destination = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(destination);
    const srcStats = lstatSync(source); // Use lstat to follow symlinks if not dereferencing
    if (opts?.errorOnExist && existsSync(destination)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EEXIST, 'Destination file or directory already exists.', destination, 'cp');
    }
    switch (srcStats.mode & _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFMT) {
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFDIR:
            if (!opts?.recursive) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EISDIR, source + ' is a directory (not copied)', source, 'cp');
            }
            mkdirSync(destination, { recursive: true }); // Ensure the destination directory exists
            for (const dirent of readdirSync(source, { withFileTypes: true })) {
                if (opts.filter && !opts.filter((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(source, dirent.name), (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(destination, dirent.name))) {
                    continue; // Skip if the filter returns false
                }
                cpSync((0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(source, dirent.name), (0,_path_js__WEBPACK_IMPORTED_MODULE_9__.join)(destination, dirent.name), opts);
            }
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFREG:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFLNK:
            copyFileSync(source, destination);
            break;
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFBLK:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFCHR:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFIFO:
        case _constants_js__WEBPACK_IMPORTED_MODULE_7__.S_IFSOCK:
        default:
            throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EPERM, 'File type not supported', source, 'rm');
    }
    // Optionally preserve timestamps
    if (opts?.preserveTimestamps) {
        utimesSync(destination, srcStats.atime, srcStats.mtime);
    }
}
cpSync;
function statfsSync(path, options) {
    path = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizePath)(path);
    const { fs } = (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__.resolveMount)(path);
    return (0,_shared_js__WEBPACK_IMPORTED_MODULE_10__._statfs)(fs, options?.bigint);
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/emulation/watchers.js":
/*!*****************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/emulation/watchers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FSWatcher: () => (/* binding */ FSWatcher),
/* harmony export */   StatWatcher: () => (/* binding */ StatWatcher),
/* harmony export */   addWatcher: () => (/* binding */ addWatcher),
/* harmony export */   emitChange: () => (/* binding */ emitChange),
/* harmony export */   removeWatcher: () => (/* binding */ removeWatcher)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./src/node_modules/eventemitter3/index.mjs");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _sync_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sync.js */ "./src/node_modules/@zenfs/core/dist/emulation/sync.js");






/**
 * Base class for file system watchers.
 * Provides event handling capabilities for watching file system changes.
 *
 * @template TEvents The type of events emitted by the watcher.
 */
class Watcher extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    off(event, fn, context, once) {
        return super.off(event, fn, context, once);
    }
    removeListener(event, fn, context, once) {
        return super.removeListener(event, fn, context, once);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    constructor(path) {
        super();
        this.path = path;
    }
    setMaxListeners() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.path, 'Watcher.setMaxListeners');
    }
    getMaxListeners() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.path, 'Watcher.getMaxListeners');
    }
    prependListener() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.path, 'Watcher.prependListener');
    }
    prependOnceListener() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.path, 'Watcher.prependOnceListener');
    }
    rawListeners() {
        throw _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError.With('ENOSYS', this.path, 'Watcher.rawListeners');
    }
    ref() {
        return this;
    }
    unref() {
        return this;
    }
}
/**
 * Watches for changes on the file system.
 *
 * @template T The type of the filename, either `string` or `Buffer`.
 */
class FSWatcher extends Watcher {
    constructor(path, options) {
        super(path);
        this.options = options;
        addWatcher(path.toString(), this);
    }
    close() {
        super.emit('close');
        removeWatcher(this.path.toString(), this);
    }
    [Symbol.dispose]() {
        this.close();
    }
}
/**
 * Watches for changes to a file's stats.
 *
 * Instances of `StatWatcher` are used by `fs.watchFile()` to monitor changes to a file's statistics.
 */
class StatWatcher extends Watcher {
    constructor(path, options) {
        super(path);
        this.options = options;
        this.start();
    }
    onInterval() {
        try {
            const current = (0,_sync_js__WEBPACK_IMPORTED_MODULE_5__.statSync)(this.path);
            if (!(0,_stats_js__WEBPACK_IMPORTED_MODULE_2__.isStatsEqual)(this.previous, current)) {
                this.emit('change', current, this.previous);
                this.previous = current;
            }
        }
        catch (e) {
            this.emit('error', e);
        }
    }
    start() {
        const interval = this.options.interval || 5000;
        try {
            this.previous = (0,_sync_js__WEBPACK_IMPORTED_MODULE_5__.statSync)(this.path);
        }
        catch (e) {
            this.emit('error', e);
            return;
        }
        this.intervalId = setInterval(this.onInterval.bind(this), interval);
        if (!this.options.persistent && typeof this.intervalId == 'object') {
            this.intervalId.unref();
        }
    }
    /**
     * @internal
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        this.removeAllListeners();
    }
}
const watchers = new Map();
function addWatcher(path, watcher) {
    const normalizedPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(path);
    if (!watchers.has(normalizedPath)) {
        watchers.set(normalizedPath, new Set());
    }
    watchers.get(normalizedPath).add(watcher);
}
function removeWatcher(path, watcher) {
    const normalizedPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(path);
    if (watchers.has(normalizedPath)) {
        watchers.get(normalizedPath).delete(watcher);
        if (watchers.get(normalizedPath).size === 0) {
            watchers.delete(normalizedPath);
        }
    }
}
function emitChange(eventType, filename) {
    let normalizedFilename = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.normalizePath)(filename);
    // Notify watchers on the specific file
    if (watchers.has(normalizedFilename)) {
        for (const watcher of watchers.get(normalizedFilename)) {
            watcher.emit('change', eventType, (0,_path_js__WEBPACK_IMPORTED_MODULE_4__.basename)(filename));
        }
    }
    // Notify watchers on parent directories if they are watching recursively
    let parent = (0,_path_js__WEBPACK_IMPORTED_MODULE_4__.dirname)(normalizedFilename);
    while (parent !== normalizedFilename && parent !== '/') {
        if (watchers.has(parent)) {
            for (const watcher of watchers.get(parent)) {
                watcher.emit('change', eventType, (0,_path_js__WEBPACK_IMPORTED_MODULE_4__.basename)(filename));
            }
        }
        normalizedFilename = parent;
        parent = (0,_path_js__WEBPACK_IMPORTED_MODULE_4__.dirname)(parent);
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/error.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/error.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Errno: () => (/* binding */ Errno),
/* harmony export */   ErrnoError: () => (/* binding */ ErrnoError),
/* harmony export */   errorMessages: () => (/* binding */ errorMessages)
/* harmony export */ });
/**
 * Standard libc error codes. More will be added to this enum and error strings as they are
 * needed.
 * @see https://en.wikipedia.org/wiki/Errno.h
 */
var Errno;
(function (Errno) {
    /** Operation not permitted */
    Errno[Errno["EPERM"] = 1] = "EPERM";
    /** No such file or directory */
    Errno[Errno["ENOENT"] = 2] = "ENOENT";
    /** Interrupted system call */
    Errno[Errno["EINTR"] = 4] = "EINTR";
    /** Input/output error */
    Errno[Errno["EIO"] = 5] = "EIO";
    /** No such device or address */
    Errno[Errno["ENXIO"] = 6] = "ENXIO";
    /** Bad file descriptor */
    Errno[Errno["EBADF"] = 9] = "EBADF";
    /** Resource temporarily unavailable */
    Errno[Errno["EAGAIN"] = 11] = "EAGAIN";
    /** Cannot allocate memory */
    Errno[Errno["ENOMEM"] = 12] = "ENOMEM";
    /** Permission denied */
    Errno[Errno["EACCES"] = 13] = "EACCES";
    /** Bad address */
    Errno[Errno["EFAULT"] = 14] = "EFAULT";
    /** Block device required */
    Errno[Errno["ENOTBLK"] = 15] = "ENOTBLK";
    /** Resource busy or locked */
    Errno[Errno["EBUSY"] = 16] = "EBUSY";
    /** File exists */
    Errno[Errno["EEXIST"] = 17] = "EEXIST";
    /** Invalid cross-device link */
    Errno[Errno["EXDEV"] = 18] = "EXDEV";
    /** No such device */
    Errno[Errno["ENODEV"] = 19] = "ENODEV";
    /** File is not a directory */
    Errno[Errno["ENOTDIR"] = 20] = "ENOTDIR";
    /** File is a directory */
    Errno[Errno["EISDIR"] = 21] = "EISDIR";
    /** Invalid argument */
    Errno[Errno["EINVAL"] = 22] = "EINVAL";
    /** Too many open files in system */
    Errno[Errno["ENFILE"] = 23] = "ENFILE";
    /** Too many open files */
    Errno[Errno["EMFILE"] = 24] = "EMFILE";
    /** Text file busy */
    Errno[Errno["ETXTBSY"] = 26] = "ETXTBSY";
    /** File is too big */
    Errno[Errno["EFBIG"] = 27] = "EFBIG";
    /** No space left on disk */
    Errno[Errno["ENOSPC"] = 28] = "ENOSPC";
    /** Illegal seek */
    Errno[Errno["ESPIPE"] = 29] = "ESPIPE";
    /** Cannot modify a read-only file system */
    Errno[Errno["EROFS"] = 30] = "EROFS";
    /** Too many links */
    Errno[Errno["EMLINK"] = 31] = "EMLINK";
    /** Broken pipe */
    Errno[Errno["EPIPE"] = 32] = "EPIPE";
    /** Numerical argument out of domain */
    Errno[Errno["EDOM"] = 33] = "EDOM";
    /** Numerical result out of range */
    Errno[Errno["ERANGE"] = 34] = "ERANGE";
    /** Resource deadlock would occur */
    Errno[Errno["EDEADLK"] = 35] = "EDEADLK";
    /** File name too long */
    Errno[Errno["ENAMETOOLONG"] = 36] = "ENAMETOOLONG";
    /** No locks available */
    Errno[Errno["ENOLCK"] = 37] = "ENOLCK";
    /** Function not implemented */
    Errno[Errno["ENOSYS"] = 38] = "ENOSYS";
    /** Directory is not empty */
    Errno[Errno["ENOTEMPTY"] = 39] = "ENOTEMPTY";
    /** Too many levels of symbolic links */
    Errno[Errno["ELOOP"] = 40] = "ELOOP";
    /** No message of desired type */
    Errno[Errno["ENOMSG"] = 42] = "ENOMSG";
    /** Invalid exchange */
    Errno[Errno["EBADE"] = 52] = "EBADE";
    /** Invalid request descriptor */
    Errno[Errno["EBADR"] = 53] = "EBADR";
    /** Exchange full */
    Errno[Errno["EXFULL"] = 54] = "EXFULL";
    /** No anode */
    Errno[Errno["ENOANO"] = 55] = "ENOANO";
    /** Invalid request code */
    Errno[Errno["EBADRQC"] = 56] = "EBADRQC";
    /** Device not a stream */
    Errno[Errno["ENOSTR"] = 60] = "ENOSTR";
    /** No data available */
    Errno[Errno["ENODATA"] = 61] = "ENODATA";
    /** Timer expired */
    Errno[Errno["ETIME"] = 62] = "ETIME";
    /** Out of streams resources */
    Errno[Errno["ENOSR"] = 63] = "ENOSR";
    /** Machine is not on the network */
    Errno[Errno["ENONET"] = 64] = "ENONET";
    /** Object is remote */
    Errno[Errno["EREMOTE"] = 66] = "EREMOTE";
    /** Link has been severed */
    Errno[Errno["ENOLINK"] = 67] = "ENOLINK";
    /** Communication error on send */
    Errno[Errno["ECOMM"] = 70] = "ECOMM";
    /** Protocol error */
    Errno[Errno["EPROTO"] = 71] = "EPROTO";
    /** Bad message */
    Errno[Errno["EBADMSG"] = 74] = "EBADMSG";
    /** Value too large for defined data type */
    Errno[Errno["EOVERFLOW"] = 75] = "EOVERFLOW";
    /** File descriptor in bad state */
    Errno[Errno["EBADFD"] = 77] = "EBADFD";
    /** Streams pipe error */
    Errno[Errno["ESTRPIPE"] = 86] = "ESTRPIPE";
    /** Socket operation on non-socket */
    Errno[Errno["ENOTSOCK"] = 88] = "ENOTSOCK";
    /** Destination address required */
    Errno[Errno["EDESTADDRREQ"] = 89] = "EDESTADDRREQ";
    /** Message too long */
    Errno[Errno["EMSGSIZE"] = 90] = "EMSGSIZE";
    /** Protocol wrong type for socket */
    Errno[Errno["EPROTOTYPE"] = 91] = "EPROTOTYPE";
    /** Protocol not available */
    Errno[Errno["ENOPROTOOPT"] = 92] = "ENOPROTOOPT";
    /** Protocol not supported */
    Errno[Errno["EPROTONOSUPPORT"] = 93] = "EPROTONOSUPPORT";
    /** Socket type not supported */
    Errno[Errno["ESOCKTNOSUPPORT"] = 94] = "ESOCKTNOSUPPORT";
    /** Operation is not supported */
    Errno[Errno["ENOTSUP"] = 95] = "ENOTSUP";
    /** Network is down */
    Errno[Errno["ENETDOWN"] = 100] = "ENETDOWN";
    /** Network is unreachable */
    Errno[Errno["ENETUNREACH"] = 101] = "ENETUNREACH";
    /** Network dropped connection on reset */
    Errno[Errno["ENETRESET"] = 102] = "ENETRESET";
    /** Connection timed out */
    Errno[Errno["ETIMEDOUT"] = 110] = "ETIMEDOUT";
    /** Connection refused */
    Errno[Errno["ECONNREFUSED"] = 111] = "ECONNREFUSED";
    /** Host is down */
    Errno[Errno["EHOSTDOWN"] = 112] = "EHOSTDOWN";
    /** No route to host */
    Errno[Errno["EHOSTUNREACH"] = 113] = "EHOSTUNREACH";
    /** Operation already in progress */
    Errno[Errno["EALREADY"] = 114] = "EALREADY";
    /** Operation now in progress */
    Errno[Errno["EINPROGRESS"] = 115] = "EINPROGRESS";
    /** Stale file handle */
    Errno[Errno["ESTALE"] = 116] = "ESTALE";
    /** Remote I/O error */
    Errno[Errno["EREMOTEIO"] = 121] = "EREMOTEIO";
    /** Disk quota exceeded */
    Errno[Errno["EDQUOT"] = 122] = "EDQUOT";
})(Errno || (Errno = {}));
/**
 * Strings associated with each error code.
 * @internal
 */
const errorMessages = {
    [Errno.EPERM]: 'Operation not permitted',
    [Errno.ENOENT]: 'No such file or directory',
    [Errno.EINTR]: 'Interrupted system call',
    [Errno.EIO]: 'Input/output error',
    [Errno.ENXIO]: 'No such device or address',
    [Errno.EBADF]: 'Bad file descriptor',
    [Errno.EAGAIN]: 'Resource temporarily unavailable',
    [Errno.ENOMEM]: 'Cannot allocate memory',
    [Errno.EACCES]: 'Permission denied',
    [Errno.EFAULT]: 'Bad address',
    [Errno.ENOTBLK]: 'Block device required',
    [Errno.EBUSY]: 'Resource busy or locked',
    [Errno.EEXIST]: 'File exists',
    [Errno.EXDEV]: 'Invalid cross-device link',
    [Errno.ENODEV]: 'No such device',
    [Errno.ENOTDIR]: 'File is not a directory',
    [Errno.EISDIR]: 'File is a directory',
    [Errno.EINVAL]: 'Invalid argument',
    [Errno.ENFILE]: 'Too many open files in system',
    [Errno.EMFILE]: 'Too many open files',
    [Errno.ETXTBSY]: 'Text file busy',
    [Errno.EFBIG]: 'File is too big',
    [Errno.ENOSPC]: 'No space left on disk',
    [Errno.ESPIPE]: 'Illegal seek',
    [Errno.EROFS]: 'Cannot modify a read-only file system',
    [Errno.EMLINK]: 'Too many links',
    [Errno.EPIPE]: 'Broken pipe',
    [Errno.EDOM]: 'Numerical argument out of domain',
    [Errno.ERANGE]: 'Numerical result out of range',
    [Errno.EDEADLK]: 'Resource deadlock would occur',
    [Errno.ENAMETOOLONG]: 'File name too long',
    [Errno.ENOLCK]: 'No locks available',
    [Errno.ENOSYS]: 'Function not implemented',
    [Errno.ENOTEMPTY]: 'Directory is not empty',
    [Errno.ELOOP]: 'Too many levels of symbolic links',
    [Errno.ENOMSG]: 'No message of desired type',
    [Errno.EBADE]: 'Invalid exchange',
    [Errno.EBADR]: 'Invalid request descriptor',
    [Errno.EXFULL]: 'Exchange full',
    [Errno.ENOANO]: 'No anode',
    [Errno.EBADRQC]: 'Invalid request code',
    [Errno.ENOSTR]: 'Device not a stream',
    [Errno.ENODATA]: 'No data available',
    [Errno.ETIME]: 'Timer expired',
    [Errno.ENOSR]: 'Out of streams resources',
    [Errno.ENONET]: 'Machine is not on the network',
    [Errno.EREMOTE]: 'Object is remote',
    [Errno.ENOLINK]: 'Link has been severed',
    [Errno.ECOMM]: 'Communication error on send',
    [Errno.EPROTO]: 'Protocol error',
    [Errno.EBADMSG]: 'Bad message',
    [Errno.EOVERFLOW]: 'Value too large for defined data type',
    [Errno.EBADFD]: 'File descriptor in bad state',
    [Errno.ESTRPIPE]: 'Streams pipe error',
    [Errno.ENOTSOCK]: 'Socket operation on non-socket',
    [Errno.EDESTADDRREQ]: 'Destination address required',
    [Errno.EMSGSIZE]: 'Message too long',
    [Errno.EPROTOTYPE]: 'Protocol wrong type for socket',
    [Errno.ENOPROTOOPT]: 'Protocol not available',
    [Errno.EPROTONOSUPPORT]: 'Protocol not supported',
    [Errno.ESOCKTNOSUPPORT]: 'Socket type not supported',
    [Errno.ENOTSUP]: 'Operation is not supported',
    [Errno.ENETDOWN]: 'Network is down',
    [Errno.ENETUNREACH]: 'Network is unreachable',
    [Errno.ENETRESET]: 'Network dropped connection on reset',
    [Errno.ETIMEDOUT]: 'Connection timed out',
    [Errno.ECONNREFUSED]: 'Connection refused',
    [Errno.EHOSTDOWN]: 'Host is down',
    [Errno.EHOSTUNREACH]: 'No route to host',
    [Errno.EALREADY]: 'Operation already in progress',
    [Errno.EINPROGRESS]: 'Operation now in progress',
    [Errno.ESTALE]: 'Stale file handle',
    [Errno.EREMOTEIO]: 'Remote I/O error',
    [Errno.EDQUOT]: 'Disk quota exceeded',
};
/**
 * An error with additional information about what happened
 */
class ErrnoError extends Error {
    static fromJSON(json) {
        const err = new ErrnoError(json.errno, json.message, json.path, json.syscall);
        err.code = json.code;
        err.stack = json.stack;
        return err;
    }
    static With(code, path, syscall) {
        return new ErrnoError(Errno[code], errorMessages[Errno[code]], path, syscall);
    }
    constructor(
    /**
     * The kind of error
     */
    errno, 
    /**
     * A descriptive error message
     */
    message = errorMessages[errno], path, syscall = '') {
        super(message);
        this.errno = errno;
        this.path = path;
        this.syscall = syscall;
        this.code = Errno[errno];
        this.message = this.code + ': ' + message + (this.path ? `, '${this.path}'` : '');
    }
    /**
     * @returns A friendly error message.
     */
    toString() {
        return this.message;
    }
    toJSON() {
        return {
            errno: this.errno,
            code: this.code,
            path: this.path,
            stack: this.stack,
            message: this.message,
            syscall: this.syscall,
        };
    }
    /**
     * The size of the API error in buffer-form in bytes.
     */
    bufferSize() {
        // 4 bytes for string length.
        return 4 + JSON.stringify(this.toJSON()).length;
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/file.js":
/*!***************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/file.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   File: () => (/* binding */ File),
/* harmony export */   NoSyncFile: () => (/* binding */ NoSyncFile),
/* harmony export */   PreloadFile: () => (/* binding */ PreloadFile),
/* harmony export */   flagToMode: () => (/* binding */ flagToMode),
/* harmony export */   flagToNumber: () => (/* binding */ flagToNumber),
/* harmony export */   flagToString: () => (/* binding */ flagToString),
/* harmony export */   isAppendable: () => (/* binding */ isAppendable),
/* harmony export */   isExclusive: () => (/* binding */ isExclusive),
/* harmony export */   isReadable: () => (/* binding */ isReadable),
/* harmony export */   isSynchronous: () => (/* binding */ isSynchronous),
/* harmony export */   isTruncating: () => (/* binding */ isTruncating),
/* harmony export */   isWriteable: () => (/* binding */ isWriteable),
/* harmony export */   parseFlag: () => (/* binding */ parseFlag)
/* harmony export */ });
/* harmony import */ var _emulation_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emulation/config.js */ "./src/node_modules/@zenfs/core/dist/emulation/config.js");
/* harmony import */ var _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emulation/constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./polyfills.js */ "./src/node_modules/@zenfs/core/dist/polyfills.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");





const validFlags = ['r', 'r+', 'rs', 'rs+', 'w', 'wx', 'w+', 'wx+', 'a', 'ax', 'a+', 'ax+'];
function parseFlag(flag) {
    if (typeof flag === 'number') {
        return flagToString(flag);
    }
    if (!validFlags.includes(flag)) {
        throw new Error('Invalid flag string: ' + flag);
    }
    return flag;
}
function flagToString(flag) {
    switch (flag) {
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDONLY:
            return 'r';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_SYNC:
            return 'rs';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR:
            return 'r+';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_SYNC:
            return 'rs+';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY:
            return 'w';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL:
            return 'wx';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR:
            return 'w+';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL:
            return 'wx+';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY:
            return 'a';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL:
            return 'ax';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR:
            return 'a+';
        case _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL:
            return 'ax+';
        default:
            throw new Error('Invalid flag number: ' + flag);
    }
}
function flagToNumber(flag) {
    switch (flag) {
        case 'r':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDONLY;
        case 'rs':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_SYNC;
        case 'r+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR;
        case 'rs+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_SYNC;
        case 'w':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY;
        case 'wx':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL;
        case 'w+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR;
        case 'wx+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_TRUNC | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL;
        case 'a':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY;
        case 'ax':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_WRONLY | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL;
        case 'a+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR;
        case 'ax+':
            return _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_APPEND | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_CREAT | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_RDWR | _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.O_EXCL;
        default:
            throw new Error('Invalid flag string: ' + flag);
    }
}
/**
 * Parses a flag as a mode (W_OK, R_OK, and/or X_OK)
 * @param flag the flag to parse
 */
function flagToMode(flag) {
    let mode = 0;
    mode <<= 1;
    mode += +isReadable(flag);
    mode <<= 1;
    mode += +isWriteable(flag);
    mode <<= 1;
    return mode;
}
function isReadable(flag) {
    return flag.indexOf('r') !== -1 || flag.indexOf('+') !== -1;
}
function isWriteable(flag) {
    return flag.indexOf('w') !== -1 || flag.indexOf('a') !== -1 || flag.indexOf('+') !== -1;
}
function isTruncating(flag) {
    return flag.indexOf('w') !== -1;
}
function isAppendable(flag) {
    return flag.indexOf('a') !== -1;
}
function isSynchronous(flag) {
    return flag.indexOf('s') !== -1;
}
function isExclusive(flag) {
    return flag.indexOf('x') !== -1;
}
class File {
    constructor(
    /**
     * @internal
     * The file system that created the file
     */
    fs, path) {
        this.fs = fs;
        this.path = path;
    }
    async [Symbol.asyncDispose]() {
        await this.close();
    }
    [Symbol.dispose]() {
        this.closeSync();
    }
    /**
     * Default implementation maps to `sync`.
     */
    datasync() {
        return this.sync();
    }
    /**
     * Default implementation maps to `syncSync`.
     */
    datasyncSync() {
        return this.syncSync();
    }
}
/**
 * An implementation of `File` that operates completely in-memory.
 * `PreloadFile`s are backed by a `Uint8Array`.
 */
class PreloadFile extends File {
    /**
     * Creates a file with `path` and, optionally, the given contents.
     * Note that, if contents is specified, it will be mutated by the file.
     */
    constructor(fs, path, flag, stats, 
    /**
     * A buffer containing the entire contents of the file.
     */
    _buffer = new Uint8Array(new ArrayBuffer(0, fs.metadata().noResizableBuffers ? {} : { maxByteLength: _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max }))) {
        super(fs, path);
        this.flag = flag;
        this.stats = stats;
        this._buffer = _buffer;
        /**
         * Current position
         */
        this._position = 0;
        /**
         * Whether the file has changes which have not been written to the FS
         */
        this.dirty = false;
        /**
         * Whether the file is open or closed
         */
        this.closed = false;
        /*
            Note:
            This invariant is *not* maintained once the file starts getting modified.
            It only actually matters if file is readable, as writeable modes may truncate/append to file.
        */
        if (this.stats.size == _buffer.byteLength) {
            return;
        }
        if (isReadable(this.flag)) {
            throw new Error(`Size mismatch: buffer length ${_buffer.byteLength}, stats size ${this.stats.size}`);
        }
        this.dirty = true;
    }
    /**
     * Get the underlying buffer for this file. Mutating not recommended and will mess up dirty tracking.
     */
    get buffer() {
        return this._buffer;
    }
    /**
     * Get the current file position.
     *
     * We emulate the following bug mentioned in the Node documentation:
     *
     * On Linux, positional writes don't work when the file is opened in append mode.
     * The kernel ignores the position argument and always appends the data to the end of the file.
     * @returns The current file position.
     */
    get position() {
        if (isAppendable(this.flag)) {
            return this.stats.size;
        }
        return this._position;
    }
    set position(value) {
        this._position = value;
    }
    async sync() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.sync');
        }
        if (!this.dirty) {
            return;
        }
        await this.fs.sync(this.path, this._buffer, this.stats);
        this.dirty = false;
    }
    syncSync() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.sync');
        }
        if (!this.dirty) {
            return;
        }
        this.fs.syncSync(this.path, this._buffer, this.stats);
        this.dirty = false;
    }
    async close() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.close');
        }
        await this.sync();
        this.dispose();
    }
    closeSync() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.close');
        }
        this.syncSync();
        this.dispose();
    }
    /**
     * Cleans up. This will *not* sync the file data to the FS
     */
    dispose(force) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.dispose');
        }
        if (this.dirty && !force) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBUSY', this.path, 'File.dispose');
        }
        // @ts-expect-error 2790
        delete this._buffer;
        // @ts-expect-error 2790
        delete this.stats;
        this.closed = true;
    }
    stat() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.stat');
        }
        return Promise.resolve(new _stats_js__WEBPACK_IMPORTED_MODULE_4__.Stats(this.stats));
    }
    statSync() {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.stat');
        }
        return new _stats_js__WEBPACK_IMPORTED_MODULE_4__.Stats(this.stats);
    }
    _truncate(length) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.truncate');
        }
        this.dirty = true;
        if (!isWriteable(this.flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EPERM, 'File not opened with a writeable mode.');
        }
        this.stats.mtimeMs = Date.now();
        if (length > this._buffer.length) {
            const data = new Uint8Array(length - this._buffer.length);
            // Write will set stats.size and handle syncing.
            this._write(data, 0, data.length, this._buffer.length);
            return;
        }
        this.stats.size = length;
        // Truncate.
        this._buffer = length ? this._buffer.slice(0, length) : new Uint8Array();
    }
    async truncate(length) {
        this._truncate(length);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
    }
    truncateSync(length) {
        this._truncate(length);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
    }
    _write(buffer, offset = 0, length = this.stats.size, position = this.position) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.write');
        }
        if (!isWriteable(this.flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EPERM, 'File not opened with a writeable mode.');
        }
        this.dirty = true;
        const end = position + length;
        const slice = buffer.slice(offset, offset + length);
        if (end > this.stats.size) {
            this.stats.size = end;
            if (end > this._buffer.byteLength) {
                if (this._buffer.buffer.resizable && this._buffer.buffer.maxByteLength <= end) {
                    this._buffer.buffer.resize(end);
                }
                else if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.unsafeBufferReplace) {
                    this._buffer = slice;
                }
                else {
                    // Extend the buffer!
                    const newBuffer = new Uint8Array(new ArrayBuffer(end, this.fs.metadata().noResizableBuffers ? {} : { maxByteLength: _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max }));
                    newBuffer.set(this._buffer);
                    this._buffer = newBuffer;
                }
            }
        }
        this._buffer.set(slice, position);
        this.stats.mtimeMs = Date.now();
        this.position = position + slice.byteLength;
        return slice.byteLength;
    }
    /**
     * Write buffer to the file.
     * @param buffer Uint8Array containing the data to write to the file.
     * @param offset Offset in the buffer to start reading data from.
     * @param length The amount of bytes to write to the file.
     * @param position Offset from the beginning of the file where this data should be written.
     * If position is null, the data will be written at  the current position.
     */
    async write(buffer, offset, length, position) {
        const bytesWritten = this._write(buffer, offset, length, position);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
        return bytesWritten;
    }
    /**
     * Write buffer to the file.
     * @param buffer Uint8Array containing the data to write to the file.
     * @param offset Offset in the buffer to start reading data from.
     * @param length The amount of bytes to write to the file.
     * @param position Offset from the beginning of the file where this data should be written.
     * If position is null, the data will be written at  the current position.
     * @returns bytes written
     */
    writeSync(buffer, offset = 0, length = this.stats.size, position = this.position) {
        const bytesWritten = this._write(buffer, offset, length, position);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
        return bytesWritten;
    }
    _read(buffer, offset = 0, length = this.stats.size, position) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.read');
        }
        if (!isReadable(this.flag)) {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.EPERM, 'File not opened with a readable mode.');
        }
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.updateOnRead) {
            this.dirty = true;
        }
        this.stats.atimeMs = Date.now();
        position ?? (position = this.position);
        let end = position + length;
        if (end > this.stats.size) {
            end = position + Math.max(this.stats.size - position, 0);
        }
        this._position = end;
        const bytesRead = end - position;
        if (bytesRead == 0) {
            // No copy/read. Return immediately for better performance
            return bytesRead;
        }
        new Uint8Array(buffer.buffer, offset, length).set(this._buffer.slice(position, end));
        return bytesRead;
    }
    /**
     * Read data from the file.
     * @param buffer The buffer that the data will be written to.
     * @param offset The offset within the buffer where writing will start.
     * @param length An integer specifying the number of bytes to read.
     * @param position An integer specifying where to begin reading from in the file.
     * If position is null, data will be read from the current file position.
     */
    async read(buffer, offset, length, position) {
        const bytesRead = this._read(buffer, offset, length, position);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
        return { bytesRead, buffer };
    }
    /**
     * Read data from the file.
     * @param buffer The buffer that the data will be written to.
     * @param offset The offset within the buffer where writing will start.
     * @param length An integer specifying the number of bytes to read.
     * @param position An integer specifying where to begin reading from in the file.
     * If position is null, data will be read from the current file position.
     * @returns number of bytes written
     */
    readSync(buffer, offset, length, position) {
        const bytesRead = this._read(buffer, offset, length, position);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
        return bytesRead;
    }
    async chmod(mode) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.chmod');
        }
        this.dirty = true;
        this.stats.chmod(mode);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
    }
    chmodSync(mode) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.chmod');
        }
        this.dirty = true;
        this.stats.chmod(mode);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
    }
    async chown(uid, gid) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.chown');
        }
        this.dirty = true;
        this.stats.chown(uid, gid);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
    }
    chownSync(uid, gid) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.chown');
        }
        this.dirty = true;
        this.stats.chown(uid, gid);
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
    }
    async utimes(atime, mtime) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.utimes');
        }
        this.dirty = true;
        this.stats.atime = atime;
        this.stats.mtime = mtime;
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            await this.sync();
    }
    utimesSync(atime, mtime) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File.utimes');
        }
        this.dirty = true;
        this.stats.atime = atime;
        this.stats.mtime = mtime;
        if (_emulation_config_js__WEBPACK_IMPORTED_MODULE_0__.config.syncImmediately)
            this.syncSync();
    }
    async _setType(type) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File._setType');
        }
        this.dirty = true;
        this.stats.mode = (this.stats.mode & ~_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) | type;
        await this.sync();
    }
    _setTypeSync(type) {
        if (this.closed) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError.With('EBADF', this.path, 'File._setType');
        }
        this.dirty = true;
        this.stats.mode = (this.stats.mode & ~_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) | type;
        this.syncSync();
    }
}
/**
 * For the file systems which do not sync to anything.
 */
class NoSyncFile extends PreloadFile {
    sync() {
        return Promise.resolve();
    }
    syncSync() { }
    close() {
        return Promise.resolve();
    }
    closeSync() { }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/filesystem.js":
/*!*********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/filesystem.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileSystem: () => (/* binding */ FileSystem)
/* harmony export */ });
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");

/**
 * Provides a consistent and easy to use internal API.
 * Default implementations for `exists` and `existsSync` are included.
 * If you are extending this class, note that every path is an absolute path and all arguments are present.
 * @internal
 */
class FileSystem {
    /**
     * Get metadata about the current file system
     */
    metadata() {
        return {
            name: this.constructor.name.toLowerCase(),
            readonly: false,
            totalSpace: 0,
            freeSpace: 0,
            noResizableBuffers: false,
            noAsyncCache: this._disableSync ?? false,
            type: _stats_js__WEBPACK_IMPORTED_MODULE_0__.ZenFsType,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    constructor(...args) { }
    async ready() { }
    /**
     * Test whether or not `path` exists.
     */
    async exists(path) {
        try {
            await this.stat(path);
            return true;
        }
        catch (e) {
            return e.code != 'ENOENT';
        }
    }
    /**
     * Test whether or not `path` exists.
     */
    existsSync(path) {
        try {
            this.statSync(path);
            return true;
        }
        catch (e) {
            return e.code != 'ENOENT';
        }
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/index.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Async: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.Async),
/* harmony export */   AsyncTransaction: () => (/* reexport safe */ _backends_store_store_js__WEBPACK_IMPORTED_MODULE_8__.AsyncTransaction),
/* harmony export */   BigIntStats: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.BigIntStats),
/* harmony export */   BigIntStatsFs: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.BigIntStatsFs),
/* harmony export */   DeviceFS: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.DeviceFS),
/* harmony export */   DeviceFile: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.DeviceFile),
/* harmony export */   Dir: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.Dir),
/* harmony export */   Dirent: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.Dirent),
/* harmony export */   Errno: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_0__.Errno),
/* harmony export */   ErrnoError: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError),
/* harmony export */   Fetch: () => (/* reexport safe */ _backends_fetch_js__WEBPACK_IMPORTED_MODULE_2__.Fetch),
/* harmony export */   FetchFS: () => (/* reexport safe */ _backends_fetch_js__WEBPACK_IMPORTED_MODULE_2__.FetchFS),
/* harmony export */   File: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.File),
/* harmony export */   FileSystem: () => (/* reexport safe */ _filesystem_js__WEBPACK_IMPORTED_MODULE_14__.FileSystem),
/* harmony export */   InMemory: () => (/* reexport safe */ _backends_memory_js__WEBPACK_IMPORTED_MODULE_3__.InMemory),
/* harmony export */   InMemoryStore: () => (/* reexport safe */ _backends_memory_js__WEBPACK_IMPORTED_MODULE_3__.InMemoryStore),
/* harmony export */   Index: () => (/* reexport safe */ _backends_file_index_js__WEBPACK_IMPORTED_MODULE_4__.Index),
/* harmony export */   IndexFS: () => (/* reexport safe */ _backends_file_index_js__WEBPACK_IMPORTED_MODULE_4__.IndexFS),
/* harmony export */   Inode: () => (/* reexport safe */ _inode_js__WEBPACK_IMPORTED_MODULE_15__.Inode),
/* harmony export */   MutexLock: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.MutexLock),
/* harmony export */   Mutexed: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.Mutexed),
/* harmony export */   NoSyncFile: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.NoSyncFile),
/* harmony export */   Overlay: () => (/* reexport safe */ _backends_overlay_js__WEBPACK_IMPORTED_MODULE_5__.Overlay),
/* harmony export */   OverlayFS: () => (/* reexport safe */ _backends_overlay_js__WEBPACK_IMPORTED_MODULE_5__.OverlayFS),
/* harmony export */   Port: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.Port),
/* harmony export */   PortFS: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.PortFS),
/* harmony export */   PortFile: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.PortFile),
/* harmony export */   PreloadFile: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.PreloadFile),
/* harmony export */   ReadStream: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.ReadStream),
/* harmony export */   Readonly: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.Readonly),
/* harmony export */   SimpleAsyncStore: () => (/* reexport safe */ _backends_store_simple_js__WEBPACK_IMPORTED_MODULE_7__.SimpleAsyncStore),
/* harmony export */   SimpleTransaction: () => (/* reexport safe */ _backends_store_simple_js__WEBPACK_IMPORTED_MODULE_7__.SimpleTransaction),
/* harmony export */   Stats: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.Stats),
/* harmony export */   StatsCommon: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.StatsCommon),
/* harmony export */   StatsFs: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.StatsFs),
/* harmony export */   StoreFS: () => (/* reexport safe */ _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_6__.StoreFS),
/* harmony export */   Sync: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.Sync),
/* harmony export */   SyncTransaction: () => (/* reexport safe */ _backends_store_store_js__WEBPACK_IMPORTED_MODULE_8__.SyncTransaction),
/* harmony export */   Transaction: () => (/* reexport safe */ _backends_store_store_js__WEBPACK_IMPORTED_MODULE_8__.Transaction),
/* harmony export */   UnmutexedOverlayFS: () => (/* reexport safe */ _backends_overlay_js__WEBPACK_IMPORTED_MODULE_5__.UnmutexedOverlayFS),
/* harmony export */   WriteStream: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.WriteStream),
/* harmony export */   ZenFsType: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.ZenFsType),
/* harmony export */   _MutexedFS: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__._MutexedFS),
/* harmony export */   _synced: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__._synced),
/* harmony export */   access: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.access),
/* harmony export */   accessSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.accessSync),
/* harmony export */   appendFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.appendFile),
/* harmony export */   appendFileSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.appendFileSync),
/* harmony export */   asyncPatch: () => (/* reexport safe */ _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__.asyncPatch),
/* harmony export */   attachFS: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.attachFS),
/* harmony export */   checkOptions: () => (/* reexport safe */ _backends_backend_js__WEBPACK_IMPORTED_MODULE_9__.checkOptions),
/* harmony export */   chmod: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.chmod),
/* harmony export */   chmodSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.chmodSync),
/* harmony export */   chown: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.chown),
/* harmony export */   chownSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.chownSync),
/* harmony export */   close: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.close),
/* harmony export */   closeSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.closeSync),
/* harmony export */   configure: () => (/* reexport safe */ _config_js__WEBPACK_IMPORTED_MODULE_10__.configure),
/* harmony export */   configureSingle: () => (/* reexport safe */ _config_js__WEBPACK_IMPORTED_MODULE_10__.configureSingle),
/* harmony export */   constants: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.constants),
/* harmony export */   copyFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.copyFile),
/* harmony export */   copyFileSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.copyFileSync),
/* harmony export */   cp: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.cp),
/* harmony export */   cpSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.cpSync),
/* harmony export */   createReadStream: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.createReadStream),
/* harmony export */   createWriteStream: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.createWriteStream),
/* harmony export */   credentials: () => (/* reexport safe */ _credentials_js__WEBPACK_IMPORTED_MODULE_11__.credentials),
/* harmony export */   decode: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.decode),
/* harmony export */   decodeDirListing: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.decodeDirListing),
/* harmony export */   decodeRaw: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.decodeRaw),
/* harmony export */   decodeUTF8: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.decodeUTF8),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   detachFS: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.detachFS),
/* harmony export */   devices: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   encode: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.encode),
/* harmony export */   encodeDirListing: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.encodeDirListing),
/* harmony export */   encodeRaw: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.encodeRaw),
/* harmony export */   encodeUTF8: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.encodeUTF8),
/* harmony export */   errorMessages: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_0__.errorMessages),
/* harmony export */   exists: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.exists),
/* harmony export */   existsSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.existsSync),
/* harmony export */   fchmod: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fchmod),
/* harmony export */   fchmodSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fchmodSync),
/* harmony export */   fchown: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fchown),
/* harmony export */   fchownSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fchownSync),
/* harmony export */   fdatasync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fdatasync),
/* harmony export */   fdatasyncSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fdatasyncSync),
/* harmony export */   flagToMode: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.flagToMode),
/* harmony export */   flagToNumber: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.flagToNumber),
/* harmony export */   flagToString: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.flagToString),
/* harmony export */   fs: () => (/* reexport module object */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__),
/* harmony export */   fstat: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fstat),
/* harmony export */   fstatSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fstatSync),
/* harmony export */   fsync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fsync),
/* harmony export */   fsyncSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.fsyncSync),
/* harmony export */   ftruncate: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.ftruncate),
/* harmony export */   ftruncateSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.ftruncateSync),
/* harmony export */   fullDevice: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.fullDevice),
/* harmony export */   futimes: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.futimes),
/* harmony export */   futimesSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.futimesSync),
/* harmony export */   handleRequest: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.handleRequest),
/* harmony export */   isAppendable: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isAppendable),
/* harmony export */   isBackend: () => (/* reexport safe */ _backends_backend_js__WEBPACK_IMPORTED_MODULE_9__.isBackend),
/* harmony export */   isBackendConfig: () => (/* reexport safe */ _backends_backend_js__WEBPACK_IMPORTED_MODULE_9__.isBackendConfig),
/* harmony export */   isExclusive: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isExclusive),
/* harmony export */   isReadable: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isReadable),
/* harmony export */   isStatsEqual: () => (/* reexport safe */ _stats_js__WEBPACK_IMPORTED_MODULE_17__.isStatsEqual),
/* harmony export */   isSynchronous: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isSynchronous),
/* harmony export */   isTruncating: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isTruncating),
/* harmony export */   isWriteable: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.isWriteable),
/* harmony export */   lchmod: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lchmod),
/* harmony export */   lchmodSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lchmodSync),
/* harmony export */   lchown: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lchown),
/* harmony export */   lchownSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lchownSync),
/* harmony export */   levenshtein: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.levenshtein),
/* harmony export */   link: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.link),
/* harmony export */   linkSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.linkSync),
/* harmony export */   lopenSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lopenSync),
/* harmony export */   lstat: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lstat),
/* harmony export */   lstatSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lstatSync),
/* harmony export */   lutimes: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lutimes),
/* harmony export */   lutimesSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.lutimesSync),
/* harmony export */   mkdir: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mkdir),
/* harmony export */   mkdirSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mkdirSync),
/* harmony export */   mkdirpSync: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.mkdirpSync),
/* harmony export */   mkdtemp: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mkdtemp),
/* harmony export */   mkdtempSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mkdtempSync),
/* harmony export */   mount: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mount),
/* harmony export */   mountObject: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mountObject),
/* harmony export */   mounts: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.mounts),
/* harmony export */   normalizeMode: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.normalizeMode),
/* harmony export */   normalizeOptions: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.normalizeOptions),
/* harmony export */   normalizePath: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.normalizePath),
/* harmony export */   normalizeTime: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.normalizeTime),
/* harmony export */   nullDevice: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.nullDevice),
/* harmony export */   open: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.open),
/* harmony export */   openAsBlob: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.openAsBlob),
/* harmony export */   openSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.openSync),
/* harmony export */   opendir: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.opendir),
/* harmony export */   opendirSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.opendirSync),
/* harmony export */   parseFlag: () => (/* reexport safe */ _file_js__WEBPACK_IMPORTED_MODULE_13__.parseFlag),
/* harmony export */   promises: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.promises),
/* harmony export */   randomBigInt: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_18__.randomBigInt),
/* harmony export */   randomDevice: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.randomDevice),
/* harmony export */   read: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.read),
/* harmony export */   readFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readFile),
/* harmony export */   readFileSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readFileSync),
/* harmony export */   readSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readSync),
/* harmony export */   readdir: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readdir),
/* harmony export */   readdirSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readdirSync),
/* harmony export */   readlink: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readlink),
/* harmony export */   readlinkSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readlinkSync),
/* harmony export */   readv: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readv),
/* harmony export */   readvSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.readvSync),
/* harmony export */   realpath: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.realpath),
/* harmony export */   realpathSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.realpathSync),
/* harmony export */   rename: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.rename),
/* harmony export */   renameSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.renameSync),
/* harmony export */   resolveMountConfig: () => (/* reexport safe */ _config_js__WEBPACK_IMPORTED_MODULE_10__.resolveMountConfig),
/* harmony export */   resolveRemoteMount: () => (/* reexport safe */ _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__.resolveRemoteMount),
/* harmony export */   rm: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.rm),
/* harmony export */   rmSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.rmSync),
/* harmony export */   rmdir: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.rmdir),
/* harmony export */   rmdirSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.rmdirSync),
/* harmony export */   rootCredentials: () => (/* reexport safe */ _credentials_js__WEBPACK_IMPORTED_MODULE_11__.rootCredentials),
/* harmony export */   rootIno: () => (/* reexport safe */ _inode_js__WEBPACK_IMPORTED_MODULE_15__.rootIno),
/* harmony export */   stat: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.stat),
/* harmony export */   statSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.statSync),
/* harmony export */   statfs: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.statfs),
/* harmony export */   statfsSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.statfsSync),
/* harmony export */   symlink: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.symlink),
/* harmony export */   symlinkSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.symlinkSync),
/* harmony export */   truncate: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.truncate),
/* harmony export */   truncateSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.truncateSync),
/* harmony export */   umount: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.umount),
/* harmony export */   unlink: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.unlink),
/* harmony export */   unlinkSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.unlinkSync),
/* harmony export */   unwatchFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.unwatchFile),
/* harmony export */   utimes: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.utimes),
/* harmony export */   utimesSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.utimesSync),
/* harmony export */   version: () => (/* reexport safe */ _backends_file_index_js__WEBPACK_IMPORTED_MODULE_4__.version),
/* harmony export */   watch: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.watch),
/* harmony export */   watchFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.watchFile),
/* harmony export */   write: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.write),
/* harmony export */   writeFile: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.writeFile),
/* harmony export */   writeFileSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.writeFileSync),
/* harmony export */   writeSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.writeSync),
/* harmony export */   writev: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.writev),
/* harmony export */   writevSync: () => (/* reexport safe */ _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__.writevSync),
/* harmony export */   zeroDevice: () => (/* reexport safe */ _devices_js__WEBPACK_IMPORTED_MODULE_12__.zeroDevice)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _backends_port_fs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./backends/port/fs.js */ "./src/node_modules/@zenfs/core/dist/backends/port/fs.js");
/* harmony import */ var _backends_fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./backends/fetch.js */ "./src/node_modules/@zenfs/core/dist/backends/fetch.js");
/* harmony import */ var _backends_memory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./backends/memory.js */ "./src/node_modules/@zenfs/core/dist/backends/memory.js");
/* harmony import */ var _backends_file_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./backends/file_index.js */ "./src/node_modules/@zenfs/core/dist/backends/file_index.js");
/* harmony import */ var _backends_overlay_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./backends/overlay.js */ "./src/node_modules/@zenfs/core/dist/backends/overlay.js");
/* harmony import */ var _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./backends/store/fs.js */ "./src/node_modules/@zenfs/core/dist/backends/store/fs.js");
/* harmony import */ var _backends_store_simple_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./backends/store/simple.js */ "./src/node_modules/@zenfs/core/dist/backends/store/simple.js");
/* harmony import */ var _backends_store_store_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./backends/store/store.js */ "./src/node_modules/@zenfs/core/dist/backends/store/store.js");
/* harmony import */ var _backends_backend_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./backends/backend.js */ "./src/node_modules/@zenfs/core/dist/backends/backend.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./config.js */ "./src/node_modules/@zenfs/core/dist/config.js");
/* harmony import */ var _credentials_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./credentials.js */ "./src/node_modules/@zenfs/core/dist/credentials.js");
/* harmony import */ var _devices_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./devices.js */ "./src/node_modules/@zenfs/core/dist/devices.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
/* harmony import */ var _filesystem_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./filesystem.js */ "./src/node_modules/@zenfs/core/dist/filesystem.js");
/* harmony import */ var _inode_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./inode.js */ "./src/node_modules/@zenfs/core/dist/inode.js");
/* harmony import */ var _mixins_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./mixins/index.js */ "./src/node_modules/@zenfs/core/dist/mixins/index.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
/* harmony import */ var _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./emulation/index.js */ "./src/node_modules/@zenfs/core/dist/emulation/index.js");























/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_emulation_index_js__WEBPACK_IMPORTED_MODULE_19__);
globalThis.__zenfs__ = _emulation_index_js__WEBPACK_IMPORTED_MODULE_19__;


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/inode.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/inode.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Inode: () => (/* binding */ Inode),
/* harmony export */   rootIno: () => (/* binding */ rootIno)
/* harmony export */ });
/* harmony import */ var utilium__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! utilium */ "./src/node_modules/utilium/dist/index.js");
/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stats.js */ "./src/node_modules/@zenfs/core/dist/stats.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/node_modules/@zenfs/core/dist/utils.js");
var __esDecorate = (undefined && undefined.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (undefined && undefined.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (undefined && undefined.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};



/**
 * Room inode
 * @hidden
 */
const rootIno = 0n;
/**
 * Generic inode definition that can easily be serialized.
 * @internal
 * @todo [BREAKING]
 */
let Inode = (() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    let _classDecorators = [(0,utilium__WEBPACK_IMPORTED_MODULE_0__.struct)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _nlink_decorators;
    let _nlink_initializers = [];
    let _nlink_extraInitializers = [];
    let _uid_decorators;
    let _uid_initializers = [];
    let _uid_extraInitializers = [];
    let _gid_decorators;
    let _gid_initializers = [];
    let _gid_extraInitializers = [];
    let _atimeMs_decorators;
    let _atimeMs_initializers = [];
    let _atimeMs_extraInitializers = [];
    let _birthtimeMs_decorators;
    let _birthtimeMs_initializers = [];
    let _birthtimeMs_extraInitializers = [];
    let _mtimeMs_decorators;
    let _mtimeMs_initializers = [];
    let _mtimeMs_extraInitializers = [];
    let _ctimeMs_decorators;
    let _ctimeMs_initializers = [];
    let _ctimeMs_extraInitializers = [];
    let _ino_decorators;
    let _ino_initializers = [];
    let _ino_extraInitializers = [];
    var Inode = _classThis = class {
        constructor(buffer) {
            this.data = __runInitializers(this, _data_initializers, void 0);
            this.size = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _size_initializers, void 0));
            this.mode = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _mode_initializers, void 0));
            this.nlink = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _nlink_initializers, void 0));
            this.uid = (__runInitializers(this, _nlink_extraInitializers), __runInitializers(this, _uid_initializers, void 0));
            this.gid = (__runInitializers(this, _uid_extraInitializers), __runInitializers(this, _gid_initializers, void 0));
            this.atimeMs = (__runInitializers(this, _gid_extraInitializers), __runInitializers(this, _atimeMs_initializers, void 0));
            this.birthtimeMs = (__runInitializers(this, _atimeMs_extraInitializers), __runInitializers(this, _birthtimeMs_initializers, void 0));
            this.mtimeMs = (__runInitializers(this, _birthtimeMs_extraInitializers), __runInitializers(this, _mtimeMs_initializers, void 0));
            this.ctimeMs = (__runInitializers(this, _mtimeMs_extraInitializers), __runInitializers(this, _ctimeMs_initializers, void 0));
            this.ino = (__runInitializers(this, _ctimeMs_extraInitializers), __runInitializers(this, _ino_initializers, void 0));
            __runInitializers(this, _ino_extraInitializers);
            if (buffer) {
                const sz_inode = (0,utilium__WEBPACK_IMPORTED_MODULE_0__.sizeof)(Inode);
                const oldSize = sz_inode - (0,utilium__WEBPACK_IMPORTED_MODULE_0__.sizeof)('uint64');
                if (buffer.byteLength < oldSize) {
                    throw new RangeError(`Can not create an inode from a buffer less than ${oldSize} bytes`);
                }
                // Expand the buffer so it is the right size
                if (buffer.byteLength < sz_inode) {
                    const newBuffer = new Uint8Array(sz_inode);
                    // Fill the new buffer with current data
                    newBuffer.set(new Uint8Array(ArrayBuffer.isView(buffer) ? buffer.buffer : buffer));
                    /* 	Add a random ino.
                        This will be different from the actual one,
                        but `ino` isn't used anywhere so it should be fine.
                    */
                    const randomIno = crypto.getRandomValues(new Uint32Array(2));
                    newBuffer.set(randomIno, sz_inode - 2);
                    buffer = newBuffer;
                }
                (0,utilium__WEBPACK_IMPORTED_MODULE_0__.deserialize)(this, buffer);
                return;
            }
            // set defaults on a fresh inode
            this.ino = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.randomBigInt)();
            this.data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.randomBigInt)();
            this.nlink = 1;
            this.size = 4096;
            const now = Date.now();
            this.atimeMs = now;
            this.mtimeMs = now;
            this.ctimeMs = now;
            this.birthtimeMs = now;
        }
        /**
         * Handy function that converts the Inode to a Node Stats object.
         */
        toStats() {
            return new _stats_js__WEBPACK_IMPORTED_MODULE_1__.Stats(this);
        }
        /**
         * Updates the Inode using information from the stats object. Used by file
         * systems at sync time, e.g.:
         * - Program opens file and gets a File object.
         * - Program mutates file. File object is responsible for maintaining
         *   metadata changes locally -- typically in a Stats object.
         * - Program closes file. File object's metadata changes are synced with the
         *   file system.
         * @return True if any changes have occurred.
         */
        update(stats) {
            let hasChanged = false;
            if (this.size !== stats.size) {
                this.size = stats.size;
                hasChanged = true;
            }
            if (this.mode !== stats.mode) {
                this.mode = stats.mode;
                hasChanged = true;
            }
            if (this.nlink !== stats.nlink) {
                this.nlink = stats.nlink;
                hasChanged = true;
            }
            if (this.uid !== stats.uid) {
                this.uid = stats.uid;
                hasChanged = true;
            }
            if (this.gid !== stats.gid) {
                this.gid = stats.gid;
                hasChanged = true;
            }
            if (this.atimeMs !== stats.atimeMs) {
                this.atimeMs = stats.atimeMs;
                hasChanged = true;
            }
            if (this.mtimeMs !== stats.mtimeMs) {
                this.mtimeMs = stats.mtimeMs;
                hasChanged = true;
            }
            if (this.ctimeMs !== stats.ctimeMs) {
                this.ctimeMs = stats.ctimeMs;
                hasChanged = true;
            }
            return hasChanged;
        }
    };
    __setFunctionName(_classThis, "Inode");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _data_decorators = [(_a = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint64.bind(_a)];
        _size_decorators = [(_b = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint32.bind(_b)];
        _mode_decorators = [(_c = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint16.bind(_c)];
        _nlink_decorators = [(_d = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint32.bind(_d)];
        _uid_decorators = [(_e = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint32.bind(_e)];
        _gid_decorators = [(_f = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint32.bind(_f)];
        _atimeMs_decorators = [(_g = utilium__WEBPACK_IMPORTED_MODULE_0__.types).float64.bind(_g)];
        _birthtimeMs_decorators = [(_h = utilium__WEBPACK_IMPORTED_MODULE_0__.types).float64.bind(_h)];
        _mtimeMs_decorators = [(_j = utilium__WEBPACK_IMPORTED_MODULE_0__.types).float64.bind(_j)];
        _ctimeMs_decorators = [(_k = utilium__WEBPACK_IMPORTED_MODULE_0__.types).float64.bind(_k)];
        _ino_decorators = [(_l = utilium__WEBPACK_IMPORTED_MODULE_0__.types).uint64.bind(_l)];
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, null, _nlink_decorators, { kind: "field", name: "nlink", static: false, private: false, access: { has: obj => "nlink" in obj, get: obj => obj.nlink, set: (obj, value) => { obj.nlink = value; } }, metadata: _metadata }, _nlink_initializers, _nlink_extraInitializers);
        __esDecorate(null, null, _uid_decorators, { kind: "field", name: "uid", static: false, private: false, access: { has: obj => "uid" in obj, get: obj => obj.uid, set: (obj, value) => { obj.uid = value; } }, metadata: _metadata }, _uid_initializers, _uid_extraInitializers);
        __esDecorate(null, null, _gid_decorators, { kind: "field", name: "gid", static: false, private: false, access: { has: obj => "gid" in obj, get: obj => obj.gid, set: (obj, value) => { obj.gid = value; } }, metadata: _metadata }, _gid_initializers, _gid_extraInitializers);
        __esDecorate(null, null, _atimeMs_decorators, { kind: "field", name: "atimeMs", static: false, private: false, access: { has: obj => "atimeMs" in obj, get: obj => obj.atimeMs, set: (obj, value) => { obj.atimeMs = value; } }, metadata: _metadata }, _atimeMs_initializers, _atimeMs_extraInitializers);
        __esDecorate(null, null, _birthtimeMs_decorators, { kind: "field", name: "birthtimeMs", static: false, private: false, access: { has: obj => "birthtimeMs" in obj, get: obj => obj.birthtimeMs, set: (obj, value) => { obj.birthtimeMs = value; } }, metadata: _metadata }, _birthtimeMs_initializers, _birthtimeMs_extraInitializers);
        __esDecorate(null, null, _mtimeMs_decorators, { kind: "field", name: "mtimeMs", static: false, private: false, access: { has: obj => "mtimeMs" in obj, get: obj => obj.mtimeMs, set: (obj, value) => { obj.mtimeMs = value; } }, metadata: _metadata }, _mtimeMs_initializers, _mtimeMs_extraInitializers);
        __esDecorate(null, null, _ctimeMs_decorators, { kind: "field", name: "ctimeMs", static: false, private: false, access: { has: obj => "ctimeMs" in obj, get: obj => obj.ctimeMs, set: (obj, value) => { obj.ctimeMs = value; } }, metadata: _metadata }, _ctimeMs_initializers, _ctimeMs_extraInitializers);
        __esDecorate(null, null, _ino_decorators, { kind: "field", name: "ino", static: false, private: false, access: { has: obj => "ino" in obj, get: obj => obj.ino, set: (obj, value) => { obj.ino = value; } }, metadata: _metadata }, _ino_initializers, _ino_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Inode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Inode = _classThis;
})();



/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/async.js":
/*!***********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/async.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Async: () => (/* binding */ Async),
/* harmony export */   asyncPatch: () => (/* binding */ asyncPatch)
/* harmony export */ });
/* harmony import */ var _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../backends/store/fs.js */ "./src/node_modules/@zenfs/core/dist/backends/store/fs.js");
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../file.js */ "./src/node_modules/@zenfs/core/dist/file.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});




/**
 * Async() implements synchronous methods on an asynchronous file system
 *
 * Implementing classes must define `_sync` for the synchronous file system used as a cache.
 *
 * Synchronous methods on an asynchronous FS are implemented by performing operations over the in-memory copy,
 * while asynchronously pipelining them to the backing store.
 * During loading, the contents of the async file system are preloaded into the synchronous store.
 *
 */
function Async(FS) {
    class AsyncFS extends FS {
        constructor() {
            super(...arguments);
            /**
             * Queue of pending asynchronous operations.
             */
            this._queue = [];
            this._isInitialized = false;
        }
        get _queueRunning() {
            return !!this._queue.length;
        }
        queueDone() {
            return new Promise(resolve => {
                const check = () => (this._queueRunning ? setTimeout(check) : resolve());
                check();
            });
        }
        async ready() {
            await super.ready();
            await this.queueDone();
            if (this._isInitialized || this._disableSync) {
                return;
            }
            this.checkSync();
            await this._sync.ready();
            // optimization: for 2 storeFS', we copy at a lower abstraction level.
            if (this._sync instanceof _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_0__.StoreFS && this instanceof _backends_store_fs_js__WEBPACK_IMPORTED_MODULE_0__.StoreFS) {
                const sync = this._sync['store'].transaction();
                const async = this['store'].transaction();
                const promises = [];
                for (const key of await async.keys()) {
                    promises.push(async.get(key).then(data => sync.setSync(key, data)));
                }
                await Promise.all(promises);
                this._isInitialized = true;
                return;
            }
            try {
                await this.crossCopy('/');
                this._isInitialized = true;
            }
            catch (e) {
                this._isInitialized = false;
                throw e;
            }
        }
        checkSync(path, syscall) {
            if (this._disableSync) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.ENOTSUP, 'Sync caching has been disabled for this async file system', path, syscall);
            }
            if (!this._sync) {
                throw new _error_js__WEBPACK_IMPORTED_MODULE_2__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_2__.Errno.ENOTSUP, 'No sync cache is attached to this async file system', path, syscall);
            }
        }
        renameSync(oldPath, newPath) {
            this.checkSync(oldPath, 'rename');
            this._sync.renameSync(oldPath, newPath);
            this.queue('rename', oldPath, newPath);
        }
        statSync(path) {
            this.checkSync(path, 'stat');
            return this._sync.statSync(path);
        }
        createFileSync(path, flag, mode) {
            this.checkSync(path, 'createFile');
            this._sync.createFileSync(path, flag, mode);
            this.queue('createFile', path, flag, mode);
            return this.openFileSync(path, flag);
        }
        openFileSync(path, flag) {
            this.checkSync(path, 'openFile');
            const file = this._sync.openFileSync(path, flag + '+');
            const stats = file.statSync();
            const buffer = new Uint8Array(stats.size);
            file.readSync(buffer);
            return new _file_js__WEBPACK_IMPORTED_MODULE_3__.PreloadFile(this, path, flag, stats, buffer);
        }
        unlinkSync(path) {
            this.checkSync(path, 'unlinkSync');
            this._sync.unlinkSync(path);
            this.queue('unlink', path);
        }
        rmdirSync(path) {
            this.checkSync(path, 'rmdir');
            this._sync.rmdirSync(path);
            this.queue('rmdir', path);
        }
        mkdirSync(path, mode) {
            this.checkSync(path, 'mkdir');
            this._sync.mkdirSync(path, mode);
            this.queue('mkdir', path, mode);
        }
        readdirSync(path) {
            this.checkSync(path, 'readdir');
            return this._sync.readdirSync(path);
        }
        linkSync(srcpath, dstpath) {
            this.checkSync(srcpath, 'link');
            this._sync.linkSync(srcpath, dstpath);
            this.queue('link', srcpath, dstpath);
        }
        syncSync(path, data, stats) {
            this.checkSync(path, 'sync');
            this._sync.syncSync(path, data, stats);
            this.queue('sync', path, data, stats);
        }
        existsSync(path) {
            this.checkSync(path, 'exists');
            return this._sync.existsSync(path);
        }
        /**
         * @internal
         */
        async crossCopy(path) {
            this.checkSync(path, 'crossCopy');
            const stats = await this.stat(path);
            if (!stats.isDirectory()) {
                const env_1 = { stack: [], error: void 0, hasError: false };
                try {
                    const asyncFile = __addDisposableResource(env_1, await this.openFile(path, (0,_file_js__WEBPACK_IMPORTED_MODULE_3__.parseFlag)('r')), true);
                    const syncFile = __addDisposableResource(env_1, this._sync.createFileSync(path, (0,_file_js__WEBPACK_IMPORTED_MODULE_3__.parseFlag)('w'), stats.mode), false);
                    const buffer = new Uint8Array(stats.size);
                    await asyncFile.read(buffer);
                    syncFile.writeSync(buffer, 0, stats.size);
                    return;
                }
                catch (e_1) {
                    env_1.error = e_1;
                    env_1.hasError = true;
                }
                finally {
                    const result_1 = __disposeResources(env_1);
                    if (result_1)
                        await result_1;
                }
            }
            if (path !== '/') {
                const stats = await this.stat(path);
                this._sync.mkdirSync(path, stats.mode);
            }
            const promises = [];
            for (const file of await this.readdir(path)) {
                promises.push(this.crossCopy((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_1__.join)(path, file)));
            }
            await Promise.all(promises);
        }
        /**
         * @internal
         */
        async _next() {
            if (!this._queueRunning) {
                return;
            }
            const [method, ...args] = this._queue.shift();
            // @ts-expect-error 2556 (since ...args is not correctly picked up as being a tuple)
            await this[method](...args);
            await this._next();
        }
        /**
         * @internal
         */
        queue(...op) {
            this._queue.push(op);
            void this._next();
        }
    }
    return AsyncFS;
}
function asyncPatch(fs) { }


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/index.js":
/*!***********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Async: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.Async),
/* harmony export */   MutexLock: () => (/* reexport safe */ _mutexed_js__WEBPACK_IMPORTED_MODULE_1__.MutexLock),
/* harmony export */   Mutexed: () => (/* reexport safe */ _mutexed_js__WEBPACK_IMPORTED_MODULE_1__.Mutexed),
/* harmony export */   Readonly: () => (/* reexport safe */ _readonly_js__WEBPACK_IMPORTED_MODULE_2__.Readonly),
/* harmony export */   Sync: () => (/* reexport safe */ _sync_js__WEBPACK_IMPORTED_MODULE_4__.Sync),
/* harmony export */   _MutexedFS: () => (/* reexport safe */ _mutexed_js__WEBPACK_IMPORTED_MODULE_1__._MutexedFS),
/* harmony export */   asyncPatch: () => (/* reexport safe */ _async_js__WEBPACK_IMPORTED_MODULE_0__.asyncPatch)
/* harmony export */ });
/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async.js */ "./src/node_modules/@zenfs/core/dist/mixins/async.js");
/* harmony import */ var _mutexed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mutexed.js */ "./src/node_modules/@zenfs/core/dist/mixins/mutexed.js");
/* harmony import */ var _readonly_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./readonly.js */ "./src/node_modules/@zenfs/core/dist/mixins/readonly.js");
/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared.js */ "./src/node_modules/@zenfs/core/dist/mixins/shared.js");
/* harmony import */ var _sync_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sync.js */ "./src/node_modules/@zenfs/core/dist/mixins/sync.js");







/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/mutexed.js":
/*!*************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/mutexed.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MutexLock: () => (/* binding */ MutexLock),
/* harmony export */   Mutexed: () => (/* binding */ Mutexed),
/* harmony export */   _MutexedFS: () => (/* binding */ _MutexedFS)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");
/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../polyfills.js */ "./src/node_modules/@zenfs/core/dist/polyfills.js");
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});


class MutexLock {
    get isLocked() {
        return this._isLocked;
    }
    constructor(previous) {
        this.previous = previous;
        this.current = Promise.withResolvers();
        this._isLocked = true;
    }
    async done() {
        await this.previous?.done();
        await this.current.promise;
    }
    unlock() {
        this.current.resolve();
        this._isLocked = false;
    }
    [Symbol.dispose]() {
        this.unlock();
    }
}
/**
 * @hidden
 */
class _MutexedFS {
    async ready() {
        return await this._fs.ready();
    }
    metadata() {
        return this._fs.metadata();
    }
    /**
     * Adds a lock for a path
     */
    addLock() {
        const lock = new MutexLock(this.currentLock);
        this.currentLock = lock;
        return lock;
    }
    /**
     * Locks `path` asynchronously.
     * If the path is currently locked, waits for it to be unlocked.
     * @internal
     */
    async lock(path, syscall) {
        const previous = this.currentLock;
        const lock = this.addLock();
        const stack = new Error().stack;
        setTimeout(() => {
            if (lock.isLocked) {
                const error = _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EDEADLK', path, syscall);
                error.stack += stack?.slice('Error'.length);
                throw error;
            }
        }, 5000);
        await previous?.done();
        return lock;
    }
    /**
     * Locks `path` asynchronously.
     * If the path is currently locked, an error will be thrown
     * @internal
     */
    lockSync(path, syscall) {
        if (this.currentLock?.isLocked) {
            throw _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EBUSY', path, syscall);
        }
        return this.addLock();
    }
    /**
     * Whether `path` is locked
     * @internal
     */
    get isLocked() {
        return !!this.currentLock?.isLocked;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    async rename(oldPath, newPath) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_1, await this.lock(oldPath, 'rename'), false);
            await this._fs.rename(oldPath, newPath);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    renameSync(oldPath, newPath) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_2, this.lockSync(oldPath, 'rename'), false);
            return this._fs.renameSync(oldPath, newPath);
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            __disposeResources(env_2);
        }
    }
    async stat(path) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_3, await this.lock(path, 'stat'), false);
            return await this._fs.stat(path);
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            __disposeResources(env_3);
        }
    }
    statSync(path) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_4, this.lockSync(path, 'stat'), false);
            return this._fs.statSync(path);
        }
        catch (e_4) {
            env_4.error = e_4;
            env_4.hasError = true;
        }
        finally {
            __disposeResources(env_4);
        }
    }
    async openFile(path, flag) {
        const env_5 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_5, await this.lock(path, 'openFile'), false);
            const file = await this._fs.openFile(path, flag);
            file.fs = this;
            return file;
        }
        catch (e_5) {
            env_5.error = e_5;
            env_5.hasError = true;
        }
        finally {
            __disposeResources(env_5);
        }
    }
    openFileSync(path, flag) {
        const env_6 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_6, this.lockSync(path, 'openFile'), false);
            const file = this._fs.openFileSync(path, flag);
            file.fs = this;
            return file;
        }
        catch (e_6) {
            env_6.error = e_6;
            env_6.hasError = true;
        }
        finally {
            __disposeResources(env_6);
        }
    }
    async createFile(path, flag, mode) {
        const env_7 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_7, await this.lock(path, 'createFile'), false);
            const file = await this._fs.createFile(path, flag, mode);
            file.fs = this;
            return file;
        }
        catch (e_7) {
            env_7.error = e_7;
            env_7.hasError = true;
        }
        finally {
            __disposeResources(env_7);
        }
    }
    createFileSync(path, flag, mode) {
        const env_8 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_8, this.lockSync(path, 'createFile'), false);
            const file = this._fs.createFileSync(path, flag, mode);
            file.fs = this;
            return file;
        }
        catch (e_8) {
            env_8.error = e_8;
            env_8.hasError = true;
        }
        finally {
            __disposeResources(env_8);
        }
    }
    async unlink(path) {
        const env_9 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_9, await this.lock(path, 'unlink'), false);
            await this._fs.unlink(path);
        }
        catch (e_9) {
            env_9.error = e_9;
            env_9.hasError = true;
        }
        finally {
            __disposeResources(env_9);
        }
    }
    unlinkSync(path) {
        const env_10 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_10, this.lockSync(path, 'unlink'), false);
            return this._fs.unlinkSync(path);
        }
        catch (e_10) {
            env_10.error = e_10;
            env_10.hasError = true;
        }
        finally {
            __disposeResources(env_10);
        }
    }
    async rmdir(path) {
        const env_11 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_11, await this.lock(path, 'rmdir'), false);
            await this._fs.rmdir(path);
        }
        catch (e_11) {
            env_11.error = e_11;
            env_11.hasError = true;
        }
        finally {
            __disposeResources(env_11);
        }
    }
    rmdirSync(path) {
        const env_12 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_12, this.lockSync(path, 'rmdir'), false);
            return this._fs.rmdirSync(path);
        }
        catch (e_12) {
            env_12.error = e_12;
            env_12.hasError = true;
        }
        finally {
            __disposeResources(env_12);
        }
    }
    async mkdir(path, mode) {
        const env_13 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_13, await this.lock(path, 'mkdir'), false);
            await this._fs.mkdir(path, mode);
        }
        catch (e_13) {
            env_13.error = e_13;
            env_13.hasError = true;
        }
        finally {
            __disposeResources(env_13);
        }
    }
    mkdirSync(path, mode) {
        const env_14 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_14, this.lockSync(path, 'mkdir'), false);
            return this._fs.mkdirSync(path, mode);
        }
        catch (e_14) {
            env_14.error = e_14;
            env_14.hasError = true;
        }
        finally {
            __disposeResources(env_14);
        }
    }
    async readdir(path) {
        const env_15 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_15, await this.lock(path, 'readdir'), false);
            return await this._fs.readdir(path);
        }
        catch (e_15) {
            env_15.error = e_15;
            env_15.hasError = true;
        }
        finally {
            __disposeResources(env_15);
        }
    }
    readdirSync(path) {
        const env_16 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_16, this.lockSync(path, 'readdir'), false);
            return this._fs.readdirSync(path);
        }
        catch (e_16) {
            env_16.error = e_16;
            env_16.hasError = true;
        }
        finally {
            __disposeResources(env_16);
        }
    }
    async exists(path) {
        const env_17 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_17, await this.lock(path, 'exists'), false);
            return await this._fs.exists(path);
        }
        catch (e_17) {
            env_17.error = e_17;
            env_17.hasError = true;
        }
        finally {
            __disposeResources(env_17);
        }
    }
    existsSync(path) {
        const env_18 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_18, this.lockSync(path, 'exists'), false);
            return this._fs.existsSync(path);
        }
        catch (e_18) {
            env_18.error = e_18;
            env_18.hasError = true;
        }
        finally {
            __disposeResources(env_18);
        }
    }
    async link(srcpath, dstpath) {
        const env_19 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_19, await this.lock(srcpath, 'link'), false);
            await this._fs.link(srcpath, dstpath);
        }
        catch (e_19) {
            env_19.error = e_19;
            env_19.hasError = true;
        }
        finally {
            __disposeResources(env_19);
        }
    }
    linkSync(srcpath, dstpath) {
        const env_20 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_20, this.lockSync(srcpath, 'link'), false);
            return this._fs.linkSync(srcpath, dstpath);
        }
        catch (e_20) {
            env_20.error = e_20;
            env_20.hasError = true;
        }
        finally {
            __disposeResources(env_20);
        }
    }
    async sync(path, data, stats) {
        const env_21 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_21, await this.lock(path, 'sync'), false);
            await this._fs.sync(path, data, stats);
        }
        catch (e_21) {
            env_21.error = e_21;
            env_21.hasError = true;
        }
        finally {
            __disposeResources(env_21);
        }
    }
    syncSync(path, data, stats) {
        const env_22 = { stack: [], error: void 0, hasError: false };
        try {
            const _ = __addDisposableResource(env_22, this.lockSync(path, 'sync'), false);
            return this._fs.syncSync(path, data, stats);
        }
        catch (e_22) {
            env_22.error = e_22;
            env_22.hasError = true;
        }
        finally {
            __disposeResources(env_22);
        }
    }
}
/**
 * This serializes access to an underlying async filesystem.
 * For example, on an OverlayFS instance with an async lower
 * directory operations like rename and rmdir may involve multiple
 * requests involving both the upper and lower file systems -- they
 * are not executed in a single atomic step. OverlayFS uses this
 * to avoid having to reason about the correctness of
 * multiple requests interleaving.
 *
 * @privateRemarks
 * Instead of extending the passed class, `MutexedFS` stores it internally.
 * This is to avoid a deadlock caused when a method calls another one
 * The problem is discussed extensively in [#78](https://github.com/zen-fs/core/issues/78)
 * Instead of extending `FileSystem`,
 * `MutexedFS` implements it in order to make sure all of the methods are passed through
 *
 * @todo Change `using _` to `using void` pending https://github.com/tc39/proposal-discard-binding
 * @internal
 */
function Mutexed(FS) {
    class MutexedFS extends _MutexedFS {
        constructor(...args) {
            super();
            this._fs = new FS(...args);
        }
    }
    return MutexedFS;
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/readonly.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/readonly.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Readonly: () => (/* binding */ Readonly)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error.js */ "./src/node_modules/@zenfs/core/dist/error.js");

/**
 * Implements the non-readonly methods to throw `EROFS`
 */
/* eslint-disable @typescript-eslint/require-await */
function Readonly(FS) {
    class ReadonlyFS extends FS {
        metadata() {
            return { ...super.metadata(), readonly: true };
        }
        async rename() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        renameSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async createFile() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        createFileSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async unlink() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        unlinkSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async rmdir() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        rmdirSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async mkdir() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        mkdirSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async link() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        linkSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        async sync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
        syncSync() {
            throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_0__.Errno.EROFS);
        }
    }
    return ReadonlyFS;
}
/* eslint-enable @typescript-eslint/require-await */


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/shared.js":
/*!************************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/shared.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
    Code shared by various mixins
*/



/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/mixins/sync.js":
/*!**********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/mixins/sync.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sync: () => (/* binding */ Sync)
/* harmony export */ });
/**
 * Implements the asynchronous API in terms of the synchronous API.
 */
/* eslint-disable @typescript-eslint/require-await */
function Sync(FS) {
    class SyncFS extends FS {
        async exists(path) {
            return this.existsSync(path);
        }
        async rename(oldPath, newPath) {
            return this.renameSync(oldPath, newPath);
        }
        async stat(path) {
            return this.statSync(path);
        }
        async createFile(path, flag, mode) {
            return this.createFileSync(path, flag, mode);
        }
        async openFile(path, flag) {
            return this.openFileSync(path, flag);
        }
        async unlink(path) {
            return this.unlinkSync(path);
        }
        async rmdir(path) {
            return this.rmdirSync(path);
        }
        async mkdir(path, mode) {
            return this.mkdirSync(path, mode);
        }
        async readdir(path) {
            return this.readdirSync(path);
        }
        async link(srcpath, dstpath) {
            return this.linkSync(srcpath, dstpath);
        }
        async sync(path, data, stats) {
            return this.syncSync(path, data, stats);
        }
    }
    return SyncFS;
}
/* eslint-enable @typescript-eslint/require-await */


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/polyfills.js":
/*!********************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/polyfills.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// eslint-disable-next-line @typescript-eslint/unbound-method
Promise.withResolvers ?? (Promise.withResolvers = function () {
    let _resolve, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _reject;
    const promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
    return { promise, resolve: _resolve, reject: _reject };
});
/*
    A polyfill for when these symbols are undefined.
    For some reason, NodeJS does not polyfill them in a VM context.
    Since jest uses a VM context for ESM, these need to be here.
*/
// @ts-expect-error 2540
Symbol['dispose'] ?? (Symbol['dispose'] = Symbol('Symbol.dispose'));
// @ts-expect-error 2540
Symbol['asyncDispose'] ?? (Symbol['asyncDispose'] = Symbol('Symbol.asyncDispose'));



/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/stats.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/stats.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BigIntStats: () => (/* binding */ BigIntStats),
/* harmony export */   BigIntStatsFs: () => (/* binding */ BigIntStatsFs),
/* harmony export */   Stats: () => (/* binding */ Stats),
/* harmony export */   StatsCommon: () => (/* binding */ StatsCommon),
/* harmony export */   StatsFs: () => (/* binding */ StatsFs),
/* harmony export */   ZenFsType: () => (/* binding */ ZenFsType),
/* harmony export */   isStatsEqual: () => (/* binding */ isStatsEqual)
/* harmony export */ });
/* harmony import */ var _credentials_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./credentials.js */ "./src/node_modules/@zenfs/core/dist/credentials.js");
/* harmony import */ var _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emulation/constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");


/**
 * Provides information about a particular entry in the file system.
 * Common code used by both Stats and BigIntStats.
 */
class StatsCommon {
    _convert(arg) {
        return (this._isBigint ? BigInt(arg) : Number(arg));
    }
    get blocks() {
        return this._convert(Math.ceil(Number(this.size) / 512));
    }
    get atime() {
        return new Date(Number(this.atimeMs));
    }
    set atime(value) {
        this.atimeMs = this._convert(value.getTime());
    }
    get mtime() {
        return new Date(Number(this.mtimeMs));
    }
    set mtime(value) {
        this.mtimeMs = this._convert(value.getTime());
    }
    get ctime() {
        return new Date(Number(this.ctimeMs));
    }
    set ctime(value) {
        this.ctimeMs = this._convert(value.getTime());
    }
    get birthtime() {
        return new Date(Number(this.birthtimeMs));
    }
    set birthtime(value) {
        this.birthtimeMs = this._convert(value.getTime());
    }
    /**
     * Creates a new stats instance from a stats-like object. Can be used to copy stats (note)
     */
    constructor({ atimeMs, mtimeMs, ctimeMs, birthtimeMs, uid, gid, size, mode, ino } = {}) {
        /**
         * ID of device containing file
         */
        this.dev = this._convert(0);
        /**
         * Inode number
         */
        this.ino = this._convert(0);
        /**
         * Device ID (if special file)
         */
        this.rdev = this._convert(0);
        /**
         * Number of hard links
         */
        this.nlink = this._convert(1);
        /**
         * Block size for file system I/O
         */
        this.blksize = this._convert(4096);
        /**
         * User ID of owner
         */
        this.uid = this._convert(0);
        /**
         * Group ID of owner
         */
        this.gid = this._convert(0);
        const now = Date.now();
        this.atimeMs = this._convert(atimeMs ?? now);
        this.mtimeMs = this._convert(mtimeMs ?? now);
        this.ctimeMs = this._convert(ctimeMs ?? now);
        this.birthtimeMs = this._convert(birthtimeMs ?? now);
        this.uid = this._convert(uid ?? 0);
        this.gid = this._convert(gid ?? 0);
        this.size = this._convert(size ?? 0);
        this.ino = this._convert(ino ?? 0);
        this.mode = this._convert(mode ?? 0o644 & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG);
        if ((this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) == 0) {
            this.mode = (this.mode | this._convert(_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG));
        }
    }
    isFile() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG;
    }
    isDirectory() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR;
    }
    isSymbolicLink() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFLNK;
    }
    isSocket() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFSOCK;
    }
    isBlockDevice() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFBLK;
    }
    isCharacterDevice() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFCHR;
    }
    isFIFO() {
        return (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) === _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFIFO;
    }
    /**
     * Checks if a given user/group has access to this item
     * @param mode The requested access, combination of W_OK, R_OK, and X_OK
     * @returns True if the request has access, false if the request does not
     * @internal
     */
    hasAccess(mode) {
        if (_credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.euid === 0 || _credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.egid === 0) {
            // Running as root
            return true;
        }
        let perm = 0;
        // Owner permissions
        if (_credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.uid === this.uid) {
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IRUSR)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.R_OK;
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IWUSR)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.W_OK;
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IXUSR)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.X_OK;
        }
        // Group permissions
        if (_credentials_js__WEBPACK_IMPORTED_MODULE_0__.credentials.gid === this.gid) {
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IRGRP)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.R_OK;
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IWGRP)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.W_OK;
            if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IXGRP)
                perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.X_OK;
        }
        // Others permissions
        if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IROTH)
            perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.R_OK;
        if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IWOTH)
            perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.W_OK;
        if (this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IXOTH)
            perm |= _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.X_OK;
        // Perform the access check
        return (perm & mode) === mode;
    }
    /**
     * Convert the current stats object into a credentials object
     * @internal
     */
    cred(uid = Number(this.uid), gid = Number(this.gid)) {
        return {
            uid,
            gid,
            suid: Number(this.uid),
            sgid: Number(this.gid),
            euid: uid,
            egid: gid,
        };
    }
    /**
     * Change the mode of the file.
     * We use this helper function to prevent messing up the type of the file.
     * @internal
     */
    chmod(mode) {
        this.mode = this._convert((this.mode & _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFMT) | mode);
    }
    /**
     * Change the owner user/group of the file.
     * This function makes sure it is a valid UID/GID (that is, a 32 unsigned int)
     * @internal
     */
    chown(uid, gid) {
        uid = Number(uid);
        gid = Number(gid);
        if (!isNaN(uid) && 0 <= uid && uid < 2 ** 32) {
            this.uid = this._convert(uid);
        }
        if (!isNaN(gid) && 0 <= gid && gid < 2 ** 32) {
            this.gid = this._convert(gid);
        }
    }
    get atimeNs() {
        return BigInt(this.atimeMs) * 1000n;
    }
    get mtimeNs() {
        return BigInt(this.mtimeMs) * 1000n;
    }
    get ctimeNs() {
        return BigInt(this.ctimeMs) * 1000n;
    }
    get birthtimeNs() {
        return BigInt(this.birthtimeMs) * 1000n;
    }
}
/**
 * Implementation of Node's `Stats`.
 *
 * Attribute descriptions are from `man 2 stat'
 * @see http://nodejs.org/api/fs.html#fs_class_fs_stats
 * @see http://man7.org/linux/man-pages/man2/stat.2.html
 */
class Stats extends StatsCommon {
    constructor() {
        super(...arguments);
        this._isBigint = false;
    }
}
Stats;
/**
 * Stats with bigint
 */
class BigIntStats extends StatsCommon {
    constructor() {
        super(...arguments);
        this._isBigint = true;
    }
}
/**
 * Determines if the file stats have changed by comparing relevant properties.
 *
 * @param left The previous stats.
 * @param right The current stats.
 * @returns `true` if stats have changed; otherwise, `false`.
 * @internal
 */
function isStatsEqual(left, right) {
    return left.size == right.size && +left.atime == +right.atime && +left.mtime == +right.mtime && +left.ctime == +right.ctime && left.mode == right.mode;
}
/** @internal */
const ZenFsType = 0x7a656e6673; // 'z' 'e' 'n' 'f' 's'
/**
 * @hidden
 */
class StatsFs {
    constructor() {
        /** Type of file system. */
        this.type = 0x7a656e6673;
        /**  Optimal transfer block size. */
        this.bsize = 4096;
        /**  Total data blocks in file system. */
        this.blocks = 0;
        /** Free blocks in file system. */
        this.bfree = 0;
        /** Available blocks for unprivileged users */
        this.bavail = 0;
        /** Total file nodes in file system. */
        this.files = _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max;
        /** Free file nodes in file system. */
        this.ffree = _emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max;
    }
}
/**
 * @hidden
 */
class BigIntStatsFs {
    constructor() {
        /** Type of file system. */
        this.type = 0x7a656e6673n;
        /**  Optimal transfer block size. */
        this.bsize = 4096n;
        /**  Total data blocks in file system. */
        this.blocks = 0n;
        /** Free blocks in file system. */
        this.bfree = 0n;
        /** Available blocks for unprivileged users */
        this.bavail = 0n;
        /** Total file nodes in file system. */
        this.files = BigInt(_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max);
        /** Free file nodes in file system. */
        this.ffree = BigInt(_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.size_max);
    }
}


/***/ }),

/***/ "./src/node_modules/@zenfs/core/dist/utils.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/core/dist/utils.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decode: () => (/* binding */ decodeUTF8),
/* harmony export */   decodeDirListing: () => (/* binding */ decodeDirListing),
/* harmony export */   decodeRaw: () => (/* binding */ decodeRaw),
/* harmony export */   decodeUTF8: () => (/* binding */ decodeUTF8),
/* harmony export */   encode: () => (/* binding */ encodeUTF8),
/* harmony export */   encodeDirListing: () => (/* binding */ encodeDirListing),
/* harmony export */   encodeRaw: () => (/* binding */ encodeRaw),
/* harmony export */   encodeUTF8: () => (/* binding */ encodeUTF8),
/* harmony export */   levenshtein: () => (/* binding */ levenshtein),
/* harmony export */   mkdirpSync: () => (/* binding */ mkdirpSync),
/* harmony export */   normalizeMode: () => (/* binding */ normalizeMode),
/* harmony export */   normalizeOptions: () => (/* binding */ normalizeOptions),
/* harmony export */   normalizePath: () => (/* binding */ normalizePath),
/* harmony export */   normalizeTime: () => (/* binding */ normalizeTime),
/* harmony export */   randomBigInt: () => (/* binding */ randomBigInt)
/* harmony export */ });
/* harmony import */ var _emulation_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.js */ "./src/node_modules/@zenfs/core/dist/error.js");


/**
 * Synchronous recursive makedir.
 * @hidden
 */
function mkdirpSync(path, mode, fs) {
    if (!fs.existsSync(path)) {
        mkdirpSync((0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.dirname)(path), mode, fs);
        fs.mkdirSync(path, mode);
    }
}
function _min(d0, d1, d2, bx, ay) {
    return Math.min(d0 + 1, d1 + 1, d2 + 1, bx === ay ? d1 : d1 + 1);
}
/**
 * Calculates levenshtein distance.
 * @hidden
 */
function levenshtein(a, b) {
    if (a === b) {
        return 0;
    }
    if (a.length > b.length) {
        [a, b] = [b, a]; // Swap a and b
    }
    let la = a.length;
    let lb = b.length;
    // Trim common suffix
    while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
        la--;
        lb--;
    }
    let offset = 0;
    // Trim common prefix
    while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
        offset++;
    }
    la -= offset;
    lb -= offset;
    if (la === 0 || lb === 1) {
        return lb;
    }
    const vector = new Array(la << 1);
    for (let y = 0; y < la;) {
        vector[la + y] = a.charCodeAt(offset + y);
        vector[y] = ++y;
    }
    let x;
    let d0;
    let d1;
    let d2;
    let d3;
    for (x = 0; x + 3 < lb;) {
        const bx0 = b.charCodeAt(offset + (d0 = x));
        const bx1 = b.charCodeAt(offset + (d1 = x + 1));
        const bx2 = b.charCodeAt(offset + (d2 = x + 2));
        const bx3 = b.charCodeAt(offset + (d3 = x + 3));
        let dd = (x += 4);
        for (let y = 0; y < la;) {
            const ay = vector[la + y];
            const dy = vector[y];
            d0 = _min(dy, d0, d1, bx0, ay);
            d1 = _min(d0, d1, d2, bx1, ay);
            d2 = _min(d1, d2, d3, bx2, ay);
            dd = _min(d2, d3, dd, bx3, ay);
            vector[y++] = dd;
            d3 = d2;
            d2 = d1;
            d1 = d0;
            d0 = dy;
        }
    }
    let dd = 0;
    for (; x < lb;) {
        const bx0 = b.charCodeAt(offset + (d0 = x));
        dd = ++x;
        for (let y = 0; y < la; y++) {
            const dy = vector[y];
            vector[y] = dd = dy < d0 || dd < d0 ? (dy > dd ? dd + 1 : dy + 1) : bx0 === vector[la + y] ? d0 : d0 + 1;
            d0 = dy;
        }
    }
    return dd;
}
/**
 * Encodes a string into a buffer
 * @internal
 */
function encodeRaw(input) {
    if (typeof input != 'string') {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Can not encode a non-string');
    }
    return new Uint8Array(Array.from(input).map(char => char.charCodeAt(0)));
}
/**
 * Decodes a string from a buffer
 * @internal
 */
function decodeRaw(input) {
    if (!(input instanceof Uint8Array)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Can not decode a non-Uint8Array');
    }
    return Array.from(input)
        .map(char => String.fromCharCode(char))
        .join('');
}
const encoder = new TextEncoder();
/**
 * Encodes a string into a buffer
 * @internal
 */
function encodeUTF8(input) {
    if (typeof input != 'string') {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Can not encode a non-string');
    }
    return encoder.encode(input);
}

const decoder = new TextDecoder();
/**
 * Decodes a string from a buffer
 * @internal
 */
function decodeUTF8(input) {
    if (!(input instanceof Uint8Array)) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Can not decode a non-Uint8Array');
    }
    return decoder.decode(input);
}

/**
 * Decodes a directory listing
 * @hidden
 */
function decodeDirListing(data) {
    return JSON.parse(decodeUTF8(data), (k, v) => (k == '' ? v : BigInt(v)));
}
/**
 * Encodes a directory listing
 * @hidden
 */
function encodeDirListing(data) {
    return encodeUTF8(JSON.stringify(data, (k, v) => (k == '' ? v : v.toString())));
}
/**
 * Normalizes a mode
 * @internal
 */
function normalizeMode(mode, def) {
    if (typeof mode == 'number') {
        return mode;
    }
    if (typeof mode == 'string') {
        const parsed = parseInt(mode, 8);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    if (typeof def == 'number') {
        return def;
    }
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid mode: ' + mode?.toString());
}
/**
 * Normalizes a time
 * @internal
 */
function normalizeTime(time) {
    if (time instanceof Date) {
        return time;
    }
    try {
        return new Date(time);
    }
    catch {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Invalid time.');
    }
}
/**
 * Normalizes a path
 * @internal
 */
function normalizePath(p) {
    p = p.toString();
    if (p.includes('\x00')) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Path can not contain null character');
    }
    if (p.length == 0) {
        throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.ErrnoError(_error_js__WEBPACK_IMPORTED_MODULE_1__.Errno.EINVAL, 'Path can not be empty');
    }
    return (0,_emulation_path_js__WEBPACK_IMPORTED_MODULE_0__.resolve)(p.replaceAll(/[/\\]+/g, '/'));
}
/**
 * Normalizes options
 * @param options options to normalize
 * @param encoding default encoding
 * @param flag default flag
 * @param mode default mode
 * @internal
 */
function normalizeOptions(options, encoding = 'utf8', flag, mode = 0) {
    if (typeof options != 'object' || options === null) {
        return {
            encoding: typeof options == 'string' ? options : encoding ?? null,
            flag,
            mode,
        };
    }
    return {
        encoding: typeof options?.encoding == 'string' ? options.encoding : encoding ?? null,
        flag: typeof options?.flag == 'string' ? options.flag : flag,
        mode: normalizeMode('mode' in options ? options?.mode : null, mode),
    };
}
/**
 * Generate a random ino
 * @internal
 */
function randomBigInt() {
    return crypto.getRandomValues(new BigUint64Array(1))[0];
}


/***/ }),

/***/ "./src/node_modules/@zenfs/dom/dist/IndexedDB.js":
/*!*******************************************************!*\
  !*** ./src/node_modules/@zenfs/dom/dist/IndexedDB.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IndexedDB: () => (/* binding */ IndexedDB),
/* harmony export */   IndexedDBStore: () => (/* binding */ IndexedDBStore),
/* harmony export */   IndexedDBTransaction: () => (/* binding */ IndexedDBTransaction)
/* harmony export */ });
/* harmony import */ var _zenfs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zenfs/core */ "./src/node_modules/@zenfs/core/dist/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/node_modules/@zenfs/dom/dist/utils.js");


function wrap(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = e => {
            e.preventDefault();
            reject((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.convertException)(request.error));
        };
    });
}
/**
 * @hidden
 */
class IndexedDBTransaction extends _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.AsyncTransaction {
    constructor(tx, store) {
        super(store);
        this.tx = tx;
        this.store = store;
        this._idb = tx.objectStore(store.name);
    }
    async keys() {
        return (await wrap(this._idb.getAllKeys())).filter(k => typeof k == 'string').map(k => BigInt(k));
    }
    get(key) {
        return wrap(this._idb.get(key.toString()));
    }
    async set(key, data) {
        await wrap(this._idb.put(data, key.toString()));
    }
    remove(key) {
        return wrap(this._idb.delete(key.toString()));
    }
    async commit() {
        if (this.done) {
            return;
        }
        const { promise, resolve, reject } = Promise.withResolvers();
        this.done = true;
        this.tx.oncomplete = () => resolve();
        this.tx.onerror = () => reject((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.convertException)(this.tx.error));
        this.tx.commit();
        return promise;
    }
    async abort() {
        if (this.done) {
            return;
        }
        this.done = true;
        const { promise, resolve, reject } = Promise.withResolvers();
        this.tx.onabort = () => resolve();
        this.tx.onerror = () => reject((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.convertException)(this.tx.error));
        this.tx.abort();
        return promise;
    }
}
async function createDB(name, indexedDB = globalThis.indexedDB) {
    const req = indexedDB.open(name);
    req.onupgradeneeded = () => {
        const db = req.result;
        // This should never happen; we're at version 1. Why does another database exist?
        if (db.objectStoreNames.contains(name)) {
            db.deleteObjectStore(name);
        }
        db.createObjectStore(name);
    };
    const result = await wrap(req);
    return result;
}
class IndexedDBStore {
    constructor(db) {
        this.db = db;
    }
    sync() {
        throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'IndexedDBStore.sync');
    }
    get name() {
        return this.db.name;
    }
    clear() {
        return wrap(this.db.transaction(this.name, 'readwrite').objectStore(this.name).clear());
    }
    clearSync() {
        throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOSYS', undefined, 'IndexedDBStore.clearSync');
    }
    transaction() {
        const tx = this.db.transaction(this.name, 'readwrite');
        return new IndexedDBTransaction(tx, this);
    }
}
/**
 * A file system that uses the IndexedDB key value file system.
 */
const _IndexedDB = {
    name: 'IndexedDB',
    options: {
        storeName: {
            type: 'string',
            required: false,
        },
        idbFactory: {
            type: 'object',
            required: false,
        },
    },
    async isAvailable(idbFactory = globalThis.indexedDB) {
        try {
            if (!(idbFactory instanceof IDBFactory)) {
                return false;
            }
            const req = idbFactory.open('__zenfs_test');
            await wrap(req);
            return true;
        }
        catch {
            return false;
        }
        finally {
            idbFactory.deleteDatabase('__zenfs_test');
        }
    },
    async create(options) {
        const db = await createDB(options.storeName || 'zenfs', options.idbFactory);
        const store = new IndexedDBStore(db);
        const fs = new ((0,_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Async)(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.StoreFS))(store);
        if (!options?.disableAsyncCache) {
            fs._sync = _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.InMemory.create({ name: 'idb-cache' });
        }
        return fs;
    },
};
const IndexedDB = _IndexedDB;


/***/ }),

/***/ "./src/node_modules/@zenfs/dom/dist/Storage.js":
/*!*****************************************************!*\
  !*** ./src/node_modules/@zenfs/dom/dist/Storage.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebStorage: () => (/* binding */ WebStorage),
/* harmony export */   WebStorageStore: () => (/* binding */ WebStorageStore)
/* harmony export */ });
/* harmony import */ var _zenfs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zenfs/core */ "./src/node_modules/@zenfs/core/dist/index.js");

/**
 * A synchronous key-value store backed by Storage.
 */
class WebStorageStore {
    get name() {
        return WebStorage.name;
    }
    constructor(storage) {
        this.storage = storage;
    }
    clear() {
        this.storage.clear();
    }
    clearSync() {
        this.storage.clear();
    }
    async sync() { }
    transaction() {
        // No need to differentiate.
        return new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.SimpleTransaction(this);
    }
    keys() {
        return Object.keys(this.storage).map(k => BigInt(k));
    }
    get(key) {
        const data = this.storage.getItem(key.toString());
        if (typeof data != 'string') {
            return;
        }
        return (0,_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.encodeRaw)(data);
    }
    set(key, data) {
        try {
            this.storage.setItem(key.toString(), (0,_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.decodeRaw)(data));
        }
        catch {
            throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.ENOSPC, 'Storage is full.');
        }
    }
    delete(key) {
        try {
            this.storage.removeItem(key.toString());
        }
        catch (e) {
            throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO, 'Unable to delete key ' + key + ': ' + e);
        }
    }
}
/**
 * A synchronous file system backed by a `Storage` (e.g. localStorage).
 */
const _WebStorage = {
    name: 'WebStorage',
    options: {
        storage: {
            type: 'object',
            required: false,
            description: 'The Storage to use. Defaults to globalThis.localStorage.',
        },
    },
    /**
     * @todo Consider replacing `instanceof` with a duck-typing check?
     */
    isAvailable(storage = globalThis.localStorage) {
        return storage instanceof globalThis.Storage;
    },
    create({ storage = globalThis.localStorage }) {
        return new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.StoreFS(new WebStorageStore(storage));
    },
};
const WebStorage = _WebStorage;


/***/ }),

/***/ "./src/node_modules/@zenfs/dom/dist/access.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@zenfs/dom/dist/access.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebAccess: () => (/* binding */ WebAccess),
/* harmony export */   WebAccessFS: () => (/* binding */ WebAccessFS)
/* harmony export */ });
/* harmony import */ var _zenfs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zenfs/core */ "./src/node_modules/@zenfs/core/dist/index.js");
/* harmony import */ var _zenfs_core_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @zenfs/core/emulation/constants.js */ "./src/node_modules/@zenfs/core/dist/emulation/constants.js");
/* harmony import */ var _zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @zenfs/core/emulation/path.js */ "./src/node_modules/@zenfs/core/dist/emulation/path.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/node_modules/@zenfs/dom/dist/utils.js");




class WebAccessFS extends (0,_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Async)(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.FileSystem) {
    constructor(handle) {
        super();
        this._handles = new Map();
        /**
         * @hidden
         */
        this._sync = _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.InMemory.create({ name: 'accessfs-cache' });
        this._handles.set('/', handle);
    }
    metadata() {
        return {
            ...super.metadata(),
            name: 'WebAccess',
            noResizableBuffers: true,
        };
    }
    async sync(path, data) {
        await this.writeFile(path, data);
    }
    async rename(oldPath, newPath) {
        const handle = await this.getHandle(oldPath);
        if (handle instanceof FileSystemDirectoryHandle) {
            const files = await this.readdir(oldPath);
            await this.mkdir(newPath);
            if (!files.length) {
                await this.unlink(oldPath);
                return;
            }
            for (const file of files) {
                await this.rename((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.join)(oldPath, file), (0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.join)(newPath, file));
                await this.unlink(oldPath);
            }
            return;
        }
        if (!(handle instanceof FileSystemFileHandle)) {
            throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.ENOTSUP, 'Not a file or directory handle', oldPath, 'rename');
        }
        const oldFile = await handle.getFile().catch((ex) => {
            throw (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.convertException)(ex, oldPath, 'rename');
        }), destFolder = await this.getHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(newPath));
        if (!(destFolder instanceof FileSystemDirectoryHandle)) {
            return;
        }
        const newFile = await destFolder.getFileHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(newPath), { create: true }).catch((ex) => {
            throw (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.convertException)(ex, newPath, 'rename');
        });
        const writable = await newFile.createWritable();
        await writable.write(await oldFile.arrayBuffer());
        await writable.close();
        await this.unlink(oldPath);
    }
    async writeFile(path, data) {
        if (data.buffer.resizable) {
            throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.EINVAL, 'Resizable buffers can not be written', path, 'write');
        }
        const handle = await this.getHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(path));
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            return;
        }
        const file = await handle.getFileHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(path), { create: true });
        const writable = await file.createWritable();
        await writable.write(data);
        await writable.close();
    }
    async createFile(path, flag) {
        await this.writeFile(path, new Uint8Array());
        return this.openFile(path, flag);
    }
    async stat(path) {
        const handle = await this.getHandle(path);
        if (!handle) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOENT', path, 'stat');
        }
        if (handle instanceof FileSystemDirectoryHandle) {
            return new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Stats({ mode: 0o777 | _zenfs_core_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFDIR, size: 4096 });
        }
        if (handle instanceof FileSystemFileHandle) {
            const { lastModified, size } = await handle.getFile();
            return new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Stats({ mode: 0o777 | _zenfs_core_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG, size, mtimeMs: lastModified });
        }
        throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.EBADE, 'Handle is not a directory or file', path, 'stat');
    }
    async openFile(path, flag) {
        const handle = await this.getHandle(path);
        if (!(handle instanceof FileSystemFileHandle)) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EISDIR', path, 'openFile');
        }
        const file = await handle.getFile().catch((ex) => {
            throw (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.convertException)(ex, path, 'openFile');
        });
        const data = new Uint8Array(await file.arrayBuffer());
        const stats = new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Stats({ mode: 0o777 | _zenfs_core_emulation_constants_js__WEBPACK_IMPORTED_MODULE_1__.S_IFREG, size: file.size, mtimeMs: file.lastModified });
        return new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.PreloadFile(this, path, flag, stats, data);
    }
    async unlink(path) {
        const handle = await this.getHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(path));
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOTDIR', (0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(path), 'unlink');
        }
        await handle.removeEntry((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(path), { recursive: true }).catch((ex) => {
            throw (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.convertException)(ex, path, 'unlink');
        });
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async link(srcpath) {
        return;
    }
    async rmdir(path) {
        return this.unlink(path);
    }
    async mkdir(path) {
        const existingHandle = await this.getHandle(path).catch((ex) => {
            if (ex.code != 'ENOENT') {
                throw ex;
            }
        });
        if (existingHandle) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('EEXIST', path, 'mkdir');
        }
        const handle = await this.getHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.dirname)(path));
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOTDIR', path, 'mkdir');
        }
        await handle.getDirectoryHandle((0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.basename)(path), { create: true });
    }
    async readdir(path) {
        const handle = await this.getHandle(path);
        if (!(handle instanceof FileSystemDirectoryHandle)) {
            throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOTDIR', path, 'readdir');
        }
        const entries = [];
        for await (const k of handle.keys()) {
            entries.push(k);
        }
        return entries;
    }
    async getHandle(path) {
        if (this._handles.has(path)) {
            return this._handles.get(path);
        }
        let walked = '/';
        for (const part of path.split('/').slice(1)) {
            const handle = this._handles.get(walked);
            if (!(handle instanceof FileSystemDirectoryHandle)) {
                throw _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError.With('ENOTDIR', walked, 'getHandle');
            }
            walked = (0,_zenfs_core_emulation_path_js__WEBPACK_IMPORTED_MODULE_2__.join)(walked, part);
            const child = await handle.getDirectoryHandle(part).catch((ex) => {
                switch (ex.name) {
                    case 'TypeMismatchError':
                        return handle.getFileHandle(part).catch((ex) => {
                            //throw convertException(ex, walked, 'getHandle');
                        });
                    case 'TypeError':
                        throw new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(_zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.ENOENT, ex.message, walked, 'getHandle');
                    default:
                        throw (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.convertException)(ex, walked, 'getHandle');
                }
            });
            if (child)
                this._handles.set(walked, child);
        }
        return this._handles.get(path);
    }
}
const _WebAccess = {
    name: 'WebAccess',
    options: {
        handle: {
            type: 'object',
            required: true,
            description: 'The directory handle to use for the root',
        },
    },
    isAvailable() {
        return typeof FileSystemHandle == 'function';
    },
    create(options) {
        return new WebAccessFS(options.handle);
    },
};
const WebAccess = _WebAccess;


/***/ }),

/***/ "./src/node_modules/@zenfs/dom/dist/index.js":
/*!***************************************************!*\
  !*** ./src/node_modules/@zenfs/dom/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IndexedDB: () => (/* reexport safe */ _IndexedDB_js__WEBPACK_IMPORTED_MODULE_1__.IndexedDB),
/* harmony export */   IndexedDBStore: () => (/* reexport safe */ _IndexedDB_js__WEBPACK_IMPORTED_MODULE_1__.IndexedDBStore),
/* harmony export */   IndexedDBTransaction: () => (/* reexport safe */ _IndexedDB_js__WEBPACK_IMPORTED_MODULE_1__.IndexedDBTransaction),
/* harmony export */   WebAccess: () => (/* reexport safe */ _access_js__WEBPACK_IMPORTED_MODULE_0__.WebAccess),
/* harmony export */   WebAccessFS: () => (/* reexport safe */ _access_js__WEBPACK_IMPORTED_MODULE_0__.WebAccessFS),
/* harmony export */   WebStorage: () => (/* reexport safe */ _Storage_js__WEBPACK_IMPORTED_MODULE_2__.WebStorage),
/* harmony export */   WebStorageStore: () => (/* reexport safe */ _Storage_js__WEBPACK_IMPORTED_MODULE_2__.WebStorageStore)
/* harmony export */ });
/* harmony import */ var _access_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./access.js */ "./src/node_modules/@zenfs/dom/dist/access.js");
/* harmony import */ var _IndexedDB_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IndexedDB.js */ "./src/node_modules/@zenfs/dom/dist/IndexedDB.js");
/* harmony import */ var _Storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Storage.js */ "./src/node_modules/@zenfs/dom/dist/Storage.js");





/***/ }),

/***/ "./src/node_modules/@zenfs/dom/dist/utils.js":
/*!***************************************************!*\
  !*** ./src/node_modules/@zenfs/dom/dist/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertException: () => (/* binding */ convertException)
/* harmony export */ });
/* harmony import */ var _zenfs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zenfs/core */ "./src/node_modules/@zenfs/core/dist/index.js");

/**
 * Converts a DOMException into an Errno
 * @see https://developer.mozilla.org/Web/API/DOMException
 */
function errnoForDOMException(ex) {
    switch (ex.name) {
        case 'IndexSizeError':
        case 'HierarchyRequestError':
        case 'InvalidCharacterError':
        case 'InvalidStateError':
        case 'SyntaxError':
        case 'NamespaceError':
        case 'TypeMismatchError':
        case 'ConstraintError':
        case 'VersionError':
        case 'URLMismatchError':
        case 'InvalidNodeTypeError':
            return 'EINVAL';
        case 'WrongDocumentError':
            return 'EXDEV';
        case 'NoModificationAllowedError':
        case 'InvalidModificationError':
        case 'InvalidAccessError':
        case 'SecurityError':
        case 'NotAllowedError':
            return 'EACCES';
        case 'NotFoundError':
            return 'ENOENT';
        case 'NotSupportedError':
            return 'ENOTSUP';
        case 'InUseAttributeError':
            return 'EBUSY';
        case 'NetworkError':
            return 'ENETDOWN';
        case 'AbortError':
            return 'EINTR';
        case 'QuotaExceededError':
            return 'ENOSPC';
        case 'TimeoutError':
            return 'ETIMEDOUT';
        case 'ReadOnlyError':
            return 'EROFS';
        case 'DataCloneError':
        case 'EncodingError':
        case 'NotReadableError':
        case 'DataError':
        case 'TransactionInactiveError':
        case 'OperationError':
        case 'UnknownError':
        default:
            return 'EIO';
    }
}
/**
 * Handles converting errors, then rethrowing them
 * @internal
 */
function convertException(ex, path, syscall) {
    if (ex instanceof _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError) {
        return ex;
    }
    const code = ex instanceof DOMException ? _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno[errnoForDOMException(ex)] : _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.Errno.EIO;
    const error = new _zenfs_core__WEBPACK_IMPORTED_MODULE_0__.ErrnoError(code, ex.message, path, syscall);
    error.stack = ex.stack;
    error.cause = ex.cause;
    return error;
}


/***/ }),

/***/ "./src/node_modules/eventemitter3/index.mjs":
/*!**************************************************!*\
  !*** ./src/node_modules/eventemitter3/index.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./src/node_modules/eventemitter3/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./src/node_modules/utilium/dist/index.js":
/*!************************************************!*\
  !*** ./src/node_modules/utilium/dist/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   List: () => (/* reexport safe */ _list_js__WEBPACK_IMPORTED_MODULE_0__.List),
/* harmony export */   Struct: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.Struct),
/* harmony export */   align: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.align),
/* harmony export */   assignWithDefaults: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.assignWithDefaults),
/* harmony export */   capitalize: () => (/* reexport safe */ _string_js__WEBPACK_IMPORTED_MODULE_5__.capitalize),
/* harmony export */   deserialize: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.deserialize),
/* harmony export */   filterObject: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.filterObject),
/* harmony export */   formatCompact: () => (/* reexport safe */ _numbers_js__WEBPACK_IMPORTED_MODULE_2__.formatCompact),
/* harmony export */   getByString: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.getByString),
/* harmony export */   getRandomIntWithRecursiveProbability: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.getRandomIntWithRecursiveProbability),
/* harmony export */   greekLetterNames: () => (/* reexport safe */ _misc_js__WEBPACK_IMPORTED_MODULE_1__.greekLetterNames),
/* harmony export */   isHex: () => (/* reexport safe */ _misc_js__WEBPACK_IMPORTED_MODULE_1__.isHex),
/* harmony export */   isJSON: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.isJSON),
/* harmony export */   map: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.map),
/* harmony export */   member: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.member),
/* harmony export */   omit: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.omit),
/* harmony export */   pick: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.pick),
/* harmony export */   randomBinaryString: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.randomBinaryString),
/* harmony export */   randomBoolean: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.randomBoolean),
/* harmony export */   randomFloat: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.randomFloat),
/* harmony export */   randomHex: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.randomHex),
/* harmony export */   randomInt: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_4__.randomInt),
/* harmony export */   range: () => (/* reexport safe */ _numbers_js__WEBPACK_IMPORTED_MODULE_2__.range),
/* harmony export */   resolveConstructors: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.resolveConstructors),
/* harmony export */   serialize: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.serialize),
/* harmony export */   setByString: () => (/* reexport safe */ _objects_js__WEBPACK_IMPORTED_MODULE_3__.setByString),
/* harmony export */   sizeof: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.sizeof),
/* harmony export */   struct: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.struct),
/* harmony export */   toDegrees: () => (/* reexport safe */ _numbers_js__WEBPACK_IMPORTED_MODULE_2__.toDegrees),
/* harmony export */   toRadians: () => (/* reexport safe */ _numbers_js__WEBPACK_IMPORTED_MODULE_2__.toRadians),
/* harmony export */   types: () => (/* reexport safe */ _struct_js__WEBPACK_IMPORTED_MODULE_6__.types),
/* harmony export */   uncapitalize: () => (/* reexport safe */ _string_js__WEBPACK_IMPORTED_MODULE_5__.uncapitalize),
/* harmony export */   version: () => (/* reexport module object */ _version_js__WEBPACK_IMPORTED_MODULE_8__),
/* harmony export */   wait: () => (/* reexport safe */ _misc_js__WEBPACK_IMPORTED_MODULE_1__.wait)
/* harmony export */ });
/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.js */ "./src/node_modules/utilium/dist/list.js");
/* harmony import */ var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc.js */ "./src/node_modules/utilium/dist/misc.js");
/* harmony import */ var _numbers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./numbers.js */ "./src/node_modules/utilium/dist/numbers.js");
/* harmony import */ var _objects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects.js */ "./src/node_modules/utilium/dist/objects.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random.js */ "./src/node_modules/utilium/dist/random.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./string.js */ "./src/node_modules/utilium/dist/string.js");
/* harmony import */ var _struct_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./struct.js */ "./src/node_modules/utilium/dist/struct.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./types.js */ "./src/node_modules/utilium/dist/types.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./version.js */ "./src/node_modules/utilium/dist/version.js");











/***/ }),

/***/ "./src/node_modules/utilium/dist/internal/primitives.js":
/*!**************************************************************!*\
  !*** ./src/node_modules/utilium/dist/internal/primitives.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkValid: () => (/* binding */ checkValid),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValid: () => (/* binding */ isValid),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   regex: () => (/* binding */ regex),
/* harmony export */   types: () => (/* binding */ types),
/* harmony export */   valids: () => (/* binding */ valids)
/* harmony export */ });
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../string.js */ "./src/node_modules/utilium/dist/string.js");

const types = ['int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64', 'float32', 'float64'];
const valids = [...types, ...types.map(t => (0,_string_js__WEBPACK_IMPORTED_MODULE_0__.capitalize)(t)), 'char'];
const regex = /^(u?int|float)(8|16|32|64)$/i;
function normalize(type) {
    return (type == 'char' ? 'uint8' : type.toLowerCase());
}
function isType(type) {
    return regex.test(type.toString());
}
function isValid(type) {
    return type == 'char' || regex.test(type.toString().toLowerCase());
}
function checkValid(type) {
    if (!isValid(type)) {
        throw new TypeError('Not a valid primitive type: ' + type);
    }
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/internal/struct.js":
/*!**********************************************************!*\
  !*** ./src/node_modules/utilium/dist/internal/struct.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _polyfill_contextMetadata: () => (/* binding */ _polyfill_contextMetadata),
/* harmony export */   checkInstance: () => (/* binding */ checkInstance),
/* harmony export */   checkStruct: () => (/* binding */ checkStruct),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   isInstance: () => (/* binding */ isInstance),
/* harmony export */   isStatic: () => (/* binding */ isStatic),
/* harmony export */   isStruct: () => (/* binding */ isStruct),
/* harmony export */   isValidMetadata: () => (/* binding */ isValidMetadata),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   symbol_metadata: () => (/* binding */ symbol_metadata)
/* harmony export */ });
// @ts-expect-error 2322
Symbol.struct_init ||= Symbol('struct_init');
// @ts-expect-error 2322
Symbol.struct_metadata ||= Symbol('struct_metadata');
/** @deprecated */
const init = Symbol.struct_init;
/** @deprecated */
const metadata = Symbol.struct_metadata;
function isValidMetadata(arg) {
    return arg != null && typeof arg == 'object' && Symbol.struct_metadata in arg;
}
/**
 * Polyfill Symbol.metadata
 * @see https://github.com/microsoft/TypeScript/issues/53461
 */
Symbol.metadata ??= Symbol.for('Symbol.metadata');
/**
 * Polyfill context.metadata
 * @see https://github.com/microsoft/TypeScript/issues/53461
 */
function _polyfill_contextMetadata(target) {
    if (!Symbol?.metadata) {
        return;
    }
    if (Symbol.metadata in target) {
        return;
    }
    Object.defineProperty(target, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: Object.create(null),
    });
}
/**
 * Gets a reference to Symbol.metadata, even on platforms that do not expose it globally (like Node)
 */
function symbol_metadata(arg) {
    const symbol_metadata = Symbol.metadata || Object.getOwnPropertySymbols(arg).find(s => s.description == 'Symbol.metadata');
    _polyfill_contextMetadata(arg);
    if (!symbol_metadata) {
        throw new ReferenceError('Could not get a reference to Symbol.metadata');
    }
    return symbol_metadata;
}
function isStatic(arg) {
    return typeof arg == 'function' && symbol_metadata(arg) in arg && isValidMetadata(arg[symbol_metadata(arg)]);
}
function isInstance(arg) {
    return arg != null && typeof arg == 'object' && isStatic(arg.constructor);
}
function checkInstance(arg) {
    if (!isInstance(arg)) {
        throw new TypeError((typeof arg == 'function' ? arg.name : typeof arg == 'object' && arg ? arg.constructor.name : arg) + ' is not a struct instance');
    }
}
function isStruct(arg) {
    return isInstance(arg) || isStatic(arg);
}
function checkStruct(arg) {
    if (!isStruct(arg)) {
        throw new TypeError((typeof arg == 'function' ? arg.name : typeof arg == 'object' && arg ? arg.constructor.name : arg) + ' is not a struct');
    }
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/list.js":
/*!***********************************************!*\
  !*** ./src/node_modules/utilium/dist/list.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   List: () => (/* binding */ List)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./src/node_modules/eventemitter3/index.mjs");

class List extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    [Symbol.toStringTag] = 'List';
    constructor(values) {
        super();
        if (values) {
            this.push(...values);
        }
    }
    data = new Set();
    toSet() {
        return new Set(this.data);
    }
    toArray() {
        return Array.from(this.data);
    }
    toJSON() {
        return JSON.stringify(Array.from(this.data));
    }
    toString() {
        return this.join(',');
    }
    set(index, value) {
        if (Math.abs(index) > this.data.size) {
            throw new ReferenceError('Can not set an element outside the bounds of the list');
        }
        const data = Array.from(this.data);
        data.splice(index, 1, value);
        this.data = new Set(data);
        this.emit('update');
    }
    deleteAt(index) {
        if (Math.abs(index) > this.data.size) {
            throw new ReferenceError('Can not delete an element outside the bounds of the list');
        }
        this.delete(Array.from(this.data).at(index));
    }
    // Array methods
    at(index) {
        if (Math.abs(index) > this.data.size) {
            throw new ReferenceError('Can not access an element outside the bounds of the list');
        }
        return Array.from(this.data).at(index);
    }
    pop() {
        const item = Array.from(this.data).pop();
        if (item !== undefined) {
            this.delete(item);
        }
        return item;
    }
    push(...items) {
        for (const item of items) {
            this.add(item);
        }
        return this.data.size;
    }
    join(separator) {
        return Array.from(this.data).join(separator);
    }
    splice(start, deleteCount, ...items) {
        if (Math.abs(start) > this.data.size) {
            throw new ReferenceError('Can not splice elements outside the bounds of the list');
        }
        const data = Array.from(this.data);
        const deleted = data.splice(start, deleteCount, ...items);
        this.data = new Set(data);
        this.emit('update');
        return deleted;
    }
    // Set methods
    add(value) {
        this.data.add(value);
        this.emit('update');
        return this;
    }
    clear() {
        this.data.clear();
        this.emit('update');
    }
    delete(value) {
        const success = this.data.delete(value);
        this.emit('update');
        return success;
    }
    has(value) {
        return this.data.has(value);
    }
    get size() {
        return this.data.size;
    }
    entries() {
        return this.data.entries();
    }
    keys() {
        return this.data.keys();
    }
    values() {
        return this.data.values();
    }
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
    }
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/misc.js":
/*!***********************************************!*\
  !*** ./src/node_modules/utilium/dist/misc.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   greekLetterNames: () => (/* binding */ greekLetterNames),
/* harmony export */   isHex: () => (/* binding */ isHex),
/* harmony export */   wait: () => (/* binding */ wait)
/* harmony export */ });
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
const greekLetterNames = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Pi',
    'Rho',
    'Sigma',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega',
];
const hexRegex = /^[0-9a-f-.]+$/;
function isHex(str) {
    return hexRegex.test(str);
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/numbers.js":
/*!**************************************************!*\
  !*** ./src/node_modules/utilium/dist/numbers.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatCompact: () => (/* binding */ formatCompact),
/* harmony export */   range: () => (/* binding */ range),
/* harmony export */   toDegrees: () => (/* binding */ toDegrees),
/* harmony export */   toRadians: () => (/* binding */ toRadians)
/* harmony export */ });
function range(min, max) {
    const a = [];
    for (let i = min; i < max; i++) {
        a.push(i);
    }
    return a;
}
function toDegrees(radians) {
    return (radians * 180) / Math.PI;
}
function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}
const __formatter = Intl.NumberFormat('en', { notation: 'compact' });
const formatCompact = __formatter.format.bind(__formatter);


/***/ }),

/***/ "./src/node_modules/utilium/dist/objects.js":
/*!**************************************************!*\
  !*** ./src/node_modules/utilium/dist/objects.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignWithDefaults: () => (/* binding */ assignWithDefaults),
/* harmony export */   filterObject: () => (/* binding */ filterObject),
/* harmony export */   getByString: () => (/* binding */ getByString),
/* harmony export */   isJSON: () => (/* binding */ isJSON),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   omit: () => (/* binding */ omit),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   resolveConstructors: () => (/* binding */ resolveConstructors),
/* harmony export */   setByString: () => (/* binding */ setByString)
/* harmony export */ });
function filterObject(object, predicate) {
    const entries = Object.entries(object);
    return Object.fromEntries(entries.filter(([key, value]) => predicate(key, value)));
}
function pick(object, ...keys) {
    const picked = {};
    for (const key of keys.flat()) {
        picked[key] = object[key];
    }
    return picked;
}
function omit(object, ...keys) {
    return filterObject(object, key => !keys.flat().includes(key));
}
function assignWithDefaults(to, from, defaults = to) {
    const keys = new Set([...Object.keys(to), ...Object.keys(from)]);
    for (const key of keys) {
        try {
            to[key] = from[key] ?? defaults[key] ?? to[key];
        }
        catch (e) {
            // Do nothing
        }
    }
}
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
function resolveConstructors(object) {
    const constructors = [];
    let prototype = object;
    while (prototype && !['Function', 'Object'].includes(prototype.constructor.name)) {
        prototype = Object.getPrototypeOf(prototype);
        constructors.push(prototype.constructor.name);
    }
    return constructors;
}
function map(items) {
    return new Map(Object.entries(items));
}
function getByString(object, path, separator = /[.[\]'"]/) {
    return path
        .split(separator)
        .filter(p => p)
        .reduce((o, p) => o?.[p], object);
}
function setByString(object, path, value, separator = /[.[\]'"]/) {
    return path
        .split(separator)
        .filter(p => p)
        .reduce((o, p, i) => (o[p] = path.split(separator).filter(p => p).length === ++i ? value : o[p] || {}), object);
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/random.js":
/*!*************************************************!*\
  !*** ./src/node_modules/utilium/dist/random.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRandomIntWithRecursiveProbability: () => (/* binding */ getRandomIntWithRecursiveProbability),
/* harmony export */   randomBinaryString: () => (/* binding */ randomBinaryString),
/* harmony export */   randomBoolean: () => (/* binding */ randomBoolean),
/* harmony export */   randomFloat: () => (/* binding */ randomFloat),
/* harmony export */   randomHex: () => (/* binding */ randomHex),
/* harmony export */   randomInt: () => (/* binding */ randomInt)
/* harmony export */ });
function randomFloat(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function randomHex(length = 1) {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += Math.floor(Math.random() * 16).toString(16);
    }
    return s;
}
function randomBoolean() {
    return !!Math.round(Math.random());
}
function randomBinaryString(length = 1) {
    let b = '';
    for (let i = 0; i < length; i++) {
        b += Math.round(Math.random());
    }
    return b;
}
function randomInt(min = 0, max = 1) {
    return Math.round(Math.random() * (max - min) + min);
}
/**
 * Gets a random int, r, with the probability P(r) = (base)**r
 * For example, with a probability of 1/2: P(1) = 1/2, P(2) = 1/4, etc.
 * @param probability the probability
 */
function getRandomIntWithRecursiveProbability(probability = 0.5) {
    return -Math.floor(Math.log(Math.random()) / Math.log(1 / probability));
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/string.js":
/*!*************************************************!*\
  !*** ./src/node_modules/utilium/dist/string.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   capitalize: () => (/* binding */ capitalize),
/* harmony export */   uncapitalize: () => (/* binding */ uncapitalize)
/* harmony export */ });
function capitalize(value) {
    return (value.at(0).toUpperCase() + value.slice(1));
}
function uncapitalize(value) {
    return (value.at(0).toLowerCase() + value.slice(1));
}


/***/ }),

/***/ "./src/node_modules/utilium/dist/struct.js":
/*!*************************************************!*\
  !*** ./src/node_modules/utilium/dist/struct.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Struct: () => (/* reexport module object */ _internal_struct_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   align: () => (/* binding */ align),
/* harmony export */   deserialize: () => (/* binding */ deserialize),
/* harmony export */   member: () => (/* binding */ member),
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   struct: () => (/* binding */ struct),
/* harmony export */   types: () => (/* binding */ types)
/* harmony export */ });
/* harmony import */ var _internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal/primitives.js */ "./src/node_modules/utilium/dist/internal/primitives.js");
/* harmony import */ var _internal_struct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./internal/struct.js */ "./src/node_modules/utilium/dist/internal/struct.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./string.js */ "./src/node_modules/utilium/dist/string.js");




/**
 * Gets the size in bytes of a type
 */
function sizeof(type) {
    // primitive
    if (typeof type == 'string') {
        _internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.checkValid(type);
        return (+_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.normalize(type).match(_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.regex)[2] / 8);
    }
    (0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.checkStruct)(type);
    const struct = (0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.isStatic)(type) ? type : type.constructor;
    return struct[(0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.symbol_metadata)(struct)][Symbol.struct_metadata].size;
}
/**
 * Aligns a number
 */
function align(value, alignment) {
    return Math.ceil(value / alignment) * alignment;
}
/**
 * Decorates a class as a struct
 */
function struct(options = {}) {
    return function _decorateStruct(target, context) {
        context.metadata ??= {};
        context.metadata[Symbol.struct_init] ||= [];
        let size = 0;
        const members = new Map();
        for (const _ of context.metadata[Symbol.struct_init]) {
            const { name, type, length } = _;
            if (!_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.isValid(type) && !(0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.isStatic)(type)) {
                throw new TypeError('Not a valid type: ' + type);
            }
            members.set(name, {
                offset: size,
                type: _internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.isValid(type) ? _internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.normalize(type) : type,
                length,
            });
            size += sizeof(type) * (length || 1);
            size = align(size, options.align || 1);
        }
        context.metadata[Symbol.struct_metadata] = { options, members, size };
        return target;
    };
}
/**
 * Decorates a class member to be serialized
 */
function member(type, length) {
    return function (value, context) {
        let name = context.name;
        if (typeof name == 'symbol') {
            console.warn('Symbol used for struct member name will be coerced to string: ' + name.toString());
            name = name.toString();
        }
        if (!name) {
            throw new ReferenceError('Invalid name for struct member');
        }
        context.metadata ??= {};
        context.metadata[Symbol.struct_init] ||= [];
        context.metadata[Symbol.struct_init].push({ name, type, length });
        return value;
    };
}
/**
 * Serializes a struct into a Uint8Array
 */
function serialize(instance) {
    (0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.checkInstance)(instance);
    const { options, members } = instance.constructor[(0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.symbol_metadata)(instance.constructor)][Symbol.struct_metadata];
    const buffer = new Uint8Array(sizeof(instance));
    const view = new DataView(buffer.buffer);
    for (const [name, { type, length, offset }] of members) {
        for (let i = 0; i < (length || 1); i++) {
            const iOff = offset + sizeof(type) * i;
            // @ts-expect-error 7053
            let value = length > 0 ? instance[name][i] : instance[name];
            if (typeof value == 'string') {
                value = value.charCodeAt(0);
            }
            if (!_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.isType(type)) {
                buffer.set(value ? serialize(value) : new Uint8Array(sizeof(type)), iOff);
                continue;
            }
            const Type = (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.capitalize)(type);
            const fn = ('set' + Type);
            if (fn == 'setInt64') {
                view.setBigInt64(iOff, BigInt(value), !options.bigEndian);
                continue;
            }
            if (fn == 'setUint64') {
                view.setBigUint64(iOff, BigInt(value), !options.bigEndian);
                continue;
            }
            view[fn](iOff, Number(value), !options.bigEndian);
        }
    }
    return buffer;
}
/**
 * Deserializes a struct from a Uint8Array
 */
function deserialize(instance, _buffer) {
    (0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.checkInstance)(instance);
    const { options, members } = instance.constructor[(0,_internal_struct_js__WEBPACK_IMPORTED_MODULE_1__.symbol_metadata)(instance.constructor)][Symbol.struct_metadata];
    const buffer = _buffer instanceof Uint8Array ? _buffer : new Uint8Array('buffer' in _buffer ? _buffer.buffer : _buffer);
    const view = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    for (const [name, { type, offset, length }] of members) {
        for (let i = 0; i < (length || 1); i++) {
            // @ts-expect-error 7053
            let object = length > 0 ? instance[name] : instance;
            const key = length > 0 ? i : name, iOff = offset + sizeof(type) * i;
            // @ts-expect-error 7053
            if (typeof instance[name] == 'string') {
                // @ts-expect-error 7053
                instance[name] = instance[name].slice(0, i) + String.fromCharCode(view.getUint8(iOff)) + instance[name].slice(i + 1);
                continue;
            }
            if (!_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.isType(type)) {
                if (object[key] === null || object[key] === undefined) {
                    continue;
                }
                deserialize(object[key], new Uint8Array(buffer.slice(iOff, iOff + sizeof(type))));
                continue;
            }
            if (length > 0) {
                object ||= [];
            }
            const Type = (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.capitalize)(type);
            const fn = ('get' + Type);
            if (fn == 'getInt64') {
                object[key] = view.getBigInt64(iOff, !options.bigEndian);
                continue;
            }
            if (fn == 'getUint64') {
                object[key] = view.getBigUint64(iOff, !options.bigEndian);
                continue;
            }
            object[key] = view[fn](iOff, !options.bigEndian);
        }
    }
}
function _member(type) {
    function _structMemberDecorator(valueOrLength, context) {
        if (typeof valueOrLength == 'number') {
            return member(type, valueOrLength);
        }
        return member(type)(valueOrLength, context);
    }
    return _structMemberDecorator;
}
/**
 * Shortcut types
 *
 * Instead of writing `@member(type)` you can write `@types.type`, or `@types.type(length)` for arrays
 */
const types = Object.fromEntries(_internal_primitives_js__WEBPACK_IMPORTED_MODULE_0__.valids.map(t => [t, _member(t)]));


/***/ }),

/***/ "./src/node_modules/utilium/dist/types.js":
/*!************************************************!*\
  !*** ./src/node_modules/utilium/dist/types.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/node_modules/utilium/dist/version.js":
/*!**************************************************!*\
  !*** ./src/node_modules/utilium/dist/version.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   regex: () => (/* binding */ regex)
/* harmony export */ });
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./string.js */ "./src/node_modules/utilium/dist/string.js");

const regex = /^(?<core>\d+\.\d+\.\d+)(?:[-_](?<type>[^-_.]+)[-_.](?<pre>\d*(?:\.\d+)*))?/;
function parse(full, stripCore) {
    const { type, pre, core } = regex.exec(full).groups;
    const display = type ? `${stripCore && core == '1.0.0' ? '' : core + ' '}${(0,_string_js__WEBPACK_IMPORTED_MODULE_0__.capitalize)(type)}${pre ? ` ${pre}` : ''}` : core;
    return { full, core, pre, type, display };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/fs.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map