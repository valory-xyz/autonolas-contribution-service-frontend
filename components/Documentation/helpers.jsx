import { useState } from 'react';
import PropTypes from 'prop-types';
// import Header from 'common-util/Header';
import { HeaderContainer, WrapperDiv } from './styles';

/**
 * navigation titles
 */
export const DOC_NAV = [
  {
    id: 'section-overview',
    title: 'Overview',
    subtitles: [
      { id: 'user-benefits', name: 'User Benefits' },
      { id: 'time-and-effort-saved', name: 'Time and effort saved' },
      {
        id: 'making-nft-art-collecting-more-accessible',
        name: 'Making NFT art collecting more accessible',
      },
      {
        id: 'broadening-users-nft-exposure',
        name: 'Broadening users’ NFT exposure',
      },
    ],
  },
  {
    id: 'section-actions',
    title: 'Actions',
    subtitles: [],
  },
  {
    id: 'section-badge',
    title: 'Badge',
    subtitles: [],
  },
  {
    id: 'section-leaderboard',
    title: 'Leaderboard',
    subtitles: [],
  },
  {
    id: 'section-how-it-works',
    title: 'How It Works',
    subtitles: [],
  },
  {
    id: 'section-technical-architecture',
    title: 'Technical Architecture',
    subtitles: [
      {
        id: 'on-chain-components',
        name: 'On-chain components:',
        className: 'bold',
      },
      { id: 'autonolas-protocol', name: 'Autonolas Protocol' },
      { id: 'gnosis-safe', name: 'Gnosis Safe' },
      { id: 'art-blocks', name: 'Art Blocks ' },
      { id: 'fractional', name: 'Fractional' },
      {
        id: 'autonomous-service-autonolas',
        name: 'Autonomous Service: Autonolas',
        className: 'bold',
      },
      { id: 'funding-abci-app', name: 'Funding ABCI App' },
      { id: 'minter-abci-app', name: 'Minter ABCI App ' },
      { id: 'fractional-abci-app', name: 'Fractional ABCI App' },
      { id: 'autonolas-agent-operators', name: 'Autonolas Agent Operators' },
    ],
  },
];

/**
 * Documentation Header
 */
export const DocumentationHeader = ({ isMobile }) => (
  <HeaderContainer>
    <div>
      {/* <Header className="header" title="DOCUMENTATION" /> */}
      <img src="/images/horizontal-arrow.png" alt="" loading="lazy" />
      {!isMobile && (
        <img src="/images/horizontal-arrow.png" alt="" loading="lazy" />
      )}
    </div>

    {!isMobile && (
      <div>
        <img
          src="/images/Documentation/documentation.png"
          alt=""
          loading="lazy"
          width={174}
        />
      </div>
    )}
  </HeaderContainer>
);

DocumentationHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

/**
 * navigation wrapper
 */
export const NavWrapper = ({ isMobile, children }) => {
  const [isOpen, setOpen] = useState(null);
  const handleOpen = () => {
    setOpen(!isOpen);
  };

  if (isMobile) {
    return (
      <>
        <WrapperDiv>
          <div
            className="text"
            role="button"
            tabIndex="0"
            onKeyPress={handleOpen}
            onClick={handleOpen}
          >
            LIST OF CONTENTS
          </div>
          <div className="documentation-chapters">{isOpen && children}</div>
        </WrapperDiv>
      </>
    );
  }

  return <>{children}</>;
};

NavWrapper.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.element]).isRequired,
};
