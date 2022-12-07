import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Typography, Col, Row, Button,
} from 'antd/lib';
// import { CheckSquareOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { notifySuccess } from 'common-util/functions';
import Login from '../Login';
import { Ol } from './styles';

const { Title } = Typography;

const Verification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const account = useSelector((state) => get(state, 'setup.account'));
  const router = useRouter();

  // const checkmark = <CheckSquareOutlined twoToneColor={COLOR.PRIMARY} />;
  const checkmark = '✅';

  const isValidId = !!get(router, 'query.[discord-id]');

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
                Link Wallet&nbsp;
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
                Link Wallet
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
                onClick={() => {
                  setIsVerifying(true);

                  setTimeout(() => {
                    setIsVerifying(false);
                    setIsVerified(true);
                    notifySuccess('Verified Successfully!');
                  }, 3000);
                }}
                disabled={!isVerifyEnabled || isVerified}
                loading={isVerifying}
              >
                Verify
              </Button>
            </li>
          </Ol>
        </Col>
      </Row>
    </>
  );
};

export default Verification;
