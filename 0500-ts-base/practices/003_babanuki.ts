/* 下記に指定した仕様のばば抜きアプリを作成して下さい。
 *
 *  参加プレイヤーは4名: Alice, Bob, Charlie, David
 *
 *  1. ジョーカーを含む52+1枚のトランプを用意し、プレイヤーに2枚ずつ配る
 *  2. プレイヤーは手札から同じ数字のカードを捨てることができる
 *  3. 手札のが配られた場合、全部のプレイヤーが手札から全てのペアのカードを捨てる。
 *  4. プレイヤーはAlice => Bob => Charlie => David の順番でカードを引く
 *  5. プレイヤーはカードを引いた後に、手札にペアがあるか確認し、あれば捨てる
 *
 *  [勝利条件]
 *  1. 手札がなくなったプレイヤーが勝利。最後の1人が残るまで続ける。
 *
 *  [敗北条件]
 *  1. 自分以外のプレイヤーが全て抜けた場合。
 *  2. ジョーカーのみの手札を持っている場合。その人を負けとして即時にゲームを終了する。
 *
 *  [実行例]
 *  - ./docs/003_babanuki_example.md を参照してください。
 *
 *  [出力内容]
 *  - 実行例を参考に、ゲームの進行状況を Logger クラスを使って出力してください。
 *  - 出力はテストコードでも検証するので例にならって出力を行ってください。
 *
 *  [そのほか]
 *  - ロジックの実装の際は、IPlayer と IGameMaster のインターフェースを実装して仕様を満たす Player, GameMaster クラスを実装して下さい。
 *  - Card クラスなどすでに実装済みの部分もあるので、lib/babanuki.ts のコードも活用しながら実装してください。
 *  - GameMaster クラスの run メソッドが実行されるとゲームが実行できるようにしてください。
 */

import {
  Card,
  getRandomIndex,
  IPlayer,
  IGameMaster,
  ILogger,
  Logger,
} from '../lib/babanuki';

export class Player implements IPlayer {
  name: string;
  hands: Card[];

  constructor(name: string) {
    this.name = name;
    this.hands = [];
  }

  get done() {
    return this.hands.length === 0;
  }

  get onlyJoker() {
    return this.hands.length === 1 && this.hands[0].isJoker;
  }

  assign(card: Card) {
    this.hands.push(card);
  }

  draw(opponent: IPlayer) {
    const drawIndex = getRandomIndex(opponent.hands.length);
    const drawnCard = opponent.hands.splice(drawIndex, 1)[0];
    this.assign(drawnCard);
    return drawnCard;
  }

  discard() {
    const discardedCards: Card[] = [];
    const keepCards: Card[] = [];

    while (this.hands.length !== 0) {
      const shiftedCard = this.hands.shift();
      if (!shiftedCard) break;

      const pairIndex = this.hands.findIndex(
        (card) => card.value === shiftedCard.value,
      );

      if (pairIndex !== -1) {
        this.hands.splice(pairIndex, 1);
        discardedCards.push(shiftedCard);
      } else {
        keepCards.push(shiftedCard);
      }
    }

    this.hands = keepCards;
    return discardedCards;
  }
}
export class GameMaster implements IGameMaster {
  logger: ILogger;
  players: IPlayer[];
  cards: Card[];
  rank: IPlayer[];
  turn: number;

  constructor(logger: ILogger, players: IPlayer[]) {
    this.logger = logger;
    this.players = players;
    this.cards = Card.prepare();
    this.rank = [];
    this.turn = 0;
  }

  run() {
    this.deal();
    this.firstDiscard();
    this.play();
  }

  deal() {
    let playerIndex = 0;

    while (this.cards.length !== 0) {
      const player = this.players[playerIndex];

      for (let i = 0; i < 2; i++) {
        if (this.cards.length === 0) break;

        const index = getRandomIndex(this.cards.length);
        const card = this.cards.splice(index, 1)[0];
        player.assign(card);
      }

      playerIndex = (playerIndex + 1) % this.players.length;
    }
  }

  firstDiscard() {
    this.logger.firstDiscard();

    for (const player of this.players) {
      this.turn++;
      this.logger.currentState(this.turn, player);

      const discarded = player.discard();
      this.logger.discard(player, discarded);
    }
  }

  playTurn(player: IPlayer, opponent: IPlayer) {
    this.turn++;
    this.logger.currentState(this.turn, player);

    const drawnCard = player.draw(opponent);
    this.logger.draw(player, opponent, drawnCard);

    const discarded = player.discard();
    if (discarded.length !== 0) {
      this.logger.discard(player, discarded);
    }

    if (player.done) {
      this.logger.done(player);
      this.rank.push(player);
    }

    if (opponent.done) {
      this.logger.done(opponent);
      this.rank.push(opponent);
    }

    if (player.onlyJoker) {
      return player;
    }

    if (opponent.onlyJoker) {
      return opponent;
    }

    if (this.rank.length === this.players.length - 1) {
      return this.players.find((p) => !p.done);
    }
  }

  play() {
    this.logger.start();

    let playerIndex = 0;

    while (true) {
      const player = this.players[playerIndex];

      if (!player.done) {
        let opponentIndex = (playerIndex + 1) % this.players.length;

        while (this.players[opponentIndex].done) {
          opponentIndex = (opponentIndex + 1) % this.players.length;
        }

        const opponent = this.players[opponentIndex];
        const loser = this.playTurn(player, opponent);

        if (loser) {
          this.logger.end(loser, this.rank);
          return;
        }
      }

      playerIndex = (playerIndex + 1) % this.players.length;
    }
  }
}

// [編集不要] ターミナルでの実行用の関数。
export function run() {
  const gameMaster = new GameMaster(new Logger(), [
    new Player('Alice'),
    new Player('Bob'),
    new Player('Charlie'),
    new Player('David'),
  ]);
  gameMaster.run();
}
