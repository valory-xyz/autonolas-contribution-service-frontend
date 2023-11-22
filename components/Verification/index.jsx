import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Typography, Col, Row, Button, Alert,
} from 'antd';
import get from 'lodash/get';
import styled from 'styled-components';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { setIsVerified } from 'store/setup/actions';
import Login from '../Login';
import { getAddressStatus } from '../Layout/utils';
import { verifyAddress, isRouteValid } from './utils';

const { Title, Text } = Typography;

export const Ol = styled.ol`
  li {
    margin-bottom: 1rem;
  }
`;

const checkmark = '✅';

const VerificationDisclaimer = () => (
  <Text type="secondary" className="custom-text-secondary">
    <Text strong>Disclaimer&nbsp;-&nbsp;</Text>
    By connecting and/or verifying your information (including your Discord,
    Twitter and wallet address details) you are creating public information. In
    particular, the leaderboard functionality will display a link between your
    provided Discord and Twitter handles.
  </Text>
);

const VerificationMessage = () => (
  <>
    <Title level={5}>View your activated badge</Title>
    <Text type="secondary" className="custom-text-secondary">
      <Link href="/">Return to homepage</Link>
      &nbsp;and see your badge update! Note it may take a minute to sync.
    </Text>
  </>
);

const Verification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const account = useSelector((state) => get(state, 'setup.account'));
  const dispatch = useDispatch();
  const router = useRouter();

  const discordId = get(router, 'query.[discord-id]');
  const linkExpiration = get(router, 'query.[link-expiration]');
  const signature = get(router, 'query.[signature]');

  const isValidId = !!discordId;

  const isConnectWalletEnabled = !!account;
  const isLinkWalletEnabled = isConnectWalletEnabled && !isValidId;
  const isVerifyEnabled = !!account && isValidId;

  if (!isRouteValid(linkExpiration, signature, discordId)) {
    return (
      <Alert
        type="error"
        showIcon
        message={(
          <Text>
            Invalid verification link. Please
            {' '}
            <a href="/verification">try again</a>
            .
          </Text>
        )}
        style={{ marginTop: '2rem' }}
      />
    );
  }

  return (
    <>
      <Alert
        className="custom-alert-secondary mb-12"
        message={<VerificationDisclaimer />}
        type="info"
      />

      <Title level={2}>Complete Discord Verification</Title>

      <Row gutter={[32, 8]}>
        <Col xs={24} lg={12}>
          <Ol>
            {/* connect */}
            <li>
              <Title level={5}>
                Connect Wallet&nbsp;
                {isConnectWalletEnabled && checkmark}
              </Title>

              {account ? (
                <Button type="primary" disabled>
                  Connect Wallet
                </Button>
              ) : (
                <Login />
              )}
            </li>

            {/* link */}
            <li>
              <Title level={5}>
                Link wallet to Discord&nbsp;
                {isValidId && checkmark}
              </Title>

              <Button
                type="primary"
                onClick={() => window.open('https://discord.com/invite/mpBqEk6Aga')}
                disabled={!isLinkWalletEnabled}
              >
                Link wallet to Discord
              </Button>
            </li>

            {/* verify */}
            <li>
              <Title level={5}>
                Verify&nbsp;
                {isWalletVerified && checkmark}
              </Title>

              <Button
                type="primary"
                onClick={async () => {
                  setIsVerifying(true);
                  try {
                    await verifyAddress(account, discordId);
                    setIsVerifying(false);
                    setIsWalletVerified(true);
                    notifySuccess('Verified Successfully!');

                    const response = await getAddressStatus(account);
                    dispatch(setIsVerified(response));
                  } catch (error) {
                    notifyError();
                    console.error(error);
                  }
                }}
                disabled={!isVerifyEnabled || isWalletVerified}
                loading={isVerifying}
              >
                Verify
              </Button>
            </li>

            {/* After verification message */}
            <li>
              <VerificationMessage />
            </li>
          </Ol>
        </Col>
      </Row>
    </>
  );
};

export default Verification;
