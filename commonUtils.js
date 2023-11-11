import MSG from './messageConstant.js';

const commonUtils = function() {
  
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

  /**
   * 메시지 출력
   * 
   * @param {String} msg 
   */
  function showMsg(msg) {
    alert(msg);
  }

  /**
   * 에러 출력
   * 
   * @param {String} msg 
   */
  function showError(msg) {
    showMsg('[ERROR]' + msg);
  }

  /**
   * confirm 출력
   * 
   * @param {String} msg 
   * @returns {boolean} 응답결과
   */
  function confirmMsg(msg) {
    const result = confirm(msg);
    return result;
  }

  /**
   * prompt 출력
   * 
   * @param {String} msg 
   * @returns {String} 응답결과
   */
  function promptMsg(msg) {
    const result = prompt(msg);
    const isCancel = result == null;

    // 취소 시 다시 메시지 출력 
    if(isCancel) {
      if (env.isDev()) { // 개발모드일 경우 throw
        throw Error("prompt 취소");

      }
      promptMsg(msg);
    }
    
    return result;
  }

  /**
   * 메시지 가져오기
   * 
   * @param {String} msg 
   * @returns {String} result
   */  
  function getMsg(msgCode, ...strParamArgs) {
    let result = MSG[msgCode];
    
    // 유효한 코드가 아니라면 빈값 출력
    if (result == null) {
      result = "";
    }

    // param 대입
    for (var i = 0; i < strParamArgs.length; i++) {
      result.replace(MSG.MSG_PARAM, strParamArgs[i]);
    }

    return result;
  }


  return {
    callApi,
    showMsg,
    showError,
    confirmMsg,
    promptMsg,
    getMsg,
  }
}

export default commonUtils();