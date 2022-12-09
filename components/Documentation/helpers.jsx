import { useState } from 'react';
import PropTypes from 'prop-types';
import { WrapperDiv } from './styles';

export const DOCS_SECTIONS = {
  overview: 'section-overview',
  actions: 'section-actions',
  badge: 'section-badge',
  leaderboard: 'section-leaderboard',
  'how-it-works': 'section-how-it-works',
};

/**
 * navigation titles
 */
export const DOC_NAV = [
  {
    id: DOCS_SECTIONS.overview,
    title: 'Overview',
  },
  {
    id: DOCS_SECTIONS.actions,
    title: 'Actions',
  },
  {
    id: DOCS_SECTIONS.badge,
    title: 'Badge',
  },
  {
    id: DOCS_SECTIONS.leaderboard,
    title: 'Leaderboard',
  },
  {
    id: DOCS_SECTIONS['how-it-works'],
    title: 'How It Works',
  },
];

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
      <WrapperDiv>
        <div
          className="text"
          role="button"
          tabIndex="0"
          onKeyDown={handleOpen}
          onClick={handleOpen}
        >
          LIST OF CONTENTS
        </div>
        <div className="documentation-chapters">{isOpen && children}</div>
      </WrapperDiv>
    );
  }

  return <>{children}</>;
};

NavWrapper.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.element]).isRequired,
};
