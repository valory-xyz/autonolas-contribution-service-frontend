import { Card, Statistic } from 'antd/lib';
import { NA } from '@autonolas/frontend-library';
import Link from 'next/link';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const TweetCard = () => {
  const { filteredProposals } = useCentaursFunctionalities();

  return (
    <Card
      title={<EducationTitle title="Tweet" educationItem="tweet" level={5} />}
      actions={[
        <Link href="/tweet">Propose a tweet</Link>,
        <Link href="/tweet">Review proposals</Link>,
      ]}
    >
      <Statistic
        title="Pending tweet proposals"
        value={filteredProposals?.length || NA}
      />
    </Card>
  );
};

export default TweetCard;
