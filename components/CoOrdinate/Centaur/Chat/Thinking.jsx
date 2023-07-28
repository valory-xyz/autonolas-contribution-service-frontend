import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd/lib';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Thinking = () => <Spin indicator={antIcon} />;

export default Thinking;
