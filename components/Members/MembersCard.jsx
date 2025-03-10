import { Card, Statistic } from 'antd';
import Link from 'next/link';

import { NA } from '@autonolas/frontend-library';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const MembersCard = () => {
  const { membersList } = useCentaursFunctionalities();

  return (
    <Card
      title={<EducationTitle title="Members" educationItem="members" level={5} />}
      extra={<Link href="/members">See all &rarr;</Link>}
      actions={[
        <Link href="/members" key="join">
          Join
        </Link>,
        <Link href="/members" key="invite">
          Invite
        </Link>,
        <Link href="/members" key="chat">
          Chat
        </Link>,
      ]}
    >
      <Statistic title="Total members" value={membersList?.length || NA} />
    </Card>
  );
};

export default MembersCard;
