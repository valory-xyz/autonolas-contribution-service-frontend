import { Card, Statistic } from 'antd';
import Link from 'next/link';

import { NA } from '@autonolas/frontend-library';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { useProposals } from '../CoOrdinate/Centaur/hooks';

const TweetCard = () => {
  const { pendingTweetProposals } = useProposals();

  return (
    <Card
      title={<EducationTitle title="Post" educationItem="post" level={5} />}
      actions={[
        <Link href="/post" key="propose">
          Propose a post
        </Link>,
        <Link href="/post" key="review">
          Review proposals
        </Link>,
      ]}
    >
      <Statistic title="Pending post proposals" value={pendingTweetProposals?.length || NA} />
    </Card>
  );
};

export default TweetCard;
