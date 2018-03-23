import { Reference } from "@firebase/database/dist/esm/src/api/Reference";
import { retrievePseudoRandomNumber, getPasswordCount } from "./logic";
import { User } from "./User";
import { Game } from "./Game";
import { rerender } from "./render";
import { Guess } from "./Guess";

export class Question {
  private _mode: number = 0;
  private ref: Reference;
  public done: boolean = false;
  public finished: boolean = false;
  private _answer;
  private _question;
  private guesses: Map<string, Guess> = new Map();
  public game: Game;

  constructor(ref, game: Game) {
    this.ref = ref;
    this.game = game;
  }

  public async load() {
    const [answer, question] = await retrievePseudoRandomNumber();
    this.answer = answer;
    this.question = question;
  }

  set mode(mode) {
    if (mode === 0) {
      this.ref.child('type').set("pw");
    } else {
      this.ref.child('type').set("amount");
    }
  }

  get mode() {
    return this._mode;
  }

  set answer(answer) {
    this.ref.child('answer').set(answer);
  }

  get answer() {
    return this._answer;
  }

  set question(question) {
    this.ref.child('question').set(question);
  }

  get question() {
    return this._question;
  }

  public answerQuestion(user: User, answer) {
    return this.ref.child('guesses').child(user.uid).child('guess').set(answer);
  }

  public playerIsReady(user: User) {
    return this.ref.child('guesses').child(user.uid).child('ready').set(42);
  }

  public async checkAnswer(user: User, answer) {
    let count = 0;
    if (this.mode === 0) {
      count = await getPasswordCount(answer);
    } else if (answer !== null && answer.length > 0 && !isNaN(answer)) {
      count = parseInt(answer);
    }

    this.ref.child('quesses').child(user.uid).child('amount').set(count);
  }

  createListeners() {
    this.game.currentQuestion = this;

    this.ref.child('guesses').on('child_added', snap => {
      const guess = new Guess(snap.ref, this);
      guess.user = [... this.game.players].find(a => a.uid === snap.key);

      this.guesses.set(guess.user.uid, guess);
    });

    this.ref.child('question').on('value', snap => {
      this.question = snap.val();
      this.done = false;
      rerender()
    });

    this.ref.child('answer').on('value', snap => {
      this.answer = snap.val();
    });

    this.ref.child('type').on('value', snap => {
      const type = snap.val();

      if (type === "pw") {
        this.mode = 0;
      } else {
        this.mode = 1;
      }

      rerender()
    });

    this.ref.child('finished').on('value', snap => {
      this.finished = snap.val();
    });
  }
}
