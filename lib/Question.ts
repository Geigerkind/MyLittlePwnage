import { database } from "firebase";
import { retrievePseudoRandomNumber, getPasswordCount } from "./logic";
import { User } from "./User";
import { Game } from "./Game";
import { rerender } from "./render";
import { Guess } from "./Guess";

export class Question {
  private _mode: number = 0;
  private ref: database.Reference;
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

  createListeners() {
    this.game.currentQuestion = this;

    this.ref.child('guesses').on('child_added', snap => {
      const guess = new Guess(snap.ref, this);
      guess.user = [... this.game.players].find(a => a.uid === snap.key);
      
      if(!guess.user){
        const user = new User(snap.key)
        this.game.players.add(user);
        guess.user = user;
      }

      this.guesses.set(guess.user.uid, guess);

      guess.createListeners();
    });

    this.ref.child('question').on('value', snap => {
      this._question = snap.val();
      this.done = false;
      rerender()
    });

    this.ref.child('answer').on('value', snap => {
      this._answer = snap.val();
    });

    this.ref.child('type').on('value', snap => {
      const type = snap.val();

      if (type === "pw") {
        this._mode = 0;
      } else {
        this._mode = 1;
      }

      rerender()
    });

    this.ref.child('finished').on('value', snap => {
      this.finished = snap.val();
    });
  }
}
