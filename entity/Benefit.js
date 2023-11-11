export class Benefit {

  constructor({name, discountAmt, gift}) {
    if (discountAmt == null || discountAmt == '') {
      discountAmt = 0;
    }

    this._name = name;
    this._discountAmt = Number(discountAmt);
    this._gift = gift;
  }

  getName() {
    return this._name;
  }

  getdiscountAmt() {
    return this._discountAmt;
  }

  getGift() {
    return this._gift;
  }

  getGiftTotalValue() {
    if (!this.hasGift()) {
      return 0;
    }
    return this._gift.getTotalValue();
  }

  getTotalValue() {
    return this._discountAmt + this.getGiftTotalValue();
  }

  hasGift() {
    let hasGift = false;
    if (this._gift != null) {
      hasGift = true;
    }

    return hasGift;
  }
}