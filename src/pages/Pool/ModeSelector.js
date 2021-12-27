import React, { useState, useCallback } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { createBrowserHistory } from 'history'

import OversizedPanel from '../../components/OversizedPanel'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'

import Modal from '../../components/Modal'
import { useBodyKeyDown } from '../../hooks'

import { lighten } from 'polished'

import { TitleBox } from '../../theme'

import Title from '../../components/Title'

// import AddTwoIcon from '../../assets/images/icon/add-2.svg'
// import AddTwoActiveIcon from '../../assets/images/icon/add-2-purpl.svg'
// import RemoveIcon from '../../assets/images/icon/remove.svg'
// import RemoveActiveIcon from '../../assets/images/icon/remove-purpl.svg'
// import CreateIcon from '../../assets/images/icon/create-exchange.svg'
// import CreateActiveIcon from '../../assets/images/icon/create-exchange-purpl.svg'

const poolTabOrder = [
  {
    path: '/add-liquidity',
    textKey: 'addLiquidity',
    icon: require('../../assets/images/icon/add-2.svg'),
    iconActive: require('../../assets/images/icon/add-2-purpl.svg'),
    regex: /\/add-liquidity/
  },
  {
    path: '/remove-liquidity',
    textKey: 'removeLiquidity',
    icon: require('../../assets/images/icon/remove.svg'),
    iconActive: require('../../assets/images/icon/remove-purpl.svg'),
    regex: /\/remove-liquidity/
  },
  {
    path: '/create-exchange',
    textKey: 'createExchange',
    icon: require('../../assets/images/icon/create-exchange.svg'),
    iconActive: require('../../assets/images/icon/create-exchange-purpl.svg'),
    regex: /\/create-exchange.*/
  }
]

const LiquidityContainer = styled.div`
  ${({ theme }) => theme.FlexBC};
  align-items: center;
  font-size: 1rem;
  font-family: 'Manrope';
  color: ${({ theme }) => theme.royalBlue};
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;

  :hover {
    color: ${({ theme }) => lighten(0.1, theme.royalBlue)};
  }

  img {
    height: 0.75rem;
    width: 0.75rem;
  }
`

const LiquidityLabel = styled.span`
  flex: 1 0 auto;
`

const activeClassName = 'MODE'



const PoolModal = styled.div`
  background-color: ${({ theme }) => theme.inputBackground};
  width: 100%;
  height: 100%;
  padding: 2rem 0 2rem 0;
`

const WrappedDropdown = ({ isError, highSlippageWarning, ...rest }) => <Dropdown {...rest} />
const ColoredDropdown = styled(WrappedDropdown)`
  path {
    stroke: ${({ theme }) => theme.royalBlue};
  }
`

const TabLinkBox = styled.ul`
  ${({theme}) => theme.FlexSC}
  list-style: none;
  margin: 0;
  padding:0;
`
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.FlexC}
  height: 38px;
  font-family: 'Manrope';
  font-size: 0.75rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: ${({ theme }) => theme.tabColor};
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.04);
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.04);
  border-left: 0.0625rem solid rgba(0, 0, 0, 0.04);
  cursor:pointer;
  text-decoration: none;
  padding: 0 0.625rem;
  background: ${({ theme }) => theme.tabBg};
  white-space:nowrap;

  .icon {
    ${({ theme }) => theme.FlexC}
    width: 28px;
    height: 28px;
    background:#f5f5f5;
    border-radius:100%;
    margin-right:0.625rem;
  }
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    &.active {
      border: 0.0625rem solid ${({ theme }) => theme.tabBdColor};
    }
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-right: 0.0625rem solid rgba(0, 0, 0, 0.04);
    &.active {
      border: 0.0625rem solid ${({ theme }) => theme.tabBdColor};
    }
  }

  &.${activeClassName} {
    background: ${({ theme }) => theme.tabActiveBg};
    border: 0.0625rem solid ${({ theme }) => theme.tabBdColor};
    color: ${({ theme }) => theme.tabActiveColor};
    font-weight: bold;
    .icon {
      background: #734be2;
    }
  }
  @media screen and (max-width: 960px) {
    .icon {
      display:none;
    }
  }
`
const TitleBoxPool = styled(TitleBox)`
margin-bottom: 0;
`
// const StyledNavLink = styled(NavLink).attrs({
//   activeClassName
// })`
//   ${({ theme }) => theme.flexRowNoWrap}
//   padding: 1rem;
//   margin-left: 1rem;
//   margin-right: 1rem;
//   font-size: 1rem;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.doveGray};
//   font-size: 1rem;

//   &.${activeClassName} {
//     background-color: ${({ theme }) => theme.inputBackground};
//     border-radius: 3rem;
//     border: 0.0625rem solid ${({ theme }) => theme.mercuryGray};
//     font-weight: 500;
//     color: ${({ theme }) => theme.royalBlue};
//   }
// `

function ModeSelector({ location: { pathname }, history }) {
  const { t } = useTranslation()

  // const [modalIsOpen, setModalIsOpen] = useState(false)

  // const activeTabKey = poolTabOrder[poolTabOrder.findIndex(({ regex }) => pathname.match(regex))].textKey

  // const navigate = useCallback(
  //   direction => {
  //     const tabIndex = poolTabOrder.findIndex(({ regex }) => pathname.match(regex))
  //     history.push(poolTabOrder[(tabIndex + poolTabOrder.length + direction) % poolTabOrder.length].path)
  //   },
  //   [pathname, history]
  // )
  // const navigateRight = useCallback(() => {
  //   navigate(1)
  // }, [navigate])
  // const navigateLeft = useCallback(() => {
  //   navigate(-1)
  // }, [navigate])

  // useBodyKeyDown('ArrowDown', navigateRight, modalIsOpen)
  // useBodyKeyDown('ArrowUp', navigateLeft, modalIsOpen)


  return (
    <Title
      title={t('addLiquidity')}
      isNavLink={true}
      tabList={[
        {
          name: t('addLiquidity'),
          path: '/add-liquidity',
          regex: /\/add-liquidity/,
          iconUrl: require('../../assets/images/icon/add-2.svg'),
          iconActiveUrl: require('../../assets/images/icon/add-2-purpl.svg')
        },
        {
          name: t('removeLiquidity'),
          path: '/remove-liquidity',
          regex: /\/remove-liquidity/,
          iconUrl: require('../../assets/images/icon/remove.svg'),
          iconActiveUrl: require('../../assets/images/icon/remove-purpl.svg')
        },
        {
          name: t('createExchange'),
          path: '/create-exchange',
          regex: /\/create-exchange.*/,
          iconUrl: require('../../assets/images/icon/create-exchange.svg'),
          iconActiveUrl: require('../../assets/images/icon/create-exchange-purpl.svg')
        }
      ]}
    ></Title>
    // <LiquidityContainer
    //   // onClick={() => {
    //   //   setModalIsOpen(true)
    //   // }}
    // >
    //   {/* <LiquidityLabel>{t(activeTabKey)}</LiquidityLabel> */}
    //   {/* <TitleBoxPool>{t(activeTabKey)}</TitleBoxPool> */}
    //   {/* <ColoredDropdown alt="arrow down" /> */}
    //   {/* <TabLinkBox>
    //     {poolTabOrder.map(({ path, textKey, regex, icon, iconActive }) => (
    //       <StyledNavLink
    //         key={path}
    //         to={path}
    //         isActive={(_, { pathname }) => pathname.match(regex)}
    //         // onClick={() => {
    //         //   setModalIsOpen(false)
    //         // }}
    //       > 
    //         <div className='icon'>
    //           <img alt={''} src={pathname.match(regex) ? iconActive : icon}/>
    //         </div>
    //         {t(textKey)}
    //       </StyledNavLink>
    //     ))}
    //   </TabLinkBox> */}
    // </LiquidityContainer>
    // <OversizedPanel hideTop>
    //   <Modal
    //     isOpen={modalIsOpen}
    //     maxHeight={50}
    //     onDismiss={() => {
    //       setModalIsOpen(false)
    //     }}
    //   >
    //     <PoolModal>
    //       {poolTabOrder.map(({ path, textKey, regex }) => (
    //         <StyledNavLink
    //           key={path}
    //           to={path}
    //           isActive={(_, { pathname }) => pathname.match(regex)}
    //           onClick={() => {
    //             setModalIsOpen(false)
    //           }}
    //         >
    //           {t(textKey)}
    //         </StyledNavLink>
    //       ))}
    //     </PoolModal>
    //   </Modal>
    // </OversizedPanel>
  )
}

export default withRouter(ModeSelector)
