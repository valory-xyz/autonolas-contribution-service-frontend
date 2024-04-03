import React from 'react';
import { Row } from 'antd';
import PropTypes from 'prop-types';
import {
  CloseCircleOutlined,
} from '@ant-design/icons';
import { GATEWAY_URL } from 'util/constants';
import {
  MediaWrapper, MediaDeleteButton, Media,
} from './styles';
import { unpinFromIpfs } from './utils';

const MediaList = ({
  media,
  handleDelete,
}) => {
  const onDelete = (hash) => {
    try {
      handleDelete(hash);
      unpinFromIpfs(hash);
    } catch (error) {
      console.error('Error when removing media');
    }
  };

  return (
    <>
      {media.length > 0 && (
      <Row gutter={[12, 12]}>
        {media.map((hash) => (
          <MediaWrapper>
            <Media
              src={`${GATEWAY_URL}${hash}`}
              alt="NFT"
              width={80}
              height={80}
            />
            <MediaDeleteButton
              type="default"
              shape="circle"
              size="small"
              onClick={() => onDelete(hash)}
            >
              <CloseCircleOutlined />
            </MediaDeleteButton>
          </MediaWrapper>
        ))}
      </Row>
      )}
    </>
  );
};

MediaList.propTypes = {
  media: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default MediaList;
