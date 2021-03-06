import { User } from "./User";
import { Question } from "./Question";
import { rerender } from "./render";
import { getPasswordCount } from "./logic";
import { database } from "firebase";
import { state } from "./state";

export class Guess {
  private ref: database.Reference;
  public amount;
  public guess;
  public ready: boolean = false;
  public user: User;
  private question: Question;

  constructor(ref: database.Reference, question: Question){
    this.ref = ref;
    this.question = question;
  }

  createListeners() {
    this.ref.child('amount').on('value', snap => {
      this.amount = snap.val();

      this.user.addPoints(this.getPoints());

      rerender();
    });

    this.ref.child('guess').on('value', snap => {
      this.guess = snap.val();

      if (state.user && this.question.game.creator && state.user.uid === this.question.game.creator.uid) {
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
    
    if (amountA == amountB) {
      return 100;
    }

    if (amountA < amountB) {
      const a = amountA;
      amountA = amountB;
      amountB = a;
    }


    const percentage = Math.log(1 + (amountB / amountA) * (Math.E - 1));

    if (percentage < 1) {
      return Math.round(100 * percentage)
    }

    return -1;
  }
}