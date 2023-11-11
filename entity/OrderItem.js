export class OrderItem {

  constructor({name, count}) {
    this._name = name;
    this._count = Number(count);
  }

  getName() {
    return this._name;
  }

  getCount() {
    return this._count;
  }
}