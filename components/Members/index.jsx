import { Col, Row } from 'antd';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { MembersList } from '../MembersList';

const Members = () => (
  <>
    <div className="mb-24">
      <EducationTitle title="Members" educationItem="members" />
    </div>
    <Row gutter={24}>
      <Col xs={24} md={24} lg={18} xl={18} className="mb-24">
        <MembersList />
      </Col>
    </Row>
  </>
);

export default Members;
