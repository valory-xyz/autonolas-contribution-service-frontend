import { Card, Statistic } from 'antd/lib';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';
import Link from 'next/link';

const TweetCard = () => {
  const { currentMemoryDetails } = useCentaursFunctionalities();
  const proposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];

  return (
    <Card
      title={<EducationTitle title="Tweet" educationItem="tweet" level={5} />}
      actions={[
        <Link href="/tweet">Propose a tweet</Link>,
        <Link href="/tweet">Review proposals</Link>,
      ]}
    >
      <Statistic title="Pending tweet proposals" value={proposals?.length || 'n/a'} />
    </Card>
  );
};

export default TweetCard;
