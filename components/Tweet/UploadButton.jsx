import { useState, useRef } from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadToIpfs } from './utils';

const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png'];
const MAX_IMAGE_SIZE_IN_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_IN_MB * 1024 * 1024;
const ACCEPT = SUPPORTED_FILE_TYPES.join(',');

const UploadButton = ({
  disabled,
  title,
  onUploadMedia,
  ...rest
}) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileInputChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!SUPPORTED_FILE_TYPES.contains(file.type)) {
        message.error('Unsupported file type. Please select an image file.');
        return;
      }

      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        message.error(`File size limit is ${MAX_IMAGE_SIZE_IN_MB} MB. Please select a smaller file.`);
        return;
      }

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
        accept={ACCEPT}
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
  onUploadMedia: PropTypes.func,
};

UploadButton.defaultProps = {
  disabled: true,
  title: 'Add Image',
  onUploadMedia: null,
};

export default UploadButton;
