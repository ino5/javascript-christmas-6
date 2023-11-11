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


  return {
    callApi,
  }
}

export default commonUtils();