import env from './env.js';
import G from './constants/globalConstants.js';
import msgUtils from './utils/messageUtils.js';
import { IllegalArgumentError } from './errors/IllegalArgumentError.js';
import { MenuItem } from './entity/MenuItem.js';
import commonUtils from './utils/commonUtils.js';


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
async function play() {
  // 메뉴 가져오기
  const menuList = await getMenuList();

  // 안내인사
  showMsgGreeting();

  // 방문날짜 입력 받기
  const dayForVisit = askDayForVisit();

  // 주문 받기
  const orderItems = askOrderItems(menuList);
  
}

/**
 * 메뉴 가져오기
 * @returns 
 */
async function getMenuList() {
  const menuList = [];

  const resJson = await commonUtils.callApi(G.URL_GET_MENU_LIST);
  resJson.forEach(item => {
    const menuItem = new MenuItem(item);
    menuList.push(menuItem);
  })
  
  return menuList;
}

/**
 * 안내인사 보여주기
 */
function showMsgGreeting() {
  msgUtils.showMsg(msgUtils.getMsg("MSG_INF_001", G.NOW_MONTH));
}

/**
 * 방문 날짜 입력받기
 * 
 * @returns 방문할 날짜
 */
function askDayForVisit() {
  // prompt 호출
  const dayForVisit = msgUtils.promptMsg(msgUtils.getMsg("MSG_PRT_001", G.NOW_MONTH));

  // 입력값 validate
  try {
    validateDayForVisit(dayForVisit);
  } catch(e) {
    if (e instanceof IllegalArgumentError) {
      msgUtils.showError(msgUtils.getMsg("MSG_ERR_001", "날짜"));
      askDayForVisit(); // 재호출
      return false;
    }
    throw e;
  }

  return dayForVisit;
}

/**
 * 방문 날짜 vaildate
 * 
 * @param {*} dayForVisit 
 * @returns {boolean}
 */
function validateDayForVisit(dayForVisit) {
  // validate - 숫자 여부
  if (isNaN(dayForVisit)) {
    throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001", "날짜"));
  }

  // validate - 수 범위
  if ((dayForVisit < G.MIN_DAY_FOR_VISIT || dayForVisit > G.MAX_DAY_FOR_VISIT)) {
    throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001", "날짜"));
  }

  return true;
}

/**
 * 주문항목 목록 입력받기
 * 
 * @param {Array<MenuItem>} menuList
 * @returns 
 */
function askOrderItems(menuList) {
  // prompt 호출
  const orderItemsInput = msgUtils.promptMsg(msgUtils.getMsg("MSG_PRT_002"));

  // 주문항목목록으로 변환
  let orderItems;
  try {
    const orderInputArr = convertInputToOrderInputArr(orderItemsInput); // 입력값 -> 입력값 배열
    // 입력값 배열 -> 주문항목목록 // TODO

  } catch(e) { 
    if (e instanceof IllegalArgumentError) {
      msgUtils.showError(msgUtils.getMsg("MSG_ERR_001", "주문"));
      askOrderItems(); // 재호출
      return false;
    }
    throw e;
  }

  return orderItems;
}

/**
 * 주문 입력값을 배열로 split
 * 
 * @param {*} inputStr 
 * @returns 주문입력 배열
 */
function convertInputToOrderInputArr(inputStr) {
  // 배열로 split
  const orderInputArr = inputStr.split(G.MENU_DELIMITER).map(item => item.trim());

  // 주문입력 배열 validate
  validateOrderInpuArr(orderInputArr);

  return orderInputArr;
}

/**
 * 주문입력 배열 validate
 * @param {*} orderArr 
 */
function validateOrderInpuArr(orderInputArr) {
  // 배열 길이 체크
  if (orderInputArr == null || orderInputArr.length < 1) {
    throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001", "주문"));
  }

  // 입력값 형태 validate
  orderInputArr.forEach(item => {
    if (!G.REGEX_ORDER_INPUT_ITEM.test(item)) { // "문자-숫자" 형태
      throw new IllegalArgumentError(msgUtils.getMsg("MSG_ERR_001", "주문"));
    }
  });

  return true;
}


