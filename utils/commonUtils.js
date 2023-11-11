import G from '../constants/globalConstants.js';

const commonUtils = function() {

  /**
   * API 호출
   * @param {*} url 
   * @returns resJson
   */
  async function callApi(url) {
    const res = await fetch(url);
    const resJson = await res.json();
    return resJson;
  }

  /**
   * 금액 포맷 반환
   */
  function getFormatAmt(amt) {
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + G.UNIT_AMT;
  }

  /**
   * 할인금액 포맷 반환
   */
  function getFormatDiscountAmt(amt) {
    let sign = '-';
    if (Number(amt) == 0) { // 0원일 경우에는 부호 붙이지 않음.
      sign = '';
    }
    return sign + getFormatAmt(amt);
  }

  /**
   * 객체 깊은 복사
   * 
   * @param {*} paramObj 
   */
  function deepCopyObj(paramObj) {
    return JSON.parse(JSON.stringify(paramObj));
  }

  /**
   * 배열이 비었거나 null인지 확인
   * 
   * @param {Array} param
   */
  function isEmptyArray(param) {
    try {
      if (param != null && Number(param.length) > 0) {
        return false;
      }

    } catch(e) {
      return true;
    }

    return true;
  }

  /**
   * 요일 확인
   * 
   * @param {string} yyyyMMdd 
   * @returns 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
   */
  function getDayOfWeek(yyyyMMdd) {
    const yyyy = String(yyyyMMdd).substring(0, 4);
    const MM = String(yyyyMMdd).substring(4, 6);
    const dd = String(yyyyMMdd).substring(6, 8);
    const dayOfWeek = new Date(yyyy, MM - 1, dd).getDay(); 
    return dayOfWeek;
  }

  /**
   * 배열 내 null 제거
   * 
   * @param {Array} param 
   * @returns 
   */
  function removeNullInArray(param) {
    return param.filter(item => item != null);
  }

  return {
    callApi,
    getFormatAmt,
    getFormatDiscountAmt,
    deepCopyObj,
    isEmptyArray,
    getDayOfWeek,
    removeNullInArray,
  }
}

export default commonUtils();