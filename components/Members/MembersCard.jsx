import {
  Card, Statistic,
} from 'antd/lib';
import Link from 'next/link';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

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
