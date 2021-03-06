import { Question } from "./Question";
import { database } from "firebase";
import { rerender, changePage } from "./render";
import { state } from "./state";
import { User } from "./User";

export class Game {
  private ref: database.Reference;
  public hackLastQuestion: number = 0;
  public maxRounds: number = 10;
  public currentQuestion: Question;
  public mode: number = 0;
  public questions: Set<Question> = new Set();
  public players: Set<User> = new Set();
  public finished: boolean = false;
  public started: boolean = false;
  public creator: User;
  
  constructor(ref) {
    this.ref = ref;

    this.createListeners();
  }

  get round(){
    return this.questions.size;
  }

  public create(user: User) {
    this.ref.child('creator').set(user.uid);
    this.ref.child('mode').set(this.mode);

    this.addPlayer(user);

    return this;
  }

  async newQuestion() {
    const ref = this.ref.child('questions').push();
    const question = new Question(ref, this);

    question.mode = this.mode;

    if (this.currentQuestion !== undefined && this.questions.has(this.currentQuestion)) {
      this.currentQuestion.done = true;

      rerender();
    }

    return question.load();
  }

  addPlayer(player: User) {
    return this.ref.child('players').child(player.uid).set(player.displayName);
  }

  createListeners() {
    this.ref.child('questions').on('child_added', snap => {
      if (state.page === 'leaderboard') {
        state.page = 'question';
      }

      const newQuestion = new Question(snap.ref, this);

      newQuestion.done = true;

      newQuestion.createListeners()

      this.questions.add(newQuestion);


      rerender();
    });

    this.ref.child('players').on('child_added', snap => {
      let user = [... this.players].find(a => a.uid === snap.key);

      if(!user) {
        user = new User(snap.key);
        
        this.players.add(user);
      }

      user.displayName = snap.val();

      if(state.page === 'name' && state.user.uid === user.uid){
        changePage('question');
      }
    });

    this.ref.child('finished').on('value', snap => {
      this.finished = snap.val();
    });

    this.ref.child('mode').on('value', snap => {
      this.mode = snap.val();
    });

    this.ref.child('creator').on('value', snap => {
      this.creator = new User(snap.val());
    });
  }
}
