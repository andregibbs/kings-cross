const LOCAL_HOSTNAME = 'kings-cross.samsung.com';

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
    return state
  }
  if (!isLive() && !isLocal()) {
    state.staging = true
    return state
  }

  state.local = true
  return state

}

export default KXEnv()
