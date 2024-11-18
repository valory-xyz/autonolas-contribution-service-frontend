import { Card, Statistic } from 'antd';
import Link from 'next/link';

import { NA } from '@autonolas/frontend-library';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { useProposals } from '../CoOrdinate/Centaur/hooks';

const TweetCard = () => {
  const { pendingTweetProposals } = useProposals();

  return (
    <Card
      title={<EducationTitle title="Tweet" educationItem="tweet" level={5} />}
      actions={[
        <Link href="/tweet" key="propose">
          Propose a tweet
        </Link>,
        <Link href="/tweet" key="review">
          Review proposals
        </Link>,
      ]}
    >
      <Statistic title="Pending tweet proposals" value={pendingTweetProposals?.length || NA} />
    </Card>
  );
};

export default TweetCard;
