export class User {
  public uid;
  public displayName;
  public points = 0;
  
  public originalUser;

  constructor(uid) {
    this.uid = uid;
  }

  addPoints(points) {
    this.points += points;
  }
}
