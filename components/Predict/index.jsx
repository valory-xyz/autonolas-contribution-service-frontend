import {
  Card, Col, Row, Typography,
} from 'antd';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import PredictionForm from './PredictionForm';
import PredictionRequestsTable from './PredictionRequestsTable';

const { Title } = Typography;

const Predict = () => (
  <>
    <div className="mb-24">
      <EducationTitle title="Predict" educationItem="predict" />
    </div>
    <Row gutter={12}>
      <Col lg={8} xs={24} className="mb-24">
        <Card title={<Title level={5}>Request a prediction</Title>}>
          <PredictionForm />
        </Card>
      </Col>
      <Col lg={16} xs={24}>
        <Card title={<Title level={5}>Requests</Title>} bodyStyle={{ padding: 0 }}>
          <PredictionRequestsTable />
        </Card>
      </Col>
    </Row>
  </>
);

export default Predict;
