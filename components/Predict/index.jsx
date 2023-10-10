import React from 'react';
import {
  Col, Row,
} from 'antd/lib';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import PredictionForm from './PredictionForm';
import PredictionRequestsTable from './PredictionRequestsTable';

const Predict = () => (
  <div style={{ maxWidth: 700, margin: '0 auto' }}>
    <div className="mb-12">
      <Row>
        <Col span={12}>
          <EducationTitle title="Predict" educationItem="predict" />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <PredictionForm />
        </Col>
      </Row>
    </div>
    <PredictionRequestsTable />
  </div>
);

export default Predict;
