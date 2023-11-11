const constants = {
  NOW_MONTH: 12,
  MIN_DAY_FOR_VISIT: 1,
  MAX_DAY_FOR_VISIT: 31,

  ITEM_TYPE_DRINK: '음료',

  URL_GET_MENU_LIST: '/menu.json',

  MENU_DELIMITER:',',
  ORDER_DELIMITER:'-',
  REGEX_ORDER_INPUT_ITEM: /^(.+)-(\d*)$/, // "문자-숫자" 형태
}

export default constants;