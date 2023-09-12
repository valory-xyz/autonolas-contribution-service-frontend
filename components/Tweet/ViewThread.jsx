import PropTypes, { string } from 'prop-types';
import { Button, Typography } from 'antd/lib';
import { CloseOutlined, EditFilled } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const EachThreadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .thread-col-2 {
  }
`;

export const ViewThread = ({
  thread,
  threadIndex,
  onEditThread,
  onRemoveFromThread,
}) => (
  <EachThreadContainer>
    <Text style={{ whiteSpace: 'pre-wrap' }}>{thread}</Text>

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

      {thread.length > 1 && onRemoveFromThread && (
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
);

ViewThread.propTypes = {
  thread: PropTypes.arrayOf(string),
  threadIndex: PropTypes.number,
  onEditThread: PropTypes.func.isRequired,
  onRemoveFromThread: PropTypes.func.isRequired,
};

ViewThread.defaultProps = {
  thread: [],
  threadIndex: -1,
};
