const LOCAL_HOSTNAME = 'kings-cross.samsung.com'; // move to .env if diff
const LIVE_HOSTNAME = 'www.samsung.com';
const QA_HOSTNAME = 'p6-qa.samsung.com';

function KXEnv() {

  function isLocal() {
    return window.location.hostname === LOCAL_HOSTNAME;
  }

  function isLive() {
    return window.location.hostname === "www.samsung.com"
  }

  let state = {
    live: false,
    staging: false,
    local: false,
  }

  if (isLive()) {
    state.live = true
    state.hostname = LIVE_HOSTNAME
    return state
  }
  if (!isLive() && !isLocal()) {
    state.staging = true
    state.hostname = QA_HOSTNAME
    return state
  }

  state.local = true
  state.hostname = LOCAL_HOSTNAME
  return state

}

export default KXEnv()
