import env from './env.js';
import G from './constants/globalConstants.js';
import msgUtils from './utils/messageUtils.js';
import { IllegalArgumentError } from './errors/IllegalArgumentError.js';



/*** 상수 ***/
const MENU_DELIMITER = ',';


/*** 메인 영역 ***/

// 실행
if (env.isDev()) { // 개발모드일 경우 수동으로 실행
  window.play = play;
} else {
  play();
}


/*** 함수 영역 ***/

/**
 * 실행
 */
function play() {
  // 안내인사
  showMsgGreeting();

  // 방문날짜 입력 받기
  promptMsgDayForVisit();
  
}

/**
 * 안내인사 보여주기
 */
function showMsgGreeting() {
  msgUtils.showMsg(msgUtils.getMsg("MSG_INF_001", G.NOW_MONTH));
}

/**
 * 방문 날짜 입력받기
 */
function promptMsgDayForVisit() {
  // prompt 호출
  const dayForVisit = msgUtils.promptMsg(msgUtils.getMsg("MSG_PRT_001", G.NOW_MONTH));

  // 입력값이 유효하지 않으면 에러메시지 호출 후 재호출
  try {
    validateDayForVisit(dayForVisit);
  } catch(e) {
    if (e instanceof IllegalArgumentError) {
      msgUtils.showError(e.message);
      promptMsgDayForVisit();
    }
  }

  return dayForVisit;
}

/**
 * 방문 날짜 vaildate
 */
function validateDayForVisit(dayForVisit) {
  // validate - 숫자 여부
  if (isNaN(dayForVisit)) {
    throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001"));
  }

  // validate - 수 범위
  if ((dayForVisit < G.MIN_DAY_FOR_VISIT || dayForVisit > G.MAX_DAY_FOR_VISIT)) {
    throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001"));
  }

  return true;
}







////////////////////////////////////
/* 삭제 예정 */


function orderObjFactory() {
  let _dayForVisit; // 예약일

  /**
   * 예약일 받기
   */
  function askDayForVisit() {
    // prompt
    const promptResult = promptMsg(msgUtils.getMsg("MSG_PRT_001")); // 방문날짜 입력받기

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
    const promptResult = promptMsg(msgUtils.getMsg("MSG_PRT_002")); // 주문받기
    let menuOrders = promptResult.split(MENU_DELIMITER);
    menuOrders = menuOrders.map(item => item.trim());

    // 각 메뉴에 대한 validate
    const nameOrderedSet = new Set(); // 주문메뉴이름 Set
    menuOrders.forEach(item => {
      // validate - 메뉴 형식
      if (!/(.+)-(\d)/.test(item)) { // "문자-숫자" 형태
        showError(msgUtils.getMsg("MSG_ERR_002"));
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


