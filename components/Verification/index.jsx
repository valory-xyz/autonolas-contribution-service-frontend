import { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Typography, Col, Row, Button,
} from 'antd/lib';
// import { CheckSquareOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { notifyError, notifySuccess } from 'common-util/functions';
import Login from '../Login';
import { verifyAddress } from './utils';
import { Ol } from './styles';

const { Title, Text } = Typography;

const Verification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const account = useSelector((state) => get(state, 'setup.account'));
  const router = useRouter();

  // const checkmark = <CheckSquareOutlined twoToneColor={COLOR.PRIMARY} />;
  const checkmark = '✅';

  const discordId = get(router, 'query.[discord-id]');
  const isValidId = !!discordId;

  const isConnectWalletEnabled = !!account;
  const isLinkWalletEnabled = isConnectWalletEnabled && !isValidId;
  const isVerifyEnabled = !!account && isValidId;

  return (
    <>
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
                <>
                  <Button type="primary" disabled>
                    Connect Wallet
                  </Button>
                </>
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
                onClick={() => {
                  window.open('https://discord.com/invite/mpBqEk6Aga');
                  // router.push('/verification?discord-id=100'); // test
                }}
                disabled={!isLinkWalletEnabled}
              >
                Link wallet to Discord
              </Button>
            </li>

            {/* verify */}
            <li>
              <Title level={5}>
                Verify&nbsp;
                {isVerified && checkmark}
              </Title>

              <Button
                type="primary"
                onClick={async () => {
                  setIsVerifying(true);
                  try {
                    await verifyAddress(account, discordId);
                    setIsVerifying(false);
                    setIsVerified(true);
                    notifySuccess('Verified Successfully!');
                  } catch (error) {
                    notifyError();
                    console.error(error);
                  }
                }}
                disabled={!isVerifyEnabled || isVerified}
                loading={isVerifying}
              >
                Verify
              </Button>
            </li>

            {/* After verification message */}
            <li>
              <Title level={5}>View your activated badge</Title>
              <Text type="secondary" className="custom-text-secondary">
                <Link href="/">Return to homepage</Link>
                &nbsp;and see your badge update! Note it may take a minute to
                sync.
              </Text>
            </li>
          </Ol>
        </Col>
      </Row>
    </>
  );
};

export default Verification;
