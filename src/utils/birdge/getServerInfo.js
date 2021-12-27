import axios from 'axios'
import config from '../../config'

import {getLocalConfig, setLocalConfig} from '../tools'

const SERVER_BRIDGE_CONFIG = 'SERVER_BRIDGE_CONFIG'
const SERVER_BRIDGE_REGISTER = 'SERVER_BRIDGE_REGISTER'


export function removeLocalConfig (account, token, chainId) {
  let lstr = sessionStorage.getItem(SERVER_BRIDGE_CONFIG)
  if (lstr) {
    let lboj = JSON.parse(lstr)
    lboj[chainId][account][token] = undefined
    sessionStorage.setItem(SERVER_BRIDGE_CONFIG, JSON.stringify(lboj))
  }
}


export function getRegisterInfo (account, token, chainID, version, coin) {
  let lrInfo = localStorage.getItem(SERVER_BRIDGE_REGISTER)
  if (version === 'V2'
    && coin.indexOf('BTC') === -1
    && coin.indexOf('LTC') === -1
    && coin.indexOf('BLOCK') === -1
    && coin.indexOf('COLX') === -1
  ) {
    token = 'V2'
  }
  if (!lrInfo) {
    return false
  } else {
    let lrObj = JSON.parse(lrInfo)
    if (!lrObj[chainID] || !lrObj[chainID][account] || !lrObj[chainID][account][token]) {
      return false
    } else if ((Date.now() - lrObj[chainID][account][token].timestamp) > (1000 * 60 * 60 * 24 * 1)) {
      return false
    } else if (lrObj[chainID][account][token].timestamp < config.localDataDeadline) { // 在某个时间之前的数据无效
      return false
    }
    return lrObj[chainID][account][token]
  }
}

function setRegisterInfo (account, token, localInfo, chainID, version, coin) {
  let lstr = localStorage.getItem(SERVER_BRIDGE_REGISTER)
  let lboj = {}
  if (version === 'V2'
    && coin.indexOf('BTC') === -1
    && coin.indexOf('LTC') === -1
    && coin.indexOf('BLOCK') === -1
    && coin.indexOf('COLX') === -1
  ) {
    token = 'V2'
  }
  if (!lstr) {
    lboj[chainID] = {}
    lboj[chainID][account] = {}
    lboj[chainID][account][token] = {
      ...localInfo,
      timestamp: Date.now()
    }
  } else {
    lboj = JSON.parse(lstr)
    if (!lboj[chainID]) {
      lboj[chainID] = {}
      lboj[chainID][account] = {}
      lboj[chainID][account][token] = {
        ...localInfo,
        timestamp: Date.now()
      }
    } else if (!lboj[chainID][account]) {
      lboj[chainID] = {}
      lboj[chainID][account] = {}
      lboj[chainID][account][token] = {
        ...localInfo,
        timestamp: Date.now()
      }
    } else {
      lboj[chainID][account][token] = {
        ...localInfo,
        timestamp: Date.now()
      }
    }
  }
  localStorage.setItem(SERVER_BRIDGE_REGISTER, JSON.stringify(lboj))
}

export function removeRegisterInfo (account, token, chainID) {
  let lstr = localStorage.getItem(SERVER_BRIDGE_REGISTER)
  if (lstr) {
    let lboj = JSON.parse(lstr)
    lboj[chainID][account][token] = undefined
    localStorage.setItem(SERVER_BRIDGE_REGISTER, JSON.stringify(lboj))
  }
}

function setLocalinfo (account, res, chainID, version, coin, pairid, localtype) {
  const dObj = res.SrcToken, // 充值信息
      rObj = res.DestToken // 提现信息
  const token = rObj.DelegateToken ? rObj.DelegateToken.toLowerCase() : (rObj.ContractAddress ? rObj.ContractAddress.toLowerCase() : '')
  // console.log(token)
  const bridgeData = {
    depositAddress: dObj.DepositAddress,
    PlusGasPricePercentage: dObj.PlusGasPricePercentage,
    isDeposit: !dObj.DisableSwap ? 1 : 0,
    depositMaxNum: dObj.MaximumSwap,
    depositMinNum: dObj.MinimumSwap,
    depositBigValMoreTime: dObj.BigValueThreshold,
    dMaxFee: dObj.MaximumSwapFee,
    dMinFee: dObj.MinimumSwapFee,
    dFee: dObj.SwapFeeRate,
    outnetToken: dObj.ContractAddress,
    dcrmAddress: dObj.DcrmAddress,
    isRedeem: !rObj.DisableSwap ? 1 : 0,
    redeemMaxNum: rObj.MaximumSwap,
    redeemMinNum: rObj.MinimumSwap,
    maxFee: rObj.MaximumSwapFee,
    minFee: rObj.MinimumSwapFee,
    fee: rObj.SwapFeeRate,
    redeemBigValMoreTime: rObj.BigValueThreshold,
    token: token,
    pairid: pairid,
    p2pAddress: getRegisterInfo(account, token, chainID, version, coin).p2pAddress
  }
  setLocalConfig(account, token, bridgeData, chainID, localtype)
}

function getServerData (account, chainID, version, coin) {
  return new Promise(resolve => {
    // let url = config.serverInfoUrl['V1'] + '/serverInfo/' + chainID
    // if (version === 'V2') {
    //   url = config.serverInfoUrl['V2'] + '/serverInfo/' + chainID
    // }
    let url = config.serverInfoUrl['V1'] + '/serverInfoFull/' + chainID
    if (version === 'V2') {
      url = config.serverInfoUrl['V2'] + '/serverInfoFull/' + chainID
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    axios.get(url).then(res => {
      if(res.status === 200){
        data = {
          msg: 'Success',
          info: res.data.result
        }
        let serverData = res.data
        for (let obj in serverData) {
          setLocalinfo(account, serverData[obj], chainID, version, coin, obj, SERVER_BRIDGE_CONFIG)
        }
      }
      resolve(data)
    }).catch(err => {
      console.log(err)
      data.error = err
      resolve(data)
    })
  })
}

export function RegisterAddress(account, token, coin, chainID, version) {
  return new Promise(resolve => {
    let data = {
      msg: 'Error',
      info: ''
    }
    let lData = getRegisterInfo (account, token, chainID, version, coin)
    // console.log(lData)
    if (lData && lData.isRegister) {
      // console.log(lData)
      // resolve(lData)
      resolve({
        msg: 'Success',
        info: ''
      })
    } else {
      
      let url = config.serverInfoUrl['V1'] + '/register/' + account + '/' + chainID + '/' + coin
      if (version === 'V2') {
        url = config.serverInfoUrl['V2'] + '/register/' + account + '/' + chainID + '/' + coin
      }
      axios.get(url).then(res => {
        let rsData = res.data
        if ( 
          (rsData.msg === 'Success' && rsData.info && rsData.info.P2shAddress)
          || (rsData.error && rsData.error.indexOf('mgoError: Item is duplicate') !== -1)
          || (rsData.msg === 'Success' && rsData.info === 'Success')
        ) {
          setRegisterInfo(account, token, {
            isRegister: true,
            p2pAddress: rsData.info && rsData.info.P2shAddress
          }, chainID, version, coin)
          resolve({
            msg: 'Success',
            info: ''
          })
        } else {
          data.error = 'Register error!'
          resolve(data)
        }
      }).catch(err => {
        console.log(err)
        data.error = err
        resolve(data)
      })
    }
  })
}

let getInfoObj = {}
// let count = 0
// let count1 = 0
export function getServerInfo (account, token, coin, chainID, version) {
  getInfoObj = {account, token, coin}
  // count ++
  return new Promise(resolve => {
    if (!account) {
      resolve('')
    } else {
      let lData = getLocalConfig(getInfoObj.account, getInfoObj.token, chainID, SERVER_BRIDGE_CONFIG)
      if (lData) {
        resolve(lData)
      } else {
        getServerData(account, chainID, version, coin).then(result => {
          let lData1 = getLocalConfig(getInfoObj.account, getInfoObj.token, chainID, SERVER_BRIDGE_CONFIG)
          if (lData1) {
            resolve(lData1)
          } else {
            resolve({
              msg: 'Null'
            })
          }
        })
      }
    }
  })
}

let getIDislineObj = {}
const DISLINE_BRIDGE_CONFIG = 'DISLINE_BRIDGE_CONFIG'
function getDislineData (account, chainID) {
  return new Promise(resolve => {
    let url = config.serverInfoUrl['V2'] + '/disline/' + chainID
    let data = {
      msg: 'Error',
      info: ''
    }
    axios.get(url).then(res => {
      if(res.status === 200){
        data = {
          msg: 'Success',
          info: res.data.result
        }
        let serverData = res.data
        const serverList = {}
        for (const pairid in serverData) {
          const obj = serverData[pairid]
          const rObj = obj.DestToken // 提现信息
          const token = rObj.DelegateToken ? rObj.DelegateToken.toLowerCase() : (rObj.ContractAddress ? rObj.ContractAddress.toLowerCase() : '')
          // console.log(token)
          serverList[token] = {
            name: rObj.Name,
            symbol: rObj.Symbol,
            decimals: rObj.Decimals,
            logo: rObj.Symbol,
            redeemMaxNum: rObj.MaximumSwap,
            redeemMinNum: rObj.MinimumSwap,
            maxFee: rObj.MaximumSwapFee,
            minFee: rObj.MinimumSwapFee,
            fee: rObj.SwapFeeRate,
            srcChain: obj.srcChainID,
            redeemBigValMoreTime: rObj.BigValueThreshold,
          }
        }
        setLocalConfig(account, DISLINE_BRIDGE_CONFIG, serverList, chainID, DISLINE_BRIDGE_CONFIG)
      }
      resolve(data)
    }).catch(err => {
      console.log(err)
      data.error = err
      resolve(data)
    })
  })
}

export function getDislineInfo (account, chainID) {
  getIDislineObj = {account}
  // count ++
  return new Promise(resolve => {
    if (!account) {
      resolve('')
    } else {
      const lData = getLocalConfig(getIDislineObj.account, DISLINE_BRIDGE_CONFIG, chainID, DISLINE_BRIDGE_CONFIG)
      if (lData) {
        resolve(lData)
      } else {
        getDislineData(account, chainID).then(result => {
          const lData1 = getLocalConfig(getIDislineObj.account, DISLINE_BRIDGE_CONFIG, chainID, DISLINE_BRIDGE_CONFIG)
          if (lData1) {
            resolve(lData1)
          } else {
            resolve({
              msg: 'Null'
            })
          }
        })
      }
    }
  })
}