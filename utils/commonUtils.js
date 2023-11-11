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
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  }

  /**
   * 할인금액 포맷 반환
   */
  function getFormatDiscountAmt(amt) {
    return '-' + amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
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

  return {
    callApi,
    getFormatAmt,
    getFormatDiscountAmt,
    deepCopyObj,
    isEmptyArray,
  }
}

export default commonUtils();