import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@reach/tooltip'
import { ethers } from 'ethers'
import styled from 'styled-components'

import {
  InputRow,
  Input,
  Flex,
  InputPanel,
  LabelContainer,
  LabelRow,
} from '../Styled'
import {
  Aligner,
  TokenLogoBox1,
  StyledTokenName,
  StyledDropDownBox,
  StyledDropDown,
  ErrorSpanBox,
  ErrorSpan,
  ExtraText,
  PasteStyle,
  CurrencySelect,
  Container,
  // BigScreenView,
  SmallScreenView,
  TokenModalRow,
  TokenRowLeft,
  TokenLogoBox,
  TokenSymbolGroup,
  TokenFullName,
  TokenList as TokenListBox
} from '../CurrencyInputPanel'
// import OversizedPanel from '../OversizedPanel'

import TokenLogo from '../TokenLogo'
import { Button } from '../../theme'
import Title from '../Title'
import AddressInputPanel from '../AddressInputPanel'
import ModalContent from '../Modal/ModalContent'
import Modal from '../Modal'

import {
  SubCurrencySelectBox
} from './index'

import { useWalletModalToggle } from '../../contexts/Application'

import NoCoinIcon from '../../assets/images/icon/no-coin.svg'
import Paste from '../../assets/images/icon/paste.svg'
import BirdgeIcon from '../../assets/images/icon/bridge-white.svg'
import BulbIcon from '../../assets/images/icon/bulb.svg'

// import tokenlist from './data/tokenlist'

import { amountFormatter, isAddress } from '../../utils'
import { getTokenBalance} from '../../utils/birdge/getOutBalance'
import {getDislineInfo} from '../../utils/birdge/getServerInfo'
import {formatCoin, formatDecimal, thousandBit} from '../../utils/tools'

import { useWeb3React, useSwapTokenContract } from '../../hooks'

import swapETHABI from '../../constants/abis/swapETHABI'

import {isSpecialCoin } from './module/common'
import config from '../../config'

const StyledBirdgeIcon = styled.div`
  ${({ theme }) => theme.FlexC};
  img {
    margin-right: 1rem
  }
`

function formatOutName (name, srcChainId) {
  // console.log(name)
  name = name.replace(config.namePrefix, '').replace(config.suffix, '')
  const n = name.split('-')
  name = n[0]
  if (srcChainId) {
    if (Number(srcChainId) === 1 && name.indexOf('Ethereum') === -1) {
      if (name === 'Frapped USDT') {
        name = 'Tether-ERC20'
      } else {
        name = name + '-ERC20'
      }
    } else if (Number(srcChainId) === 56) {
      name = name + '-BEP20'
    } else if (Number(srcChainId) === 128) {
      name = name + '-HECO'
    } else if (Number(srcChainId) === 250) {
      name = name + '-FRC20'
    } else if (Number(srcChainId) === 32659) {
      name = name + '(Fusion)'
    } else if (Number(srcChainId) === 1666600000) {
      name = name + '(Harmony)'
    } else if (Number(srcChainId) === 1285) {
      name = name + '(Moonriver)'
    }
  }
  // console.log(name)
  return name
}

export default function SpecialWithdraw() {
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  // const { chainId } = useWeb3React()
  // const account = '0x0ACAaBa122781945b004C61BB856e859E4894c79'
  const toggleWalletModal = useWalletModalToggle()

  const walletType = sessionStorage.getItem('walletType')

  const [selectToken, setSelectToken] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const [value, setValue] = useState()
  const [outValue, setOutValue] = useState()
  const [balance, setBalance] = useState()
  const [recipient, setRecipient] = useState({
    address: '',
    name: ''
  })
  const [recipientError, setRecipientError] = useState()
  const [modelView, setModelView] = useState(false)
  const [tokenlist, setTokenlist] = useState({})


  const TokenInfo = useMemo(() => {
    if (tokenlist[selectToken]) return tokenlist[selectToken]
    return ''
  }, [tokenlist, selectToken])

  const recipientCount = useMemo(() => {
    return Date.now() + selectToken
  }, [selectToken])

  const tokenETHContract = useSwapTokenContract(selectToken, swapETHABI)

  const isDisabled = useMemo(() => {
    if (
      TokenInfo
      && Number(value) < Number(TokenInfo.redeemMaxNum)
      && Number(value) > Number(TokenInfo.redeemMinNum)
      && Number(value) < Number(balance)
      && recipient.address
    ) {
      return false
    } else {
      return true
    }
  }, [TokenInfo, value, recipient, balance])

  useEffect(() => {
    if (account && chainId && selectToken) {
      // console.log(selectToken)
      getTokenBalance(chainId, selectToken, account, 1).then(res => {
        // console.log(res)
        // console.log(TokenInfo)
        // const val = ethers.utils.parseUnits(res.toString(), TokenInfo.decimals)
        const val = ethers.utils.bigNumberify(res)
        // console.log(val)
        // console.log(amountFormatter(val, TokenInfo.decimals, Math.min(10, TokenInfo.decimals)))
        setBalance(amountFormatter(val, TokenInfo.decimals, Math.min(10, TokenInfo.decimals)))
      })
    } else {
      setBalance('')
    }
  }, [account, chainId, selectToken, TokenInfo])

  useEffect(() => {
    getDislineInfo(account, chainId).then(res => {
      console.log(res)
      if (res.msg === 'Success') {
        setTokenlist(res.info)
        if (!selectToken) {
          for (const token in res.info) {
            if (!isAddress(token)) continue
            setSelectToken(token)
            break
          }
        }
      } else {
        setTokenlist({})
        setSelectToken('')
      }
    })
  }, [account, chainId, selectToken])

  function sendTxns () {
    const node = TokenInfo.srcChain
    if (
      !recipient.address
      || (isSpecialCoin(TokenInfo.symbol) && !isBTCAddress(recipient.address, TokenInfo.symbol))
      || (node === 'TRX' && !isTRXAddress(recipient.address))
    ) {
      alert('Illegal address!')
      return
    }
    if (Number(value) > Number(balance)) {
      alert('Insufficient Balance!')
      return
    }
    let amountVal = ethers.utils.parseUnits(value.toString(), TokenInfo.decimals)
    // if (amountVal.gt(balance)) {
    //   amountVal = balance
    // }
    let address = recipient.address
    const formatAddress = node === 'TRX' ? toHexAddress(address) : address
    let token = selectToken
    // console.log(formatAddress)
    if (config.supportWallet.includes(walletType)) {
      let web3Contract = getWeb3ConTract(swapETHABI, token)
      if (isSpecialCoin(TokenInfo.symbol)) {
        web3Contract = getWeb3ConTract(swapBTCABI, token)
      }
      let data = web3Contract.methods.Swapout(amountVal, formatAddress).encodeABI()
      getWeb3BaseInfo(token, data, account).then(res => {
        if (res.msg === 'Success') {
          alert('Success')
        } else {
          alert(res.error.toString())
        }
      })
      return
    }

    if (isSpecialCoin(TokenInfo.symbol) === 0) {
      tokenETHContract.Swapout(amountVal, formatAddress).then(res => {
        alert('Success')
      }).catch(err => {
        alert(err.toString())
      })
    } else {
      tokenContract.Swapout(amountVal, formatAddress).then(res => {
        alert('Success')
      }).catch(err => {
        alert(err.toString())
      })
    }
  }
  return (
    <>
      <Modal  isOpen={modelView} maxHeight={800}>
        <ModalContent onClose={() => {setModelView(false)}}>
          <TokenListBox style={{marginTop: '40px'}}>
            {
              Object.keys(tokenlist).map(tokenEntryKey => {
                if (!isAddress(tokenEntryKey)) return ''
                return (
                  <TokenModalRow key={tokenEntryKey} onClick={() => {
                    setSelectToken(tokenEntryKey)
                    setModelView(false)
                  }}>
                    <TokenRowLeft>
                      <TokenLogoBox style={ {'border': '0.0625rem solid rgba(0, 0, 0, 0.1)'}}>
                        <TokenLogo address={tokenlist[tokenEntryKey].symbol} size={'2rem'} />
                      </TokenLogoBox>
                      <TokenSymbolGroup>
                        <TokenFullName> {tokenlist[tokenEntryKey].name}</TokenFullName>
                      </TokenSymbolGroup>
                    </TokenRowLeft>
                  </TokenModalRow>
                )
              })
            }
          </TokenListBox>
        </ModalContent>
      </Modal>
      <Title
        title={t('redeem')}
        tabList={[
          {
            name: t('deposit1'),
            onTabClick: name => {
            },
            isNavLink: 1,
            path: '/bridge',
            iconUrl: require('../../assets/images/icon/deposit.svg'),
            iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
          },
          {
            name: t('redeem'),
            onTabClick: name => {
            },
            isNavLink: 1,
            path: '/bridge',
            iconUrl: require('../../assets/images/icon/withdraw.svg'),
            iconActiveUrl: require('../../assets/images/icon/withdraw-purple.svg')
          },
          {
            name: t('disline'),
            onTabClick: () => {
            },
            isNavLink: 1,
            path: '/specwithdraw',
            iconUrl: require('../../assets/images/icon/withdraw.svg'),
            iconActiveUrl: require('../../assets/images/icon/withdraw-purple.svg')
          }
        ]}
        currentTab={2}
      ></Title>
      <InputPanel error={!!errorMessage}>
        <Container>
          <LabelRow>
            <LabelContainer>
              <span>{t('redeem')}</span>
            </LabelContainer>
            <SmallScreenView>{balance}</SmallScreenView>
          </LabelRow>
          
          <InputRow>
            <Input
              type="number"
              min="0"
              step="0.000000000000000001"
              error={!!errorMessage}
              placeholder="0.0"
              onChange={e => {
                if (TokenInfo) {
                  const dec = TokenInfo.decimals
                  let val = e.target.value
                  let iValue = formatDecimal(val, dec)
                  // console.log(iValue)
                  let inputVal = iValue && Number(iValue) ? ethers.utils.parseUnits(iValue.toString(), dec) : ethers.utils.bigNumberify(0)
                  let _fee = inputVal.mul(ethers.utils.parseUnits(TokenInfo.fee.toString(), 18)).div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
                  let _minFee = ethers.utils.parseUnits(TokenInfo.minFee.toString(), dec)
                  let _maxFee = ethers.utils.parseUnits(TokenInfo.maxFee.toString(), dec)
                  if (_fee.isZero()) {
                    // inputVal = inputVal
                  } else {
                    if (_fee.lt(_minFee)) {
                      _fee = _minFee
                    } else if (_fee.gt(_maxFee)) {
                      _fee = _maxFee
                    }
                    inputVal = inputVal.sub(_fee)
                  }
                  // console.log(inputVal)
                  if ((inputVal || inputVal === 0) && val !== '') {
                    inputVal = amountFormatter(inputVal, dec, Math.min(10, dec))
                  } else {
                    inputVal = ''
                  }
                  setValue(iValue)
                  setOutValue(inputVal)
                } else {
                  setValue('')
                  setOutValue('')
                }
              }}
              onKeyPress={e => {
                const charCode = e.which ? e.which : e.keyCode

                // Prevent 'minus' character
                if (charCode === 45) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              value={isNaN(value) ? '' : value}
            />
            <CurrencySelect
              selected={!!selectToken}
              onClick={() => {
                setModelView(true)
              }}
            >
              <Aligner>
                {
                  <>
                    {selectToken ? <TokenLogoBox1><TokenLogo address={TokenInfo.logo ? TokenInfo.logo : ''} size={'1.625rem'} /></TokenLogoBox1> : (
                      <TokenLogoBox1>
                        <img alt={''} src={NoCoinIcon} />
                      </TokenLogoBox1>
                    )}
                    <StyledTokenName>
                      {
                        TokenInfo.symbol ? (
                          <>
                            <h3>{TokenInfo.symbol}</h3>
                            <p>{formatOutName(TokenInfo.name, chainId)}</p>
                          </>
                        ) : (
                          t('selectToken')
                        ) 
                      }
                    </StyledTokenName>
                  </>
                }
                <StyledDropDownBox><StyledDropDown selected={!!selectToken} /></StyledDropDownBox>
              </Aligner>
            </CurrencySelect>
            <ErrorSpanBox>
              <ErrorSpan
                data-tip={'Enter max'}
                error={!!errorMessage}
                onClick={() => {
                  extraTextClickHander()
                }}
              >
                <Tooltip
                  label={t('enterMax')}
                  style={{
                    background: 'hsla(0, 0%, 0%, 0.75)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '0.5em 1em',
                    marginTop: '-64px'
                  }}
                >
                  <ExtraText>
                    {balance ? (
                      <>
                        <h5>{t('balances')}:</h5>
                        <p>{balance}</p>
                      </>
                    ) : (
                      <p>{balance}</p>
                    )}
                    <PasteStyle>
                      <img src={Paste} alt={''} />
                    </PasteStyle>
                  </ExtraText>
                </Tooltip>
              </ErrorSpan>
            </ErrorSpanBox>
          </InputRow>
        </Container>
      </InputPanel>
      {/* <OversizedPanel>
        <DownArrowBackground>
        </DownArrowBackground>
      </OversizedPanel> */}
      <InputPanel error={!!errorMessage} style={{marginTop:'20px'}}>
        <Container>
          <LabelRow>
            <LabelContainer>
              <span>{t('redeem')}</span>
            </LabelContainer>
            <SmallScreenView>{balance}</SmallScreenView>
          </LabelRow>
          
          <InputRow>
            <Input
              type="number"
              min="0"
              step="0.000000000000000001"
              error={!!errorMessage}
              placeholder="0.0"
              value={isNaN(outValue) ? '' : outValue}
              onChange={() =>{}}
            />
            <CurrencySelect
              selected={!!selectToken}
              onClick={() => {
                setModelView(true)
              }}
            >
              <Aligner>
                {
                  <>
                    {selectToken ? <TokenLogoBox1><TokenLogo address={TokenInfo.logo ? TokenInfo.logo : ''} size={'1.625rem'} /></TokenLogoBox1> : (
                      <TokenLogoBox1>
                        <img alt={''} src={NoCoinIcon} />
                      </TokenLogoBox1>
                    )}
                    <StyledTokenName>
                      {
                        TokenInfo.symbol ? (
                          <>
                            <h3>{TokenInfo.symbol}</h3>
                            <p>{formatOutName(TokenInfo.name, TokenInfo.srcChain)}</p>
                          </>
                        ) : (
                          t('selectToken')
                        ) 
                      }
                    </StyledTokenName>
                  </>
                }
                <StyledDropDownBox><StyledDropDown selected={!!selectToken} /></StyledDropDownBox>
              </Aligner>
            </CurrencySelect>
            <ErrorSpanBox>
              <ErrorSpan>
                <ExtraText>
                  {/* {balance ? (
                    <>
                      <h5>{t('balances')}:</h5>
                      <p>{balance}</p>
                    </>
                  ) : (
                    <p>{balance}</p>
                  )} */}
                  <p>-</p>
                  <PasteStyle>
                    <img src={Paste} alt={''} />
                  </PasteStyle>
                </ExtraText>
              </ErrorSpan>
            </ErrorSpanBox>
          </InputRow>
        </Container>
      </InputPanel>

      <AddressInputPanel title={t('recipient') + ' ' + TokenInfo.symbol  + ' ' + t('address')} onChange={setRecipient} onError={setRecipientError} initialInput={recipient} isValid={true} disabled={false} changeCount={recipientCount}/>

      <SubCurrencySelectBox>
        <dl className='list'>
          <dt>
            <img src={BulbIcon} alt='' />
            {t('Reminder')}:
          </dt>
          <dd><i></i>{t('redeemTip1', {
            minFee: TokenInfo.minFee,
            coin: formatCoin(TokenInfo.symbol),
            maxFee: TokenInfo.maxFee,
            fee: TokenInfo.fee * 100
          })}</dd>
          <dd><i></i>{t('redeemTip2')} {thousandBit(TokenInfo.redeemMinNum, 'no')} {formatCoin(TokenInfo.symbol)}</dd>
          <dd><i></i>{t('redeemTip3')} {thousandBit(TokenInfo.redeemMaxNum, 'no')} {formatCoin(TokenInfo.symbol)}</dd>
          <dd><i></i>{t('redeemTip4')}</dd>
          <dd><i></i>{t('redeemTip5', {
            redeemBigValMoreTime: thousandBit(TokenInfo.redeemBigValMoreTime, 'no'),
            coin: formatCoin(TokenInfo.symbol),
          })}</dd>
        </dl>
      </SubCurrencySelectBox>

      <Flex>
        {
          account ? (
            <Button
              disabled={isDisabled}
              onClick={() => {
                sendTxns()
              }}
              warning={account}
              loggedOut={!account}
            >
              <StyledBirdgeIcon>
                <img src={BirdgeIcon} alt={''} />
                {t('redeem')}
              </StyledBirdgeIcon>
            </Button>
          ) : (
            <Button onClick={toggleWalletModal} >
              {t('connectToWallet')}
            </Button>
          )
        }
      </Flex>
    </>
  )
}