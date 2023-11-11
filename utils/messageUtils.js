import { IllegalArgumentError } from '../errors/IllegalArgumentError.js';
import env from '../env.js';
import MSG from '../constants/messageConstants.js';

const messageUtils = function() {

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
    showMsg(MSG.ERROR_PREFIX + msg);
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

    // 취소
    if(isCancel) {
      throw new Error(getMsg('MSG_INF_002'));
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
      result = '';
    }

    // param 대입
    for (var i = 0; i < strParamArgs.length; i++) {
      result = result.replace(MSG.PARAM, strParamArgs[i]);
    }

    return result;
  }


  return {
    showMsg,
    showError,
    confirmMsg,
    promptMsg,
    getMsg,
  }
}

export default messageUtils();