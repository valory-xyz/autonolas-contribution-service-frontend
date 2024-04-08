import { useMemo, Fragment } from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getMediaSrc } from './utils';
import { MediaWrapper, MediaDeleteButton, Media } from './styles';

export const MODE = {
  VIEW: 'view',
  EDIT: 'edit',
};

const MediaItem = ({ mode, item, handleDelete }) => {
  const key = typeof item === 'string' ? item : item.name;
  const src = useMemo(
    () => (typeof item === 'string' ? getMediaSrc(item) : URL.createObjectURL(item)),
    [item],
  );
  const Wrapper = mode === MODE.EDIT ? MediaWrapper : Fragment;

  const handleDeleteAndRevoke = () => {
    if (handleDelete) {
      handleDelete(item);
      URL.revokeObjectURL(item.url);
    }
  };
  return (
    <Col key={key}>
      <Wrapper>
        <Media
          src={src}
          width={mode === MODE.EDIT ? 80 : 30}
          height={mode === MODE.EDIT ? 80 : 30}
        />
      </Wrapper>
      {mode === MODE.EDIT && (
        <MediaDeleteButton
          type="default"
          shape="circle"
          size="small"
          onClick={handleDeleteAndRevoke}
        >
          <CloseCircleOutlined />
        </MediaDeleteButton>
      )}
    </Col>
  );
};

MediaItem.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.string, // Array of String URL
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired, // Array of file objects
    }),
  ]).isRequired,
  handleDelete: PropTypes.func,
  mode: PropTypes.oneOf(Object.values(MODE)),
};

MediaItem.defaultProps = {
  mode: MODE.EDIT,
  handleDelete: null,
};

const MediaList = ({
  media, handleDelete, mode, className,
}) => {
  if (media.length === 0) return null;

  return (
    <Row gutter={[12, 12]} className={className}>
      {media.map((item) => (
        <MediaItem item={item} mode={mode} handleDelete={handleDelete} />
      ))}
    </Row>
  );
};

MediaList.propTypes = {
  media: PropTypes.arrayOf(MediaItem.propTypes.item).isRequired,
  handleDelete: MediaItem.propTypes.handleDelete,
  className: PropTypes.string,
  mode: MediaItem.propTypes.mode,
};

MediaList.defaultProps = {
  className: '',
  mode: MediaItem.defaultProps.mode,
  handleDelete: MediaItem.defaultProps.handleDelete,
};

export default MediaList;
