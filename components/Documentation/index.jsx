import { Anchor, Grid, Typography } from 'antd';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ActionsDocs } from './content/Actions';
import { Calendar } from './content/Calendar';
import { HowItWorks } from './content/HowItWorks';
// import { Badge } from './content/3_Badge';
import { Leaderboard } from './content/Leaderboard';
import { Overview } from './content/Overview';
import { Proposals } from './content/Proposals';
import { Roadmap } from './content/Roadmap';
// import { Members } from './content/Members';
// import { Chatbot } from './content/Chatbot';
// import { Memory } from './content/Memory';
import { Tweet } from './content/Tweet';
import { DOC_NAV, NavWrapper } from './helpers';
// import Predict from './content/Predict';
import { Container, DocSection } from './styles';

const { Title } = Typography;
const { Link } = Anchor;
const { useBreakpoint } = Grid;

export const Documentation = () => {
  const [activeNav, setActiveNav] = useState(null);
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !!screens.xs;
  const anchorCommonProps = {
    affix: false,
    offsetTop: isMobile ? 20 : 60,
  };

  useEffect(() => {
    const { asPath } = router;
    const afterHash = asPath.split('#')[1];
    setActiveNav(afterHash || get(DOC_NAV, `[${0}].id`) || '');
  }, [router]);

  return (
    <Container>
      <Title>Docs</Title>

      <DocSection isMobile={isMobile}>
        <NavWrapper isMobile={isMobile}>
          <div className="navigation-section">
            {DOC_NAV.map(({ id: key, title }) => (
              <Anchor
                {...anchorCommonProps}
                key={key}
                className={`custom-nav-anchor ${
                  key === activeNav ? 'custom-nav-anchor-active' : ''
                }`}
                onClick={() => setActiveNav(key)}
              >
                <Link href={`#${key}`} title={title} />
              </Anchor>
            ))}
          </div>
        </NavWrapper>

        <div className="reading-section">
          <Overview />
          <Leaderboard />
          <ActionsDocs />
          {/* <Badge /> */}
          {/* <Members /> */}
          {/* <Chatbot /> */}
          {/* <Memory /> */}
          <Tweet />
          {/* <Predict /> */}
          <Proposals />
          <HowItWorks />
          <Roadmap />
          <Calendar />
        </div>
      </DocSection>
      <br />
      <br />
      <br />
    </Container>
  );
};
