import { User } from "./User";
import { Question } from "./Question";
import { rerender } from "./render";
import { getPasswordCount } from "./logic";
import { Reference } from "@firebase/database";

export class Guess {
  private ref: Reference;
  public amount;
  public guess;
  public ready: boolean = false;
  public user: User;
  private question: Question;

  constructor(ref: Reference, question: Question){
    this.ref = ref;
    this.question = question;
  }

  createListeners() {
    this.ref.child('amount').on('value', snap => {
      this.amount = snap.val();

      if (this.user) {
        this.user.addPoints(this.getPoints());
      }

      rerender();
    });

    this.ref.child('guess').on('value', snap => {
      this.guess = snap.val();

      if (this.user.uid === this.question.game.creator.uid) {
        this.check()
      }

      rerender();
    });

    this.ref.child('ready').on('value', snap => {
      this.ready = snap.val();
      rerender();
    });
  }

  public async check() {
    let count = 0;
    if (this.question.mode === 0) {
      count = await getPasswordCount(this.guess);
    } else if (this.guess !== null && this.guess.length > 0 && !isNaN(this.guess)) {
      count = parseInt(this.guess);
    }

    this.ref.child('amount').set(count);
  }

  getPoints(){
    let amountA = this.amount;
    let amountB = this.question.question;

    if (amountA < amountB) {
      const a = amountA;
      amountA = amountB;
      amountB = a;
    }

    if (amountA == 0) {
      return 0;
    }

    const percentage = Math.log(1 + (amountB / amountA) * (Math.E - 1));

    if (percentage < 1) {
      return Math.round(100 * percentage)
    }

    return 100;
  }
}