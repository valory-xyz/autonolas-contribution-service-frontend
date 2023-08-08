import { Card, Statistic } from 'antd/lib';
import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';
import Link from 'next/link';

const TweetCard = () => {
  const { currentMemoryDetails } = useCentaursFunctionalities();
  const proposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];

  return (
    <Card
      title="Tweet"
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
