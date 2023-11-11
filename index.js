import env from './env.js';
import G from './constants/globalConstants.js';
import msgUtils from './utils/messageUtils.js';
import commonUtils from './utils/commonUtils.js';
import { IllegalArgumentError } from './errors/IllegalArgumentError.js';
import { MenuItem } from './entity/MenuItem.js';
import { OrderItem } from './entity/OrderItem.js';
import message from './constants/messageConstants.js';

/*** 메인 영역 ***/
window.play = play;
play();

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

  // 나의 이벤트 혜택 보여주기
  showMsgMyEventBenefits(dayForVisit, orderItems, menuList);

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
  msgUtils.showMsg(msgUtils.getMsg('MSG_INF_001', G.EVENT_MONTH));
}

/**
 * 방문 날짜 입력받기
 * 
 * @returns 방문할 날짜
 */
function askDayForVisit() {
  // prompt 호출
  const dayForVisit = msgUtils.promptMsg(msgUtils.getMsg('MSG_PRT_001', G.EVENT_MONTH));

  // 입력값 validate
  try {
    validateDayForVisit(dayForVisit);
  } catch(e) {
    if (e instanceof IllegalArgumentError) {
      msgUtils.showError(e.message);
      return askDayForVisit(); // 재호출
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
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '날짜'));
  }

  // validate - 수 범위
  if ((dayForVisit < G.MIN_DAY_FOR_VISIT || dayForVisit > G.MAX_DAY_FOR_VISIT)) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '날짜'));
  }

  return true;
}

/**
 * 주문항목 목록 입력받기
 * 
 * @param {Array<MenuItem>} menuList 메뉴판
 * @returns {Array<OrderItem>} orderItems 주문목록
 */
function askOrderItems(menuList) {
  // prompt 호출
  const orderItemsInput = msgUtils.promptMsg(msgUtils.getMsg('MSG_PRT_002'));

  // 주문항목목록으로 변환
  let orderItems;
  try {
    const orderInputArr = convertInputToOrderInputArr(orderItemsInput); // 입력값 -> 입력값 배열
    orderItems = convertArrToOrderItems(orderInputArr, menuList); // 입력값 배열 -> 주문항목목록

  } catch(e) { 
    if (e instanceof IllegalArgumentError) {
      msgUtils.showError(e.message);
      return askOrderItems(menuList); // 재호출
    }
    throw e;
  }

  return orderItems;
}

/**
 * 주문 입력값을 배열로 변환
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
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
  }

  // 입력값 형태 validate
  orderInputArr.forEach(item => {
    if (!G.REGEX_ORDER_INPUT_ITEM.test(item)) { // '문자-숫자' 형태
      throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
    }
  });

  return true;
}

/**
 * 주문입력배열을 주문항목목록으로 변환
 * 
 * @param {Array<string>} orderInputArr 
 * @param {*} menuList 
 * @returns 
 */
function convertArrToOrderItems(orderInputArr, menuList) {
  const orderItems = [];

  // OrderItem으로 변환
  orderInputArr.forEach(orderInput => {
    const orderItem = convertStringToOrderItem(orderInput, menuList);
    orderItems.push(orderItem);
  });

  // 주문항목목록 validate
  validateOrderItems(orderItems, menuList);

  return orderItems;
}

/**
 * 주문항목목록 validate
 * 
 * @param {Array<OrderItem>} orderItems 
 * @returns 
 */
function validateOrderItems(orderItems, menuList) {
  // validate - 항목 개수가 1개 이상인지
  if (! (orderItems != null && orderItems.length > 0) ) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
  }

  // validate - 중복 주문 불가능
  if (checkDuplicateInOrder(orderItems)) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
  }

  // validate - 음료만 주문 불가능
  if (checkOnlyDrinkInOrder(orderItems, menuList)) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_WRN_002'));
  }

  // validate - 메뉴 한 번에 최대 주문개수 초과
  if (getTotalCountInOrder(orderItems) > G.MAX_ORDER_COUNT) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_WRN_003'));
  }

  return true;
}

/**
 * 중복 주문 없는지 확인
 * 
 * @param {Array<OrderItem>} orderItems 
 * @returns {boolean}
 */
function checkDuplicateInOrder(orderItems) {
  const nameSet = new Set();
  const isDuplicated = orderItems.some(item => {
    if (nameSet.has(item.getName())) {
      return true;
    }
    nameSet.add(item.getName());
    return false;
  });

  return isDuplicated;
}

/**
 * 음료만 주문했는지 확인
 * 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList
 * @returns {boolean}
 */
function checkOnlyDrinkInOrder(orderItems, menuList) {
  const hasExceptDrink = orderItems.some(orderItem => {
    const type = getTypeByMenuName(orderItem.getName(), menuList);
    return type != G.ITEM_TYPE_DRINK // 음료 아닌 것을 가지고 있는지
  });
  const hasOnlyDrink = !hasExceptDrink; // 음료 제외하고 가지고 있는 게 없다면 오직 음료만 가지고 있음
  return hasOnlyDrink;
}

/**
 * 주문 총 개수 확인
 * 
 * @param {Array<OrderItem>} orderItems 
 * @returns {number}
 */
function getTotalCountInOrder(orderItems) {
  let totalCount = 0;
  orderItems.forEach(item => totalCount += item.getCount());
  return totalCount;
}

/**
 * 메뉴 타입 가져오기
 * 
 * @param {string} menuName
 * @param {Array<MenuItem>} menuList
 * @returns {string}
 */
function getTypeByMenuName(menuName, menuList) {
  for (let i = 0; i < menuList.length; i++) {
    if (menuName == menuList[i].getName()) {
      return menuList[i].getType();
    }
  }
  throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_002'));
}

/**
 * 문자열을 OrderItem으로 변환
 * 
 * @param {string} orderInput '메뉴이름-주문수'
 * @param {Array<MenuItem>} menuList
 * @returns {OrderItem}
 */
function convertStringToOrderItem(orderInput, menuList) {
  // OrderItem으로 변환
  const delimIndex = orderInput.lastIndexOf(G.ORDER_DELIMITER);
  const name = orderInput.substring(0, delimIndex);
  const count = orderInput.substring(delimIndex + 1);
  const orderItem = new OrderItem({name, count});

  // OrderItem validate
  validateOrderItem(orderItem, menuList);  

  return orderItem;
}

/**
 * OrderItem validate
 * 
 * @param {OrderItem} orderItem 
 * @param {Array<MenuItem>} menuList 
 */
function validateOrderItem(orderItem, menuList) {
  // validate - 메뉴판에 있는 메뉴인지
  if (!checkInMenuList(orderItem, menuList)) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
  }

  // validate - 주문 개수가 1개 이상인지
  if (orderItem.getCount() < 1) {
    throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_001', '주문'));
  }  

  return true;
}

/**
 * 메뉴판에 있는 메뉴를 주문했는지 확인하기
 * 
 * @param {OrderItem} orderItem 
 * @param {Array<MenuItem>} menuList 
 * @returns {boolean} 
 */
function checkInMenuList(orderItem, menuList) {
  const existsInMenuList = menuList.some(menuItem => menuItem.getName() == orderItem.getName());
  return existsInMenuList;  
}

/**
 * 이벤트 혜택 보여주기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList 
 */
function showMsgMyEventBenefits(dayForVisit, orderItems, menuList) {
  let allMessage = ""; // 마지막에 보여줄 전체 메시지

  // 제목 보여주기
  allMessage += showMsgMyEventBenefitsTitle(dayForVisit) + '\n';

  // 주문 메뉴 메시지 보여주기
  allMessage += showMsgMyOrderItems(orderItems) + '\n';

  // 할인 전 총주문 금액 보여주기
  allMessage += showMsgBfSaleTotalAmt(orderItems, menuList) + '\n';

  // 전체 메시지 보여주기
  msgUtils.showMsg(allMessage);

}

/**
 * 이벤트 혜택 제목 보여주기
 * @param {*} dayForVisit 
 */
function showMsgMyEventBenefitsTitle(dayForVisit) {
  const message = msgUtils.getMsg('MSG_INF_003', G.EVENT_MONTH, dayForVisit);

  msgUtils.showMsg(message);
  return message + '\n';
}

/**
 * 주문 메뉴 메시지 보여주기
 * @param {Array<OrderItem>} orderItems 
 */
function showMsgMyOrderItems(orderItems) {
  let message = "";
  message += `${G.TITLE_ORDER_MENU}\n`;

  orderItems.forEach((item) =>{
    message += `${item.getName()} ${item.getCount()}${G.UNIT_COUNT}\n`; 
  });

  msgUtils.showMsg(message);
  return message;
}

/**
 * 할인 전 총주문 금액 보여주기
 * 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList
 */
function showMsgBfSaleTotalAmt(orderItems, menuList) {
  let message = "";
  message += `${G.TITLE_BF_SALE_TOTAL_AMT}\n`;

  let totalCost = 0;
  orderItems.forEach((item) =>{
    totalCost += getCostByMenuName(item.getName(), menuList);
  });
  message += `${commonUtils.getFormatAmt(totalCost)}\n`;

  msgUtils.showMsg(message);
  return message + '\n';
}

/**
 * 메뉴 가격 가져오기
 * 
 * @param {string} menuName
 * @param {Array<MenuItem>} menuList
 * @returns {string}
 */
function getCostByMenuName(menuName, menuList) {
  for (let i = 0; i < menuList.length; i++) {
    if (menuName == menuList[i].getName()) {
      return menuList[i].getCost();
    }
  }
  throw new IllegalArgumentError(msgUtils.getMsg('MSG_ERR_002'));
}
