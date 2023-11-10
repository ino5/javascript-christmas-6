import constMsg from './constMessage.js';


/* 상수 */
const MIN_DAY_FOR_VISIT = 1;
const MAX_DAY_FOR_VISIT = 31;

const MENU_DELIMITER = ',';
const MSG_PARAM = '[%s]';


/* DB */
const DATA_LIST_MENU = [
  { type: "애피타이저", name: "양송이수프", cost: 6000 },
  { type: "애피타이저", name: "타파스", cost: 5500 },
  { type: "애피타이저", name: "시저샐러드", cost: 8000 },
  { type: "메인", name: "티본스테이크", cost: 55000 },
  { type: "메인", name: "바비큐립", cost: 54000 },
  { type: "메인", name: "해산물파스타", cost: 35000 },
  { type: "메인", name: "크리스마스파스타", cost: 25000 },
  { type: "디저트", name: "초코케이크", cost: 15000 },
  { type: "디저트", name: "아이스크림", cost: 5000 },
  { type: "음료", name: "제로콜라", cost: 3000 },
  { type: "음료", name: "레드와인", cost: 60000 },
  { type: "음료", name: "샴페인", cost: 25000 },
];

// 안내인사
showMsgGreeting();

// 객체 생성
const menuBoard = menuBoardFactory(); // 메뉴판객체
const orderObj = orderObjFactory(); // 주문객체

// 예약일 받기
orderObj.askDayForVisit();

// 메뉴 주문받기
orderObj.askMenuOrder();

function orderObjFactory() {
  let _dayForVisit; // 예약일

  /**
   * 예약일 받기
   */
  function askDayForVisit() {
    // prompt
    const promptResult = promptMsg(getMsg(constMsg.PRT_001)); // 방문날짜 입력받기

    // validate - 수 범위
    if (isNaN(promptResult) || (promptResult < MIN_DAY_FOR_VISIT || promptResult > MAX_DAY_FOR_VISIT)) {
      showError(constMsg.ERR_001);
      askDayForVisit();
    }
  }

  /**
   * 주문받기
   */
  function askMenuOrder() {
    // prompt
    const promptResult = promptMsg(getMsg(constMsg.PRT_002)); // 주문받기
    let menuOrders = promptResult.split(MENU_DELIMITER);
    menuOrders = menuOrders.map(item => item.trim());

    // 각 메뉴에 대한 validate
    const nameOrderedSet = new set(); // 주문메뉴이름 Set
    menuOrders.forEach(item => {
      // validate - 메뉴 형식
      if (!/(.+)-(\d)/.test(item)) { // "문자-숫자" 형태
        showError(getMsg(constMsg.ERR_002));
      }

      // validate - 메뉴판에 없는 메뉴

      // validate - 메뉴 개수

      // validate - 중복 메뉴

      // 주문메뉴이름 Set 추가
    })
    
  }

  return {
    askDayForVisit,
    askMenuOrder,
  };
}

/* 메뉴판 객체 */
function menuBoardFactory() {

}

/* 출력 함수 */
function showMsgGreeting() {
  showMsg(getMsg(constMsg.INF_001));
}


/* 출력 관련 공통 함수 */

function showMsg(msg) {
  alert(msg);
}

function showError(msg) {
  showMsg('[ERROR]' + msg);
}

function confirmMsg(msg) {
  const result = confirm(msg);
  return result;
}

function promptMsg(msg, defaultVal, allowCancel=false) {
  const result = prompt(msg, defaultVal);

  // 취소 허용되지 않으면 취소시 다시 prompt
  if(result == null && !allowCancel) {
    promptMsg(msg, defaultVal, allowCancel);
  }
  
  return result;
}

function getMsg(msgCode, ...strParamArgs) {
  let result = msgCode;
  for (var i = 0; i < strParamArgs.length; i++) {
    result.replace(MSG_PARAM, strParamArgs[i]);
  }
  return result;
}
