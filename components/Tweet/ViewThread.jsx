import PropTypes, { string } from 'prop-types';
import { Button, Typography, Timeline } from 'antd';
import { CloseOutlined, EditFilled } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const EachThreadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .thread-col-2 {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 160px;
  }
`;

export const ViewThread = ({ thread, onEditThread, onRemoveFromThread }) => (
  <Timeline style={{ paddingTop: 10 }}>
    {thread.map((e, threadIndex) => (
      <Timeline.Item key={`thread-${threadIndex}`}>
        <EachThreadContainer>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{e}</Text>

          <div className="thread-col-2">
            {onEditThread && (
              <Button
                ghost
                type="primary"
                size="small"
                icon={<EditFilled />}
                onClick={() => onEditThread(threadIndex)}
              />
            )}

            {e.length > 1 && onRemoveFromThread && (
              <Button
                danger
                className="ml-8"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => onRemoveFromThread(threadIndex)}
              />
            )}
          </div>
        </EachThreadContainer>
      </Timeline.Item>
    ))}
  </Timeline>
);

ViewThread.propTypes = {
  thread: PropTypes.arrayOf(string),
  onEditThread: PropTypes.func,
  onRemoveFromThread: PropTypes.func,
};

ViewThread.defaultProps = {
  thread: [],
  onEditThread: null,
  onRemoveFromThread: null,
};
