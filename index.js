import G from './constants/globalConstants.js';
import msgUtils from './utils/messageUtils.js';
import commonUtils from './utils/commonUtils.js';
import { IllegalArgumentError } from './errors/IllegalArgumentError.js';
import { MenuItem } from './entity/MenuItem.js';
import { OrderItem } from './entity/OrderItem.js';
import { Benefit } from './entity/Benefit.js';
import { Gift } from './entity/Gift.js';

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

  // 전체 혜택 구하기
  const allBenefitList = calAllBenefitList(dayForVisit, orderItems, menuList);

  // 나의 이벤트 혜택 보여주기
  showMsgMyEventBenefits(dayForVisit, orderItems, allBenefitList, menuList);

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
  if (commonUtils.isEmptyArray(orderInputArr)) {
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
  if (commonUtils.isEmptyArray(orderItems)) {
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
 * 전체 혜택 구하기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList 
 * @returns {Array<Benefit>}
 */
function calAllBenefitList(dayForVisit, orderItems, menuList) {
  const allBenefitList = [];

  // 일정금액 미만일 경우 혜택 부여하지 않음.
  const bfSaleTotalAmt = calBfSaleTotalAmt(orderItems, menuList);
  if (bfSaleTotalAmt < G.BENEFIT_CONDITION_AMT) {
    msgUtils.showMsg(msgUtils.getMsg("MSG_WRN_001"));
    return [];
  }

  // 크리스마스 디데이 할인 혜택 구하기
  const benefitOfDDay = calBenefitOfDDay(dayForVisit, orderItems, menuList);

  // 평일 할인 혜택 구하기
  const benefitOfWeekdaysSale = calBenefitOfWeekdaysSale(dayForVisit, orderItems, menuList);

  // 주말 할인 혜택 구하기
  const benefitOfWeekendSale = calBenefitOfWeekendSale(dayForVisit, orderItems, menuList);

  // 특별 할인 혜택 구하기
  const benefitOfSpecialSale = calBenefitOfSpecialSale(dayForVisit, orderItems, menuList);

  // 증정 이벤트 혜택 구하기
  const benefitListOfGift = calBenefitListOfGiftEvent(dayForVisit, orderItems, menuList);
  
  // 전체혜택목록에 담기
  allBenefitList.push(benefitOfDDay, benefitOfWeekdaysSale, benefitOfWeekendSale, benefitOfSpecialSale, ...benefitListOfGift);
  
  return allBenefitList;
}

/**
 * 크리스마스 디데이 할인 혜택 구하기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems 
 * @param {Array<MenuItem>} menuList 
 * @returns {Benefit}
 */
function calBenefitOfDDay(dayForVisit, orderItems, menuList) {
  const diffFromOneDay = dayForVisit - 1; // 12/1일부터의 차이
  const discountAmt = G.CHRISTMAS_D_DAY_SALE_DEFAULT + G.CHRISTMAS_D_DAY_SALE_PER_DAY * diffFromOneDay;
  const benefit = new Benefit({name: G.BENEFIT_NAME_CHRISTMAS_D_DAY_SALE, discountAmt: discountAmt});
  return benefit;
}

/**
 * 평일 할인 혜택 구하기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems 
 * @param {Array<MenuItem>} menuList 
 * @returns {Array<Benefit>}
 */
function calBenefitOfWeekdaysSale(dayForVisit, orderItems, menuList) {
  if (!isWeekdays(dayForVisit)) { // 주말이라면 혜택 없음.
    return new Benefit({name: G.BENEFIT_NAME_WEEKDAYS_SALE, discountAmt: 0});
  }

  let dessertCount = 0;
  orderItems.forEach(orderItem => {
    const type = getTypeByMenuName(orderItem.getName(), menuList);
    if (type == G.ITEM_TYPE_DESSERT) {
      dessertCount += orderItem.getCount();
    }
  });

  const discountAmt = G.WEEKDAYS_SALE_PER_DESSERT * dessertCount;
  const benefit = new Benefit({name: G.BENEFIT_NAME_WEEKDAYS_SALE, discountAmt: discountAmt});
  return benefit;
}

/**
 * 주말 할인 혜택 구하기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems 
 * @param {Array<MenuItem>} menuList 
 * @returns {Array<Benefit>}
 */
function calBenefitOfWeekendSale(dayForVisit, orderItems, menuList) {
  if (isWeekdays(dayForVisit)) { // 평일이라면 혜택 없음.
    return new Benefit({name: G.BENEFIT_NAME_WEEKEND_SALE, discountAmt: 0});
  }

  let mainCount = 0;
  orderItems.forEach(orderItem => {
    const type = getTypeByMenuName(orderItem.getName(), menuList);
    if (type == G.ITEM_TYPE_MAIN) {
      mainCount += orderItem.getCount();
    }
  });

  const discountAmt = G.WEEKEND_SALE_PER_MAIN * mainCount;
  const benefit = new Benefit({name: G.BENEFIT_NAME_WEEKEND_SALE, discountAmt: discountAmt});
  return benefit;
}


/**
 * 평일인지 확인 (금, 토)
 * 
 * @param {*} dayForVisit
 * @return {boolean} 
 */
function isWeekdays(dayForVisit) {
  const day = String(dayForVisit).padStart(2, "0");
  const dayOfWeek = commonUtils.getDayOfWeek(String(G.EVENT_YEAR) + String(G.EVENT_MONTH) + String(day));
  
  if (dayOfWeek == G.DAY_OF_WEEK_FRIDAY || dayOfWeek == G.DAY_OF_WEEK_SATURDAY) { // 주말: 금, 토
    return false;
  } else {
    return true;
  }
}

/**
 * 특별 할인 혜택 구하기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems 
 * @param {Array<MenuItem>} menuList 
 * @returns {Array<Benefit>}
 */
function calBenefitOfSpecialSale(dayForVisit, orderItems, menuList) {
  if (!isSpecialDay(dayForVisit)) { // 특별할인데이가 아니면 할인하지 않음
    return new Benefit({name: G.BENEFIT_NAME_SPECIAL_SALE, discountAmt: 0});
  }

  const discountAmt = G.SPECIAL_SALE_TOTAL;
  const benefit = new Benefit({name: G.BENEFIT_NAME_WEEKEND_SALE, discountAmt: discountAmt});
  return benefit;  
}

/**
 * 특별할인데이인지 확인
 * 
 * @param {*} dayForVisit
 * @return {boolean} 
 */
function isSpecialDay(dayForVisit) {
  if (G.SPECIAL_SALE_DAY_ARR.includes(Number(dayForVisit))) {
    return true;
  }

  return false;
}

/**
 * 증정 이벤트 혜택 구하기
 * @param {number} dayForVisit
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList 
 * @returns {Array<Benefit>}
 */
function calBenefitListOfGiftEvent(dayForVisit, orderItems, menuList) {
  let benefitList = [];

  // 총주문 금액 12만 원 이상일 때, 샴페인 1개 증정
  const bfSaleTotalAmt = calBfSaleTotalAmt(orderItems, menuList);
  if (bfSaleTotalAmt >= G.GIFT_EVENT_CONDITION_AMT) {
    const value = getCostByMenuName(G.GIFT_NAME_SHAMPAGNE, menuList)
    const gift = new Gift({name: G.GIFT_NAME_SHAMPAGNE, value: value});
    const benefit = new Benefit({name: G.BENEFIT_NAME_GIFT_EVENT, gift: gift});
    benefitList.push(benefit);
  }

  return benefitList;
}

/**
 * 이벤트 혜택 보여주기
 * @param {number} dayForVisit 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList 
 * @param {Array<Benefit>} allBenefitList
 */
function showMsgMyEventBenefits(dayForVisit, orderItems, allBenefitList, menuList) {
  let allMessage = ""; // 첫번째 출력 메시지
  let allMessage2 = ""; // 두번째 출력 메시지

  // 제목 가져오기
  allMessage += getMsgMyEventBenefitsTitle(dayForVisit) + '\n';

  // 주문 메뉴 메시지 가져오기
  allMessage += getMsgMyOrderItems(orderItems) + '\n';

  // 할인 전 총주문 금액 메시지 가져오기
  allMessage += getMsgBfSaleTotalAmt(orderItems, menuList) + '\n';

  // 증정 메뉴 메시지 가져오기
  allMessage += getMsgGiftMenu(allBenefitList) + '\n';

  // 혜택 내역 메시지 가져오기
  allMessage += getMsgBenefitList(allBenefitList) + '\n';

  // 총혜택 금액 메시지 가져오기
  allMessage2 += getMsgAllBenefitTotalValue(allBenefitList) + '\n';

  // 할인 후 예상 결제 금액 가져오기
  allMessage2 += getMsgAfSaleTotalAmt(orderItems, menuList, allBenefitList) + '\n';

  // 중간 메시지 보여주기
  msgUtils.showMsg(allMessage);
  
  // 마지막 메시지 보여주기
  msgUtils.showMsg(allMessage2);

}

/**
 * 이벤트 혜택 제목 가져오기
 * @param {*} dayForVisit 
 */
function getMsgMyEventBenefitsTitle(dayForVisit) {
  const message = msgUtils.getMsg('MSG_INF_003', G.EVENT_MONTH, dayForVisit);

  return message + '\n';
}

/**
 * 주문 메뉴 메시지 가져오기
 * @param {Array<OrderItem>} orderItems 
 */
function getMsgMyOrderItems(orderItems) {
  let message = "";
  message += `${G.TITLE_ORDER_MENU}\n`;

  orderItems.forEach((item) =>{
    message += `${item.getName()} ${item.getCount()}${G.UNIT_COUNT}\n`; 
  });

  return message;
}

/**
 * 할인 전 총주문 금액 가져오기
 * 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList
 */
function getMsgBfSaleTotalAmt(orderItems, menuList) {
  const titleMessage = `${G.TITLE_BF_SALE_TOTAL_AMT}\n`;

  const totalCost = calBfSaleTotalAmt(orderItems, menuList);
  const contentMessage = `${commonUtils.getFormatAmt(totalCost)}\n`;

  const message = titleMessage + contentMessage;
  return message;
}

/**
 * 증정 메뉴 메시지 가져오기
 * 
 * @param {Array<Benefit>} allBenefitList
 */
function getMsgGiftMenu(allBenefitList) {
  const titleMessage = `${G.TITLE_GIFT_MENU}\n`;

  let contentMessage = "";
  allBenefitList.filter(benefit => benefit.hasGift()).forEach(benefit => {
    const name = benefit.getGift().getName();
    const count = benefit.getGift().getCount();
    contentMessage += `${name} ${count}${G.UNIT_COUNT}\n`;
  });
  if (contentMessage == null || contentMessage == "") {
    contentMessage = `${G.TEXT_EMPTY}\n`;
  }

  const message = titleMessage + contentMessage;
  return message;
}

/**
 * 혜택 내역 메시지 가져오기
 * 
 * @param {Array<Benefit>} allBenefitList
 */
function getMsgBenefitList(allBenefitList) {
  const titleMessage = `${G.TITLE_BENEFIT_LIST}\n`;

  let contentMessage = "";
  allBenefitList.filter(benefit => benefit.getTotalValue() > 0) // 혜택 가치가 0원보다 큰 것에 대해서만 출력한다.
  .forEach(benefit => {
    contentMessage += `${benefit.getName()} -${commonUtils.getFormatAmt(benefit.getTotalValue())}\n`; // "[내용]: -[할인금액]"
  });
  if (contentMessage == null || contentMessage == "") {
    contentMessage = `${G.TEXT_EMPTY}\n`;
  }

  const message = titleMessage + contentMessage;
  return message;  
}

/**
 * 총혜택 금액 메시지 가져오기
 * 
 * @param {Array<Benefit>} allBenefitList
 */
function getMsgAllBenefitTotalValue(allBenefitList) {
  const titleMessage = `${G.TITLE_TOTAL_BENEFIT_AMT}\n`;

  const allBenefitTotalValue = calAllBenefitTotalValue(allBenefitList);
  const contentMessage = `${commonUtils.getFormatDiscountAmt(allBenefitTotalValue)}\n`;

  const message = titleMessage + contentMessage;
  return message;
}

/**
 * 할인 후 총주문 금액 가져오기
 * 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList
 * @param {Array<Benefit>} allBenefitList
 */
function getMsgAfSaleTotalAmt(orderItems, menuList, allBenefitList) {
  const titleMessage = `${G.TITLE_AF_SALE_TOTAL_AMT}\n`;

  const bfSaleTotalAmt = calBfSaleTotalAmt(orderItems, menuList);
  const allBenefitDiscountAmt = calAllBenefitDiscountAmt(allBenefitList);
  const afSaleTotalAmt = bfSaleTotalAmt - allBenefitDiscountAmt; // 할인 전 금액 - 할인 금액
  const contentMessage = `${commonUtils.getFormatAmt(afSaleTotalAmt)}\n`;

  const message = titleMessage + contentMessage;
  return message;
}

/**
 * 총혜택 금액 계산하기
 * 
 * @param {Array<Benefit>} allBenefitList
 */
function calAllBenefitTotalValue(allBenefitList) {
  const allBenefitTotalValue = allBenefitList.reduce((acc, benefit) => {
    return acc + benefit.getTotalValue();
  }, 0);
  return allBenefitTotalValue;
}

/**
 * 총할인 금액 계산하기
 * 
 * @param {Array<Benefit>} allBenefitList
 */
function calAllBenefitDiscountAmt(allBenefitList) {
  const allBenefitTotalValue = allBenefitList.reduce((acc, benefit) => {
    return acc + benefit.getdiscountAmt();
  }, 0);
  return allBenefitTotalValue;
}

/**
 * 할인 전 총주문 금액 계산하기
 * 
 * @param {Array<OrderItem>} orderItems
 * @param {Array<MenuItem>} menuList
 */
function calBfSaleTotalAmt(orderItems, menuList) {
  const totalCost = orderItems.reduce((acc, item) => {
    const cost = getCostByMenuName(item.getName(), menuList);
    return acc + cost * item.getCount();
  }, 0);
  return totalCost;
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
