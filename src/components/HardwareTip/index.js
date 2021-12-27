import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from '../Modal'
import { useWalletModalToggle } from '../../contexts/Application'
import TokenLogo from '../TokenLogo'
import { Spinner, Button } from '../../theme'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import PathIcon from '../../assets/images/icon/path.svg'
import { useTranslation } from 'react-i18next'

import CheckIcon from '../../assets/images/icon/check.svg'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.875rem;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.chaliceGray};
  }
`


const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundColor};
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1.5rem 1.5rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.royalBlue : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`
const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const ContentWrapper = styled.div`
width: 100%;
  background-color: ${({ theme }) => theme.backgroundColor};
  padding: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Manrope';

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const LogoBox = styled.div`
${({ theme }) => theme.FlexC};
  width: 46px;
  height: 46px;
  object-fit: contain;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.5px rgba(0, 0, 0, 0.1);
  border-radius:100%;
  margin: auto;

  img{
    height: 24px;
    width: 24px;
    display:block;
  }
`

const ErrorTip = styled.div`
  text-align:center;
`

const ConfirmContent = styled.div`
width: 100%;
`
const TxnsInfoText = styled.div`
font-family: 'Manrope';
  font-size: 22px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: -0.0625rem;
  text-align: center;
  color: ${({ theme }) => theme.textColorBold};
  margin-top: 1rem;
`

const ConfirmText = styled.div`
width: 100%;
font-family: 'Manrope';
  font-size: 0.75rem;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #734be2;
  padding: 1.25rem 0;
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.08);
  margin-top:1.25rem
`

const ButtonConfirm = styled(Button)`
max-width: 272px;
height: 48px;
line-height:1;
margin:auto;
font-size:1rem;
`

export default function HardwareTip({
  HardwareTipOpen,
  closeHardwareTip = () => {},
  error = false,
  txnsInfo,
  onSure = () => {},
  isSelfBtn = false,
  title,
  tipInfo,
  coin
}) {

  // console.log(error)
  // setHardwareType(walletType)
  const { t } = useTranslation()
  let walletType = sessionStorage.getItem('walletType')
  return (
    <Modal
      style={{ userSelect: 'none' }}
      isOpen={HardwareTipOpen}
      minHeight={null}
      maxHeight={90}
    >
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={closeHardwareTip}>
            <CloseColor alt={'close icon'} />
          </CloseIcon>
          <HeaderRow>
            <HoverText>{
              error ? 'Error' : (title ? title : t('ConfirmTransaction'))
            }</HoverText>
          </HeaderRow>
          <ContentWrapper>
            <LogoBox>
              {
                coin ? (
                  <TokenLogo address={coin} size={'1.625rem'} ></TokenLogo>
                ) : (
                  <img src={PathIcon} alt={'logo'} />
                )
              }
            </LogoBox>
            {
              error ? (
                <ErrorTip>
                  <h3>{t("SignFailed")}</h3>
                  <p>{t("txnsTip")}</p>
                </ErrorTip>
              ) : (
                <ConfirmContent>
                  {txnsInfo ? (
                    <TxnsInfoText>{txnsInfo}</TxnsInfoText>
                  ) : (<></>)}
                  
                  <ConfirmText size={'0.75rem'}>
                    {tipInfo ? tipInfo : t("confirmHardware")}
                  </ConfirmText>
                </ConfirmContent>
              )
            }
            {isSelfBtn ? (
              <ButtonConfirm onClick={onSure}>
                <img alt='' src={CheckIcon} style={{marginRight: '15px'}} />
                {t('confirm')}
              </ButtonConfirm>
            ) : ''}
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  )
}