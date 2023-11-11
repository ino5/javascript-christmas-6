const MSG_PARAM = '[%s]';

const message = {
  PARAM: MSG_PARAM,
  ERROR_PREFIX: `[ERROR]`,

  MSG_INF_001: `안녕하세요! 우테코 식당 ${MSG_PARAM}월 이벤트 플래너입니다.`,

  MSG_PRT_001: `${MSG_PARAM}월 중 식당 예상 방문 날짜는 언제인가요? (숫자만 입력해 주세요!)`,
  MSG_PRT_002: `주문하실 메뉴와 개수를 알려 주세요. (e.g. 해산물파스타-2,레드와인-1,초코케이크-1)`,
  
  MSG_ERR_001: `유효하지 않은 ${MSG_PARAM}입니다. 다시 입력해 주세요.`,
}

export default message;