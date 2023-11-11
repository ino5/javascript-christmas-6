export class Gift {

  constructor({name, count, value}) {
    if (count == null || count == '') {
      count = 1;
    }    
    if (value == null || value == '') {
      value = 0;
    }

    this._name = name;
    this._count = Number(count);
    this._value = Number(value);
  }

  getName() {
    return this._name;
  }
  getCount() {
    return this._count;
  }
  getValue() {
    return this._value;
  }
  getTotalValue() {
    return this._value * this._count;
  }
}