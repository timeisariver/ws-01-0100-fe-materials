/* 2. 下記にそれぞれList、Stack、Queue クラスを実装して下さい
 *
 *     また
 *
 *       List => IList,
 *       Stack => IStack,
 *       Queue => IQueue
 *
 *     というインターフェースを実装して下さい。
 *
 */

interface IList<T> {
  data: T[];
  size: number;
  add: (value: T) => void;
  pop: () => T | undefined;
  remove: (index: number) => T | undefined;
}

interface IStack<T> {
  data: T[];
  size: number;
  push: (value: T) => void;
  pop: () => T | undefined;
  peak: () => T | undefined;
}

interface IQueue<T> {
  data: T[];
  size: number;
  enqueue: (value: T) => void;
  dequeue: () => T | undefined;
  peak: () => T | undefined;
}

// ↓↓↓ 以下に実装してください ↓↓↓
export class List<T> implements IList<T> {
  data;

  constructor(data: T[]) {
    this.data = data;
  }

  get size() {
    return this.data.length;
  }

  add(value: T) {
    this.data.push(value);
  }

  pop() {
    return this.data.pop();
  }

  remove(index: number) {
    if (index < 0) {
      return undefined;
    }

    return this.data.splice(index, 1)[0];
  }
}

export class Stack<T> implements IStack<T> {
  data;

  constructor(data: T[]) {
    this.data = data;
  }

  get size() {
    return this.data.length;
  }

  push(value: T) {
    this.data.push(value);
  }

  pop() {
    return this.data.pop();
  }

  peak() {
    return this.data.at(-1);
  }
}

export class Queue<T> implements IQueue<T> {
  data;

  constructor(data: T[]) {
    this.data = data;
  }

  get size() {
    return this.data.length;
  }

  enqueue(value: T) {
    this.data.push(value);
  }

  dequeue() {
    return this.data.shift();
  }

  peak() {
    return this.data.at(0);
  }
}
