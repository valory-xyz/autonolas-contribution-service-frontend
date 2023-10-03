import { Typography } from 'antd';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const TypographyContainer = styled(Typography)`
  max-width: 800px;
  margin: 0 auto;
  h1.ant-typography {
    text-align: center;
  }
  ol.custom-list {
    list-style-type: lower-alpha;
  }
`;

export const Disclaimer = () => (
  <TypographyContainer>
    <Title>Disclaimer</Title>

    <Paragraph>
      <ol>
        <li>
          This App is owned by the Autonolas DAO and operated by&nbsp;
          <a
            href="https://centralitylabs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Centrality Labs
          </a>
          . This App is for the Autonolas community to encourage Autonolas
          ecosystem contributors and users to unlock Autonolas governance.
        </li>

        <li>
          THIS APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot;
          AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. Neither
          Autonolas nor Centrality Labs will be liable for any loss, whether
          such loss is direct, indirect, special or consequential, suffered by
          any party as a result of their use of this app.
        </li>

        <li>
          By accessing this app, you represent and warrant
          <ol className="custom-list">
            <li>
              that you are of legal age and that you will comply with any laws
              applicable to you and not engage in any illegal activities;
            </li>
            <li>
              that you are claiming OLAS tokens to participate in the Autonolas
              DAO governance process and that they do not represent
              consideration for past or future services;
            </li>
            <li>
              that you, the country you are a resident of and your wallet
              address is not on any sanctions lists maintained by the United
              Nations, Switzerland, the EU, UK or the US;
            </li>
            <li>
              that you are responsible for any tax obligations arising out of
              the interaction with this app.
            </li>
          </ol>
        </li>

        <li>
          None of the information available on this app, or made otherwise
          available to you in relation to its use, constitutes any legal, tax,
          financial or other advice. Where in doubt as to the action you should
          take, please consult your own legal, financial, tax or other
          professional advisors.
        </li>
      </ol>
    </Paragraph>
    <Paragraph />
  </TypographyContainer>
);
