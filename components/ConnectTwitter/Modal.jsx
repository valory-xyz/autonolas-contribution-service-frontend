import { TwitterOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const ConnectTwitterModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const account = useSelector((state) => state?.setup?.account);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCreateTweet = () => {
    const tweetText = `I'm linking my wallet to @Autonolas Contribute:\n${account}\n\nStart contributing to #OlasNetwork: https://contribute.olas.network`;
    const encodedTweetText = encodeURIComponent(tweetText).replace(/%0D%0A/g, '%0A');
    window.open(`https://twitter.com/intent/tweet?text=${encodedTweetText}`, '_blank');
  };

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>
        <TwitterOutlined /> Connect Twitter
      </Button>

      <Modal
        title={
          <Title level={4} className="mb-0">
            Connect Twitter
          </Title>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <Title className="mb-0" level={5}>
          Step 1:
        </Title>
        <Text>Connect wallet</Text>
        <br />
        <br />
        <Title className="mb-8" level={5}>
          Step 2:
        </Title>
        <Button
          type="primary"
          onClick={handleCreateTweet}
          className="mb-8"
          disabled={!account}
          title={!account && 'Connect a wallet'}
        >
          <TwitterOutlined /> Post tweet
        </Button>
        <br />
        <Text type="secondary">
          Don&apos;t change the tweet – it contains a unique code that links your wallet to your
          Twitter account.
        </Text>
        <br />
        <br />
        <Title className="mb-0" level={5}>
          Step 3:
        </Title>
        <Text>Wait up to 5-10 minutes – your Twitter account will be automatically linked.</Text>
        <br />
        <br />
        <Title className="mb-0" level={5}>
          Step 4:
        </Title>
        <Text>@-mention Autonolas or use the #OlasNetwork hashtag to start receiving rewards.</Text>
      </Modal>
    </>
  );
};

export default ConnectTwitterModal;
