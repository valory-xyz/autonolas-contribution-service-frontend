import {
  Menu, Skeleton, Grid, Typography,
} from 'antd';
import { GroupChat } from 'components/GroupChat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ORBIS_PROJECT_ID } from 'util/constants';
import orbis from 'common-util/orbis';
import { MobileTwoTone } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';
import { ChatMenu } from './styles';

const { useBreakpoint } = Grid;

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [chatsError, setChatsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const screens = useBreakpoint();

  const router = useRouter();
  const { id } = router.query;

  const loadChats = async () => {
    try {
      // Set loading to true only on the first run
      if (firstLoad) {
        setLoading(true);
        setFirstLoad(false);
      }
      const { data } = await orbis.getContexts(ORBIS_PROJECT_ID);
      setChats(data[0]?.child_contexts);
    } catch (error) {
      console.error('Error loading messages:', error);
      setChatsError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load all chats ("contexts")
  useEffect(() => {
    loadChats();
  }, []);

  return (
    !screens.xs ? (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <ChatMenu mode="inline" selectedKeys={[id]} inlineIndent={8}>
          {
          loading && (
            <Skeleton active className="p-24" />
          )
        }
          {(!loading || chatsError)
          && chats.map((chat) => (
            <Menu.Item key={chat.stream_id}>
              <Link href={`/chat/${chat.stream_id}`}>
                {chat.content.displayName}
              </Link>
            </Menu.Item>
          ))}
        </ChatMenu>
        <div style={{ flex: 1 }}>
          <GroupChat />
        </div>
      </div>
    ) : (
      <div style={{ textAlign: 'center' }} className="mt-48">
        <MobileTwoTone
          style={{ fontSize: '4rem', marginBottom: '16px' }}
          twoToneColor={COLOR.GREY_1}
        />
        <br />
        <Typography.Text type="secondary">Chat is not available on mobile</Typography.Text>
      </div>
    )
  );
};

export default Chat;
