// TODO not supported on mobile yet
import {
  Menu, Skeleton,
} from 'antd';
import { GroupChat } from 'components/GroupChat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ORBIS_PROJECT_ID } from 'util/constants';
import orbis from 'common-util/orbis';
import { ChatMenu } from './styles';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [chatsError, setChatsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

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
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <ChatMenu mode="inline" style={{ width: 256 }} selectedKeys={[id]} inlineIndent={8}>
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
  );
};

export default Chat;
