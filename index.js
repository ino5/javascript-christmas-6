import env from './env.js';

import cUtils from './commonUtils.js';

/* 상수 */
const MIN_DAY_FOR_VISIT = 1;
const MAX_DAY_FOR_VISIT = 31;

const MENU_DELIMITER = ',';


/* 실행 */

play();

/**
 * 실행
 */
function play() {
  // 안내인사
  showMsgGreeting();

  // 객체 생성
  const menuBoard = menuBoardFactory(); // 메뉴판객체
  const orderObj = orderObjFactory(); // 주문객체

  // 예약일 받기
  orderObj.askDayForVisit();

  // 메뉴 주문받기
  orderObj.askMenuOrder();
}



function orderObjFactory() {
  let _dayForVisit; // 예약일

  /**
   * 예약일 받기
   */
  function askDayForVisit() {
    // prompt
    const promptResult = promptMsg(cUtils.getMsg("MSG_PRT_001")); // 방문날짜 입력받기

    // validate - 수 범위
    if (isNaN(promptResult) || (promptResult < MIN_DAY_FOR_VISIT || promptResult > MAX_DAY_FOR_VISIT)) {
      showError("MSG_ERR_001");
      askDayForVisit();
    }
  }

  /**
   * 주문받기
   */
  function askMenuOrder() {
    // prompt
    const promptResult = promptMsg(cUtils.getMsg("MSG_PRT_002")); // 주문받기
    let menuOrders = promptResult.split(MENU_DELIMITER);
    menuOrders = menuOrders.map(item => item.trim());

    // 각 메뉴에 대한 validate
    const nameOrderedSet = new Set(); // 주문메뉴이름 Set
    menuOrders.forEach(item => {
      // validate - 메뉴 형식
      if (!/(.+)-(\d)/.test(item)) { // "문자-숫자" 형태
        showError(cUtils.getMsg("MSG_ERR_002"));
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
  // const response = await fetch("/menu.json");
}

/* 출력 함수 */
function showMsgGreeting() {
  cUtils.showMsg(cUtils.getMsg("MSG_INF_001"));
}


