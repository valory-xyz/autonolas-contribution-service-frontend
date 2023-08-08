import { UserAddOutlined } from '@ant-design/icons';
import {
  Card, Statistic,
} from 'antd/lib';
import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';
import Link from 'next/link';

const MembersCard = () => {
  const { membersList } = useCentaursFunctionalities();

  return (
    <>
      <Card
        title="Members"
        extra={
          <Link href="/members">See all &rarr;</Link>
        }
        actions={
          [
            <Link href="/members">Join</Link>,
            <Link href="/members">
              Invite
            </Link>,
            <Link href="/members">Chat</Link>,
          ]
        }
      >
        <Statistic title="Total members" value={membersList?.length || 'n/a'} />
      </Card>
    </>
  );
};

export default MembersCard;
