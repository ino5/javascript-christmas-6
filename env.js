const env = function() {
  /* 상수 */
  const MODE_DEV = "DEV";
  const MODE_PROD = "PROD";
  
  /* 환경 */
  const mode = MODE_PROD;

  function isDev() {
    return mode == MODE_DEV;
  }

  return {
    isDev
  };
}

export default env();