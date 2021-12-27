import React from 'react'
// import ReactGA from 'react-ga'
import styled from 'styled-components'
import { darken, transparentize } from 'polished'
import Toggle from 'react-switch'

import { Link } from '../../theme'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.uniswapPink};
  font-family: 'Manrope';

  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.uniswapPink};
  }

  #title {
    display: inline;
    font-size: 0.825rem;
    margin-right: 0.75rem;
    font-weight: 400;
    color: ${({ theme }) => theme.uniswapPink};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.uniswapPink)};
    }
  }
`

const StyledToggle = styled(Toggle)`
  margin-right: 24px;

  .react-switch-bg[style] {
    background-color: ${({ theme }) => darken(0.05, theme.inputBackground)} !important;
    border: 0.0625rem solid ${({ theme }) => theme.concreteGray} !important;
  }

  .react-switch-handle[style] {
    background-color: ${({ theme }) => theme.inputBackground};
    box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.93, theme.shadowColor)};
    border: 0.0625rem solid ${({ theme }) => theme.mercuryGray};
    border-color: ${({ theme }) => theme.mercuryGray} !important;
    top: 0.125rem !important;
  }
`

const EmojiToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: 'Manrope';
`

export default function Footer() {
  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <FooterFrame>
      <FooterElement>
        <Title>
          <Link id="link" href="https://anyswap.network">
            <h1 id="title">About</h1>
          </Link>
          <Link id="link" href="https://anyswap.network/docs">
            <h1 id="title">Docs</h1>
          </Link>
          <Link id="link" href="https://t.me/anyswap">
            <h1 id="title">Telegram</h1>
          </Link>
          <Link id="link" href="https://github.com/anyswap">
            <h1 id="title">Code</h1>
          </Link>
        </Title>
      </FooterElement>

      <StyledToggle
        checked={!isDark}
        uncheckedIcon={
          <EmojiToggle role="img" aria-label="moon">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            🌙️
          </EmojiToggle>
        }
        checkedIcon={
          <EmojiToggle role="img" aria-label="sun">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            {'☀️'}
          </EmojiToggle>
        }
        onChange={() => {
          // ReactGA.event({
          //   category: 'Advanced Interaction',
          //   action: 'Toggle Theme',
          //   label: isDark ? 'Light' : 'Dark'
          // })
          toggleDarkMode()
        }}
      />
    </FooterFrame>
  )
}
