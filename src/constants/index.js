import { injected, walletconnect, walletlink, fortmatic, portis, torus } from '../connectors'
import config from '../config'
export const FACTORY_ADDRESSES = {
  1: '0x73a001e72f0Fe3CA366d6079dC3427af7865839b',
  2: '0x4a0b2579ef8a2a7d321f3deaaa2681c23e4eaa92', // OKB-Test
  42: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30',
  56: '0x73a001e72f0fe3ca366d6079dc3427af7865839b', // BNB-Main
  97: '0x7e8B5B722f1a3C5ab2bd8510EAba24dAe97565d1', // BNB-Test
  128: '0xdd2bc74e7a5e613379663e72689e668300b42f37', // HT-Main
  256: '0x87fe4ea2692aeb64dbab6593de87cc4741e20c7f', // HT-Test
  250: '0x0911fD5BCbC574c59bee6D7B772587B4A03D2778', // FTM-Test
  32659: '0xa12cba22e4c316820bf4883ebb98a3789cf194a3', // Fusion-Main
  46688: '0x421d35f8f8fd822f898e75db43f057f7ea448298', // Fusion-Test
  79377087078960: '0xb081b9acc88ea2329036a776825ab2ea2c0255d6',
  137: '0xBdEc57d323dEb07959d9fF5FFCCd5F055F313380',
  100: '0xBdEc57d323dEb07959d9fF5FFCCd5F055F313380',
  43114: '0xbFf74Da37df72695b1d7e8185edD47fD0771eE3A',
  1287: '0x9e73d56dd1942743ffdf055449b052a806b854be',
  1285: '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4',
  66: '0x765277eebeca2e31912c9946eae1021199b39c61',
  1666600000: '0x765277EebeCA2e31912C9946eAe1021199B39C61',
  321: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
}

export const SUPPORTED_THEMES = {
  DARK: 'DARK',
  LIGHT: 'LIGHT'
}

const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
}

export const SUPPORTED_WALLETS =
  config.chainID !== '1'
    ? {
        ...MAINNET_WALLETS,
        LEDGER: {
          connector: '',
          name: 'Ledger',
          iconName: 'ledger.png',
          description: 'The world’s popular hardware wallet.',
          href: null,
          color: '#E8831D'
        },
      }
    : {
        ...MAINNET_WALLETS,
        ...{
          WALLET_CONNECT: {
            connector: walletconnect,
            name: 'WalletConnect',
            iconName: 'walletConnectIcon.svg',
            description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
            href: null,
            color: '#4196FC'
          },
          WALLET_LINK: {
            connector: walletlink,
            name: 'Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Use Coinbase Wallet app on mobile device',
            href: null,
            color: '#315CF5'
          },
          COINBASE_LINK: {
            name: 'Open in Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Open in Coinbase Wallet app.',
            href: 'https://go.cb-w.com/mtUDhEZPy1',
            color: '#315CF5',
            mobile: true,
            mobileOnly: true
          },
          TRUST_WALLET_LINK: {
            name: 'Open in Trust Wallet',
            iconName: 'trustWallet.png',
            description: 'iOS and Android app.',
            href: 'https://link.trustwallet.com/open_url?coin_id=60&url=https://uniswap.exchange/swap',
            color: '#1C74CC',
            mobile: true,
            mobileOnly: true
          },
          FORTMATIC: {
            connector: fortmatic,
            name: 'Fortmatic',
            iconName: 'fortmaticIcon.png',
            description: 'Login using Fortmatic hosted wallet',
            href: null,
            color: '#6748FF',
            mobile: true
          },
          Portis: {
            connector: portis,
            name: 'Portis',
            iconName: 'portisIcon.png',
            description: 'Login using Portis hosted wallet',
            href: null,
            color: '#4A6C9B',
            mobile: true
          },
          Torus: {
            connector: torus,
            name: 'Torus',
            iconName: 'torus.png',
            description: 'Login via Google, Facebook and others',
            href: null,
            color: '#5495F7',
            mobile: true
          }
        }
      }

// list of tokens that lock fund on adding liquidity - used to disable button
export const brokenTokens = [
  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  '0x95dAaaB98046846bF4B2853e23cba236fa394A31',
  '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
  '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA',
  '0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75',
  '0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037',
  '0x77599D2C6DB170224243e255e6669280F11F1473'
]

export const broken777Tokens = [
  '0x58e8a6c0e0b58bca809f1faee01f1662c9fc460e',
  '0xbdfa65533074b0b23ebc18c7190be79fa74b30c2',
  '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
  '0x9b869c2eaae08136c43d824ea75a2f376f1aa983',
  '0x09a8f2041be23e8ec3c72790c9a92089bc70fbca',
  '0x49d716dfe60b37379010a75329ae09428f17118d',
  '0x30e0c58c5670e0bdec98f29f66b092e43e98d699',
  '0x3212b29e33587a00fb1c83346f5dbfa69a458923',
  '0x5cffc0b73df80144f0f3f5bf75672777af2bbbfe',
  '0x0d31444c3f3cd583f30ca1b7cedc973db4bf5abf'
]

export const NetworkContextName = 'NETWORK'
