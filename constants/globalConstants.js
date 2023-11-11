const constants = {
  EVENT_MONTH: 12,
  MIN_DAY_FOR_VISIT: 1,
  MAX_DAY_FOR_VISIT: 31,
  MAX_ORDER_COUNT: 20,

  ITEM_TYPE_DRINK: '음료',

  UNIT_COUNT: '개',

  MENU_DELIMITER:',',
  ORDER_DELIMITER:'-',
  REGEX_ORDER_INPUT_ITEM: /^(.+)-(\d*)$/, // "문자-숫자" 형태

  TITLE_ORDER_MENU: '<주문 메뉴>',
  TITLE_BF_SALE_TOTAL_AMT: '<할인 전 총주문 금액>',
  TITLE_GIFT_MENU: '<증정 메뉴>',
  TITLE_BENEFITS_LIST: '<혜택 내역>',
  TITLE_TOTAL_BENEFITS_AMT: '<총혜택 금액>',
  TITLE_AF_SALE_TOTAL_AMT: '<할인 후 예상 결제 금액>',
  TITLE_12_EVENT_BADGE: '<12월 이벤트 배지>',

  BENEFIT_CHRISTMAS_D_DAY_SALE: '크리스마스 디데이 할인',
  BENEFIT_WEEKDAYS_SALE: '평일 할인',
  BENEFIT_WEEKEND_SALE: '주말 할인',
  BENEFIT_SPECIAL_SALE: '특별 할인',
  BENEFIT_GIFT_EVENT: '증정 이벤트',

  URL_GET_MENU_LIST: '/menu.json',
}

export default constants;