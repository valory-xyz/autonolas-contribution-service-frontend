import Meta from 'common-util/meta';
import CalendarComponent from 'components/Calendar';

const CalendarPage = () => (
  <>
    <Meta
      meta={{
        title: 'Calendar',
        description: 'View all the important dates and events relating to Olas Contribute.',
        siteUrl: 'https://contribute.olas.network/calendar',
      }}
    />
    <CalendarComponent />
  </>
);

export default CalendarPage;
