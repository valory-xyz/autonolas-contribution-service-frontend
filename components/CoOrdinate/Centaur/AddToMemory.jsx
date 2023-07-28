import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Input } from 'antd/lib';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';

export const AddToMemory = ({
  updateMemoryAndOwnership,
  addMemoryErrorMsg,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(async () => {
      // update memory and ownership
      await updateMemoryAndOwnership(input);

      // reset state
      setLoading(false);
      setOpen(false);
      setInput(null);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} disabled={!!addMemoryErrorMsg}>
        <SaveOutlined />
        &nbsp;Add to Memory
      </Button>

      {open && (
        <Modal
          visible={open}
          title="Add to memory"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              disabled={!input}
              onClick={handleOk}
              icon={<PlusOutlined />}
            >
              Add
            </Button>,
          ]}
        >
          <Input.TextArea
            rows={12}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </Modal>
      )}
    </>
  );
};

AddToMemory.propTypes = {
  updateMemoryAndOwnership: PropTypes.func.isRequired,
  addMemoryErrorMsg: PropTypes.string,
};

AddToMemory.defaultProps = {
  addMemoryErrorMsg: null,
};
