import React from 'react';
import {
  Typography,
  Modal,
  Collapse,
} from 'antd';

const { Text, Title } = Typography;

export const VeolasModal = ({ showVeOLASModal, setShowVeOLASModal }) => {
  <Modal
    title={<Title level={4}>You need at least 1 veOLAS to send messages</Title>}
    open={showVeOLASModal}
    onOk={() => setShowVeOLASModal(false)}
    onCancel={() => setShowVeOLASModal(false)}
  >
    <Collapse
      className="mb-12 mt-12"
      items={[
        {
          key: '1',
          label: "What's veOLAS?",
          children: (
            <Text>
              veOLAS is a locked form of the Olas ecosystem&apos;s token, called
              OLAS. When you lock OLAS into veOLAS you get access to
              functionality.
            </Text>
          ),
        },
      ]}
    />
    <Title level={5} className="mb-4">
      How to get veOLAS
    </Title>
    <ol className="mt-0">
      <li>
        <a
          href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get OLAS on Ethereum ↗
        </a>
      </li>
      <li>
        Lock your OLAS at
        {' '}
        <a
          href="https://member.olas.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Olas Member ↗
        </a>
      </li>
    </ol>
    <Text type="secondary">
      Note: it&apos;s worth locking more than 1 veOLAS because your veOLAS
      amount will reduce over time.
    </Text>
  </Modal>;
};
