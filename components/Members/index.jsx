import { Col, Row } from 'antd/lib';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import GroupChat from 'components/GroupChat';
import MembersList from 'components/MembersList';

const Members = () => (
  <>
    <div className="mb-24">
      <EducationTitle title="Members" educationItem="members" />
    </div>
    <Row gutter={24}>
      <Col xs={24} md={24} lg={12} xl={8} className="mb-24">
        <MembersList />
      </Col>
      <Col xs={24} md={24} lg={12} xl={12}>
        <GroupChat chatEnabled />
      </Col>
    </Row>
  </>
);

export default Members;
