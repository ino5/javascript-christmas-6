const constants = {
  EVENT_YEAR: 2023,
  EVENT_MONTH: 12,
  MIN_DAY_FOR_VISIT: 1,
  MAX_DAY_FOR_VISIT: 31,
  MAX_ORDER_COUNT: 20,

  CHRISTMAS_D_DAY_SALE_DEFAULT: 1000,
  CHRISTMAS_D_DAY_SALE_PER_DAY: 100,
  WEEKDAYS_SALE_PER_DESSERT: 2023,
  WEEKEND_SALE_PER_MAIN: 2023,
  SPECIAL_SALE_TOTAL: 1000,
  BENEFIT_CONDITION_AMT: 10000,
  GIFT_EVENT_CONDITION_AMT: 120000,

  ITEM_TYPE_APPETIZER: '애피타이저',
  ITEM_TYPE_MAIN: '메인',
  ITEM_TYPE_DESSERT: '디저트',
  ITEM_TYPE_DRINK: '음료',

  EVENT_BADGE_NONE: '없음',
  EVENT_BADGE_STAR: '별',
  EVENT_BADGE_TREE: '트리',
  EVENT_BADGE_SANTA: '산타',
  EVENT_BADGE_STAR_CONDITION_AMT: '5000',
  EVENT_BADGE_TREE_CONDITION_AMT: '10000',
  EVENT_BADGE_SANTA_CONDITION_AMT: '20000',

  TEXT_EMPTY: '없음',
  UNIT_COUNT: '개',
  UNIT_AMT: '원',

  DAY_OF_WEEK_FRIDAY: 5,
  DAY_OF_WEEK_SATURDAY: 6,
  SPECIAL_SALE_DAY_ARR: [3, 10, 17, 24, 25, 31],

  MENU_DELIMITER:',',
  ORDER_DELIMITER:'-',
  REGEX_ORDER_INPUT_ITEM: /^(.+)-(\d*)$/, // "문자-숫자" 형태

  TITLE_ORDER_MENU: '<주문 메뉴>',
  TITLE_BF_SALE_TOTAL_AMT: '<할인 전 총주문 금액>',
  TITLE_GIFT_MENU: '<증정 메뉴>',
  TITLE_BENEFIT_LIST: '<혜택 내역>',
  TITLE_TOTAL_BENEFIT_AMT: '<총혜택 금액>',
  TITLE_AF_SALE_TOTAL_AMT: '<할인 후 예상 결제 금액>',
  TITLE_EVENT_BADGE_12: '<12월 이벤트 배지>',

  BENEFIT_NAME_CHRISTMAS_D_DAY_SALE: '크리스마스 디데이 할인',
  BENEFIT_NAME_WEEKDAYS_SALE: '평일 할인',
  BENEFIT_NAME_WEEKEND_SALE: '주말 할인',
  BENEFIT_NAME_SPECIAL_SALE: '특별 할인',
  BENEFIT_NAME_GIFT_EVENT: '증정 이벤트',

  GIFT_NAME_SHAMPAGNE: '샴페인',

  URL_GET_MENU_LIST: '/menu.json',
}

export default constants;