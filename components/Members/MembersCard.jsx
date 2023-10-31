import {
  Card, Statistic,
} from 'antd/lib';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import Link from 'next/link';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const MembersCard = () => {
  const { membersList } = useCentaursFunctionalities();

  return (
    <>
      <Card
        title={<EducationTitle title="Members" educationItem="members" level={5} />}
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
