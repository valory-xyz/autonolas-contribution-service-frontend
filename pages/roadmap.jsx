import Meta from 'common-util/meta';
import Roadmap from 'components/Roadmap';

const RoadmapPage = () => (
  <>
    <Meta
      meta={{
        title: 'Roadmap',
        description:
          'Explore our Contribute roadmap to see upcoming features, milestones, and improvements.',
        siteUrl: 'https://contribute.olas.network/roadmap',
      }}
    />
    <Roadmap />
  </>
);

export default RoadmapPage;
