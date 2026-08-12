/**
 *  7.1 JSのfilter メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして filter メソッドは、使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 */

function filter(array, cb) {
  const result = [];
  for (let index = 0; index < array.length; index++) {
    if (cb(array[index], index)) result.push(array[index]);
  }
  return result;
}

/**
 *  7.2 JSの find メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして find メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 */

function find(array, cb) {
  for (let index = 0; index < array.length; index++) {
    if (cb(array[index], index)) return array[index];
  }
}

/**
 *  7.3 JSの findIndex メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして findIndex メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 */

function findIndex(array, cb) {
  for (let index = 0; index < array.length; index++) {
    if (cb(array[index], index)) return index;
  }
  return -1;
}

/**
 *  7.4 JSの some メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして some メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 */

function some(array, cb) {
  for (let index = 0; index < array.length; index++) {
    if (cb(array[index], index)) return true;
  }
  return false;
}

/**
 *  7.5 JSの every メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして every メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 */

function every(array, cb) {
  for (let index = 0; index < array.length; index++) {
    if (!cb(array[index], index)) return false;
  }
  return true;
}

/**
 *  7.6 JSの map メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして every メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 *
 */

function map(array, cb) {
  const result = [];
  for (let index = 0; index < array.length; index++) {
    result.push(cb(array[index], index));
  }
  return result;
}

/**
 *  7.7 JSの forEach メソッドを自分で実装してみましょう。
 *      第一引数に配列、第二引数にコールバックが渡されるとして forEach メソッドは使わずに実装してください、
 *      また、コールバック関数の第一引数には、各要素とそのインデックスが渡されるように実装してください。
 *
 */

function forEach(array, cb) {
  for (let index = 0; index < array.length; index++) {
    cb(array[index], index);
  }
  return;
}

module.exports = {
  filter,
  find,
  findIndex,
  some,
  every,
  map,
  forEach,
};
