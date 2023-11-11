/* 상수 */
const MODE_DEV = "DEV";
const MODE_PROD = "PROD";

const env = function() {
  /* 환경 */
  const mode = MODE_DEV;

  /**
   * 개발환경인지 확인
   * 
   * @returns 
   */
  function isDev() {
    return mode == MODE_DEV;
  }

  return {
    isDev
  };
}

export default env();