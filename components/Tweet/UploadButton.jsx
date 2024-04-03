import { useState, useRef } from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadToIpfs } from './utils';

const UploadButton = ({
  disabled,
  title,
  accept,
  onUploadMedia,
  ...rest
}) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileInputChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onloadend = async () => {
        try {
          // Upload the file to IPFS
          const hash = await uploadToIpfs(fileReader.result);

          onUploadMedia(hash);
        } finally {
          setUploading(false);
        }
      };
    } catch (error) {
      message.error('Error adding image');
      console.error('Error adding image:', error);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        ref={inputRef}
      />
      <Button
        type="link"
        disabled={disabled || uploading}
        onClick={() => inputRef.current.click()}
        icon={<FileImageOutlined />}
        loading={uploading}
        {...rest}
      >
        {title}
      </Button>
    </>
  );
};

UploadButton.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string,
  accept: PropTypes.string,
  onUploadMedia: PropTypes.func,
};

UploadButton.defaultProps = {
  disabled: true,
  title: 'Add Image',
  accept: 'image/jpeg,image/png',
  onUploadMedia: null,
};

export default UploadButton;
