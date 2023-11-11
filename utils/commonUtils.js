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
   * 금액 포맷 변경
   */
  function getFormatAmt(amt) {
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  }


  return {
    callApi,
    getFormatAmt,
  }
}

export default commonUtils();