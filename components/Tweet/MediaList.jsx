import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getMediaSrc } from './utils';
import { MediaWrapper, MediaDeleteButton, Media } from './styles';

const MediaList = ({
  media, handleDelete, mode, className,
}) => {
  if (media.length === 0) return null;

  if (mode === 'view') {
    return (
      <Row gutter={[12, 12]} className={className}>
        {media && media.map((item) => (
          <Col>
            <Media
              src={getMediaSrc(item)}
              width={30}
              height={30}
            />
          </Col>
        ))}
      </Row>
    );
  }

  if (mode === 'edit') {
    return (
      <Row gutter={[12, 12]} className={className}>
        {media.map((hash) => (
          <MediaWrapper>
            <Media src={getMediaSrc(hash)} width={80} height={80} />
            <MediaDeleteButton
              type="default"
              shape="circle"
              size="small"
              onClick={() => handleDelete(hash)}
            >
              <CloseCircleOutlined />
            </MediaDeleteButton>
          </MediaWrapper>
        ))}
      </Row>
    );
  }

  return null;
};

MediaList.propTypes = {
  media: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleDelete: PropTypes.func,
  className: PropTypes.string,
  mode: PropTypes.oneOf(['view', 'edit']),
};

MediaList.defaultProps = {
  className: '',
  handleDelete: () => {},
  mode: 'edit',
};

export default MediaList;
