export class MenuItem {

  constructor({type, name, cost}) {
    this._type = type;
    this._name = name;
    this._cost = Number(cost);
  }

  getType() {
    return this._cost;
  }
  getName() {
    return this._name;
  }
  getCost() {
    return this._cost;
  }
}