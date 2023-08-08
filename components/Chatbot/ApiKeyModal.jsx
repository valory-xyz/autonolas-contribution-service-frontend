import React, { useState, useImperativeHandle } from 'react';
import { Input, Modal } from 'antd/lib';
import PropTypes from 'prop-types';

export const ApiKeyModal = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = () => {
    props.onSave();
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleCancel,
  }));

  return (
    <Modal
      title="Set OpenAI API Key"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSave}
      okButtonProps={{ disabled: !props.apiKey }}
    >
      <Input
        type="password"
        placeholder="Enter your OpenAI API Key"
        value={props.apiKey}
        onChange={props.onChange}
      />
    </Modal>
  );
});

ApiKeyModal.propTypes = {
  apiKey: PropTypes.string,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};

ApiKeyModal.defaultProps = {
  apiKey: '',
  onChange: () => {},
  onSave: () => {},
};