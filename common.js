const common = function() {
  
  /**
   * API 호출
   * 
   * @param {String} url 
   */
  async function callApi(url) {
    const res = await fetch(url);
    const resJson = await res.json();
    return resJson;
  }

  return {
    callApi
  }
}

export default common();