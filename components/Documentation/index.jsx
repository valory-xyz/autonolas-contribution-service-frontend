import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Collapse, Anchor, Typography } from 'antd/lib';
import { kebabCase, get } from 'lodash';
// import useCheckMobileScreen from 'common-util/hooks/useCheckMobileScreen';
// import { SubHeaderSection } from '../Homepage/0Header';
import Overview from './content/1_Overview';
import UserFlow from './content/2_Actions';
import Badge from './content/3_Badge';
import Leaderboard from './content/4_Leaderboard';
import HowItWorks from './content/5_HowItWorks';
import TechnicalArchitecture from './content/6_TechnicalArchitecture';
import { DOC_NAV, DocumentationHeader, NavWrapper } from './helpers';
import { Container, DocNavigation, DocSection } from './styles';

const { Title } = Typography;
const { Link } = Anchor;
const { Panel } = Collapse;

const Documentation = () => {
  const [activeNav, setActiveNav] = useState(null);
  const router = useRouter();
  const isMobile = false;
  // const isMobile = useCheckMobileScreen();
  const anchorCommonProps = {
    affix: false,
    offsetTop: isMobile ? 20 : 120,
  };

  useEffect(() => {
    const { asPath } = router;
    const afterHash = asPath.split('#')[1];

    if (!afterHash && !activeNav) {
      // on load, set first key as active & opened by default
      const firstKey = kebabCase(get(DOC_NAV, `[${0}].id`) || '');
      setActiveNav(firstKey);
    } else {
      // if we want to point specific Id, the URL will have #
      // eg. #user-flow
      for (let i = 0; i < DOC_NAV.length; i += 1) {
        if (DOC_NAV[i].id === afterHash) {
          setActiveNav(DOC_NAV[i].id);
        } else {
          // if sub-nav is pointed, open the parent panel
          // eg. what-is-el-col > #user-benefits
          const hasId = DOC_NAV[i].subtitles.find(({ id }) => id === afterHash);
          if (hasId) {
            setActiveNav(DOC_NAV[i].id);
          }
        }
      }
    }
  }, []);

  return (
    <Container>
      <Title>Documentation</Title>

      <DocumentationHeader isMobile={isMobile} />

      <DocSection isMobile={isMobile}>
        <NavWrapper isMobile={isMobile}>
          <div className="navigation-section">
            {DOC_NAV.map(({ id: key, title, subtitles }, index) => {
              const hasSubNav = subtitles.length !== 0;
              if (!hasSubNav) {
                return (
                  <Anchor
                    {...anchorCommonProps}
                    key={key}
                    className={`custom-nav-anchor ${
                      key === activeNav ? 'custom-nav-anchor-active' : ''
                    }`}
                    onClick={() => {
                      setActiveNav(key);
                    }}
                  >
                    <Link href={`#${key}`} title={title} />
                  </Anchor>
                );
              }

              const getClassName = () => {
                let docClassName = '';
                if (key === activeNav) {
                  docClassName += 'custom-ant-collapse-active ';
                }
                if (isMobile) {
                  docClassName += 'doc-mobile-navigation ';
                }
                if (DOC_NAV.length - 1 === index) {
                  docClassName += 'last-navigation-item ';
                }

                return docClassName;
              };

              return (
                <DocNavigation
                  activeKey={[activeNav]}
                  key={`navigation-${key}`}
                  ghost
                  expandIconPosition="right"
                  /**
                   * e is an array of keys opened
                   * eg. e = ['key-of-tab-1', 'key-of-tab-2']
                   * and assign active-nav to the last opened tab
                   */
                  onChange={(e) => setActiveNav(e[e.length - 1] || DOC_NAV[0].id)}
                  className={getClassName()}
                >
                  <Panel
                    header={title}
                    key={key}
                    className={hasSubNav ? '' : 'no-sub-nav'}
                  >
                    <Anchor
                      {...anchorCommonProps}
                      onClick={() => setActiveNav(key)}
                    >
                      {subtitles.map(({ name, id: subId, className }) => {
                        const subKey = subId || kebabCase(name);
                        return (
                          <Link
                            key={subKey}
                            href={`#${subKey}`}
                            title={name}
                            className={className}
                          />
                        );
                      })}
                    </Anchor>
                  </Panel>
                </DocNavigation>
              );
            })}
          </div>
        </NavWrapper>

        <div className="reading-section">
          <Overview />
          <UserFlow />
          <Badge />
          <Leaderboard />
          <HowItWorks />
          <TechnicalArchitecture />
        </div>
      </DocSection>
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default Documentation;
