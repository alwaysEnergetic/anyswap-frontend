import React from 'react'
import ReactDOM from 'react-dom'
// import ReactGA from 'react-ga'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ethers } from 'ethers'

import { NetworkContextName } from './constants'
// import { isMobile } from 'react-device-detect'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
import BalancesContextProvider, { Updater as BalancesContextUpdater } from './contexts/Balances'
import TokensContextProvider from './contexts/Tokens/index.js'
import AllowancesContextProvider from './contexts/Allowances'
import App from './pages/App'
import ThemeProvider, { GlobalStyle } from './theme'
import './i18n'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

sessionStorage.setItem('walletType', '')
sessionStorage.setItem('account', '')
sessionStorage.setItem('HDPath', '')

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  // console.log(provider)
  // console.log(library)
  return library
}
// if (process.env.NODE_ENV === 'production') {
//   ReactGA.initialize('UA-128182339-1')
//   ReactGA.set({
//     customBrowserType: !isMobile ? 'desktop' : window.web3 || window.ethereum ? 'mobileWeb3' : 'mobileRegular'
//   })
// } else {
//   ReactGA.initialize('test', { testMode: true })
// }

// ReactGA.pageview(window.location.pathname + window.location.search)

// function bodyScale() {
//   var devicewidth = document.documentElement.clientWidth;
//   if (devicewidth < 1440) {
//     var scale = devicewidth / 1440;  // 分母——设计稿的尺寸
//     document.body.style.zoom = scale;
//   }
// }
// window.onload = window.onresize = function () {
//   bodyScale();
// };

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TransactionContextProvider>
          <TokensContextProvider>
            <BalancesContextProvider>
              <AllowancesContextProvider>{children}</AllowancesContextProvider>
            </BalancesContextProvider>
          </TokensContextProvider>
        </TransactionContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
      <TransactionContextUpdater />
      <BalancesContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <ContextProviders>
        <Updaters />
        <ThemeProvider>
          <>
            <GlobalStyle />
            <App />
          </>
        </ThemeProvider>
      </ContextProviders>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
