import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getMediaSrc } from './utils';
import { MediaWrapper, MediaDeleteButton, Media } from './styles';

const MODE = {
  VIEW: 'view',
  EDIT: 'edit',
};

const MediaList = ({
  media, handleDelete, mode, className,
}) => {
  if (media.length === 0) return null;

  if (mode === MODE.VIEW) {
    return (
      <Row gutter={[12, 12]} className={className}>
        {media && media.map((item) => (
          <Col key={item.name}>
            <Media
              src={typeof item === 'string' ? getMediaSrc(item) : URL.createObjectURL(item)}
              width={30}
              height={30}
            />
          </Col>
        ))}
      </Row>
    );
  }

  if (mode === MODE.EDIT) {
    return (
      <Row gutter={[12, 12]} className={className}>
        {media.map((file) => (
          <MediaWrapper key={file.name}>
            <Media src={URL.createObjectURL(file)} width={80} height={80} />
            <MediaDeleteButton
              type="default"
              shape="circle"
              size="small"
              onClick={() => handleDelete(file)}
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
  mode: PropTypes.oneOf(Object.values(MODE)),
};

MediaList.defaultProps = {
  className: '',
  handleDelete: () => {},
  mode: 'edit',
};

export default MediaList;
