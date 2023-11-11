const MSG_PARAM = '[%s]';

const message = {
  PARAM: MSG_PARAM,
  ERROR_PREFIX: `[ERROR] `,

  MSG_INF_001: `안녕하세요! 우테코 식당 ${MSG_PARAM}월 이벤트 플래너입니다.`,
  MSG_INF_002: `취소하였습니다.`,
  MSG_INF_003: `${MSG_PARAM}월 ${MSG_PARAM}일에 우테코 식당에서 받을 이벤트 혜택 미리 보기!`,

  MSG_CFM_001: `정말 취소하시겠습니까?`,

  MSG_PRT_001: `${MSG_PARAM}월 중 식당 예상 방문 날짜는 언제인가요? (숫자만 입력해 주세요!)`,
  MSG_PRT_002: `주문하실 메뉴와 개수를 알려 주세요. (e.g. 해산물파스타-2,레드와인-1,초코케이크-1)`,
  
  MSG_ERR_001: `유효하지 않은 ${MSG_PARAM}입니다. 다시 입력해 주세요.`,
  MSG_ERR_002: `메뉴 목록에 존재하지 않습니다.`,

  MSG_WRN_001: `총주문 금액 10,000원 이상부터 이벤트가 적용됩니다.`,
  MSG_WRN_002: `음료만 주문 시, 주문할 수 없습니다.`,
  MSG_WRN_003: `메뉴는 한 번에 최대 20개까지만 주문할 수 있습니다. \n(e.g. 시저샐러드-1, 티본스테이크-1, 크리스마스파스타-1, 제로콜라-3, 아이스크림-1의 총개수는 7개)`,
}

export default message;