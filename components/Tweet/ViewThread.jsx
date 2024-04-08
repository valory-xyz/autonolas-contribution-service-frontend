import PropTypes from 'prop-types';
import {
  Button, Typography, Timeline,
} from 'antd';
import { CloseOutlined, EditFilled } from '@ant-design/icons';
import { Fragment } from 'react';
import { NA } from '@autonolas/frontend-library';
import { EachThreadContainer } from './styles';
import MediaList, { MODE } from './MediaList';

const { Text } = Typography;

export const ViewThread = ({ thread, onEditThread, onRemoveFromThread }) => (
  <Timeline
    style={{ paddingTop: 10 }}
    items={thread.map((tweet, threadIndex) => ({
      children: (
        <Fragment key={`thread-${threadIndex}`}>
          <EachThreadContainer>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{tweet.text || NA}</Text>

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

              {(tweet.text?.length > 1 || tweet.media.length > 0)
                && onRemoveFromThread && (
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
          <MediaList media={tweet.media} mode={MODE.VIEW} className="mt-8" />
        </Fragment>
      ),
    }))}
  />
);

ViewThread.propTypes = {
  thread: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      media: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  onEditThread: PropTypes.func,
  onRemoveFromThread: PropTypes.func,
};

ViewThread.defaultProps = {
  thread: [],
  onEditThread: null,
  onRemoveFromThread: null,
};
