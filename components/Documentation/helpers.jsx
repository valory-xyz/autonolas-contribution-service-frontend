import { useState } from 'react';
import PropTypes from 'prop-types';
import { WrapperDiv } from './styles';

/**
 * navigation titles
 */
export const DOC_NAV = [
  {
    id: 'section-overview',
    title: 'Overview',
  },
  {
    id: 'section-actions',
    title: 'Actions',
  },
  {
    id: 'section-badge',
    title: 'Badge',
  },
  {
    id: 'section-leaderboard',
    title: 'Leaderboard',
  },
  {
    id: 'section-how-it-works',
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
          onKeyPress={handleOpen}
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
