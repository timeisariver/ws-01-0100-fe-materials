/**
 *  文字列のローテート
 *
 *  文字列を入力された数だけローテートさせる関数を実装してください
 *
 *  example:
 *    'library',  1 => 'ylibrar'
 *    'library',  3 => 'arylibr'
 *    'library', -1 => 'ibraryl'
 *
 */
function rotate(str, num) {
  let rotatedWord = '';

  // 後ろから何文字切り取るか
  // マイナスの値がnumに入ってきた際、マイナスがマイナスを打ち消してプラスになる
  rotatedWord += str.slice(-num);

  // 後ろの num 文字を除いた残り（＝前半全部）
  rotatedWord += str.slice(0, -num);

  return rotatedWord;
}

/**
 *  母音を除いた文字列
 *
 *  与えられた文字列から母音を除いた関数を実装してください
 *
 *  example:
 *    'library' => 'lbrry'
 *    'apple' => 'ppl'
 *    'banana' => 'bnn'
 *
 */
function removeVowels(str) {
  let characters = str.split('');

  characters = characters.filter((char) => {
    return (
      // char !== 'a' &&
      // char !== 'i' &&
      // char !== 'u' &&
      // char !== 'e' &&
      // char !== 'o'

      // ↑自分で書いた奴
      // ↓より良い書き方
      !'aiueo'.includes(char)
    );
  });

  const vowelsRemoved = characters.join('');

  return vowelsRemoved;
}

/**
 *  文字列のカウント
 *
 *  ある文字列の中に特定の文字列がいくつ含まれるかカウントする関数を実装してください。
 *
 *  example:
 *    'abcdabeabc',  'abc' => 2
 *    'abc',  'abc' => 1
 *    'hogehoage',  'hoge' => 1
 *
 */
function countStr(s1, s2) {
  // split は断片の配列を返す。断片の数は区切りの数より必ず1多いので、1を引く
  return s1.split(s2).length - 1;
}

/**
 *  引数に与えられたアルファベットの文字列が回文であること
 *  を確認するメソッドを実装してください
 *
 *  example:
 *      work => false
 *      anna => true
 *      madam => true
 *      level => true
 *
 */

function isPalindrome(str) {
  const characters = str.split('');
  characters.reverse();
  const reversedWord = characters.join('');

  return str === reversedWord;
}

/**
 *  素数
 *
 *  入力された数字が素数であるか確認する関数を実装してください
 *
 *  example:
 *    1 => False
 *    2 => True
 *    3 => True
 *    6 => False
 *    9 => False
 *    11 => True
 *
 */
function isPrime(num) {
  // 素数とは1より大きい整数のうち、1と自分自身でしか割り切れない数

  if (num < 2) return false;

  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }

  return true;
}

/**
 *  配列の4と次の数字を抜いた合計
 *
 *  与えらた配列の合計を返す関数を実装してください。
 *  ただし、配列の中に4がある場合は、4とその次の数字を合計に含めないでください。
 *
 *  example:
 *    [1, 2, 3, 4] => 6
 *    [1, 2, 3, 4, 5] => 6
 *    [1, 4, 3, 4, 5] => 1
 *    [4, 3, 3, 5] => 8
 *    [4, 3, 3, 4] => 3
 *    [4] => 0
 *
 */
function sumWithout4andNext(array) {
  let skipsNext = false;
  let total = 0;

  for (let i = 0; i < array.length; i++) {
    if (array[i] === 4) {
      skipsNext = true;
      continue;
    }

    if (skipsNext) {
      skipsNext = false;
      continue;
    }

    total += array[i];
  }

  return total;
}

module.exports = {
  rotate,
  removeVowels,
  countStr,
  isPalindrome,
  isPrime,
  sumWithout4andNext,
};
