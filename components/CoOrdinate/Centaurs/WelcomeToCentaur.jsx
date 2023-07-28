import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Typography, Button } from 'antd/lib';
import { LikeOutlined } from '@ant-design/icons';
import { WelcomeMessageModal } from './styles';

const { Text } = Typography;

export const LIST = [
  {
    id: '1',
    title: 'Create your Coordinate',
    description: 'Give it a name and a purpose.',
    imageUrl: '/images/image_2.png',
    imageDimensions: { width: 110, height: 115 },
  },
  {
    id: '2',
    title: 'Invite collaborators and add to your bot’s memory',
    description: '',
    imageUrl: '/images/image_3.png',
    imageDimensions: { width: 205, height: 90 },
  },
  {
    id: '3',
    title: 'Deliver value',
    description:
      'Other people can then chat with your bot, and it will post content on your behalf each day.',
    imageUrl: '/images/image_4.png',
    imageDimensions: { width: 205, height: 90 },
  },
];

export const WelcomeToCentaur = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('welcomeMessage')) {
      localStorage.setItem('welcomeMessage', true);
      setWelcomeMessage(true);
    }
  }, []);

  return (
    <>
      {welcomeMessage && (
        <WelcomeMessageModal
          width={560}
          title="Welcome to Centaurs"
          visible={welcomeMessage}
          onOk={() => setWelcomeMessage(false)}
          onCancel={() => setWelcomeMessage(false)}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => setWelcomeMessage(false)}
              icon={<LikeOutlined />}
            >
              Got it
            </Button>,
          ]}
        >
          <Text className="text-center" style={{ display: 'inline-flex' }}>
            Train AI bots with your community. Earn ownership & sell them on.
          </Text>

          <div className="centaur-image">
            <Image
              src="/images/image_1.png"
              alt="Centaurs icon"
              width={220}
              height={220}
            />
          </div>

          <ol start={1} className="centaur-contents">
            {LIST.map((item) => (
              <li key={item.id} className="mohan">
                <div className="centaur-each-content">
                  <div className="centaur-content-text">
                    <Text strong>{item.title}</Text>
                    <Text type="secondary">{item.description}</Text>
                  </div>

                  <div className="centaur-content-image">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={item.imageDimensions.width}
                      height={item.imageDimensions.height}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </WelcomeMessageModal>
      )}
    </>
  );
};
