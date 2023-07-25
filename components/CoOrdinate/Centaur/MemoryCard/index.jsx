/* eslint-disable no-param-reassign */
import { useState } from 'react';
import {
  Card,
  Button,
  Popconfirm,
  List,
  Modal,
  Input,
  notification,
} from 'antd/lib';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { updateMemoryDetails } from 'common-util/api';
import addActionToCentaur from 'util/addActionToCentaur';
import ExtendedReactMarkdown from 'common-util/ExtendedReactMarkdown';
import { notifyError } from 'common-util/functions';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { AddToMemory } from '../AddToMemory';
import { canAddMemoryMessaage } from '../utils';

const MemoryCard = ({
  memoryDetailsList,
  isAddressPresent,
  currentMemoryDetails,
  fetchedUpdatedMemory,
  centaurId,
}) => {
  const [editingMemory, setEditingMemory] = useState(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [isUpdatingMemory, setIsUpdatingMemory] = useState(false);

  const account = useSelector((state) => state?.setup?.account);
  const membersOfCurrentCentaur = currentMemoryDetails?.members || [];

  const addMemoryErrorMsg = canAddMemoryMessaage(
    membersOfCurrentCentaur,
    account,
  );

  // update the ownership of the person who updated the memory
  const updateMemoryAndOwnership = async (newMemory) => {
    // if the user is not a member of the centaur,
    // don't allow them to update the memory
    if (!isAddressPresent) {
      throw new Error(
        'Only members can update the memory. To update, join this centaur.',
      );
    }

    const updatedMembers = membersOfCurrentCentaur.map((member) => {
      if (member.address === account) {
        return { ...member, ownership: member.ownership + 1 };
      }
      return member;
    });

    // update the members
    currentMemoryDetails.members = updatedMembers;

    // add the new memory to the existing memory
    const updatedMemory = newMemory;
    currentMemoryDetails.memory = [
      ...(currentMemoryDetails.memory || []),
      updatedMemory,
    ];

    const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
      if (centaur.id === centaurId) {
        return currentMemoryDetails;
      }
      return centaur;
    });

    // update the ceramic memory
    const commitId = await updateMemoryDetails(updatedMemoryDetails);
    notification.success({ message: 'Memory updated' });

    // Add action to the centaur
    const action = {
      actorAddress: account,
      commitId,
      description: 'added a memory',
      timestamp: Date.now(),
    };
    await addActionToCentaur(centaurId, action, memoryDetailsList);

    // update the local state with a new memory
    await fetchedUpdatedMemory();

    notification.success({ message: 'Ownership updated' });
  };

  const removeMemoryItem = async (indexToRemove) => {
    if (!isAddressPresent) {
      throw new Error(
        'Only members can modify the memory. To remove memory, join this centaur.',
      );
    }
    currentMemoryDetails.memory = currentMemoryDetails.memory.filter(
      (item, index) => index !== indexToRemove,
    );
    const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
      if (centaur.id === centaurId) {
        return currentMemoryDetails;
      }
      return centaur;
    });

    const commitId = await updateMemoryDetails(updatedMemoryDetails);
    notification.success({ message: 'Memory removed' });

    // Add action to the centaur
    const action = {
      actorAddress: account,
      commitId,
      description: 'removed a memory',
      timestamp: Date.now(),
    };
    await addActionToCentaur(centaurId, action, memoryDetailsList);

    await fetchedUpdatedMemory();
  };

  const clearMemory = async () => {
    if (!isAddressPresent) {
      throw new Error(
        'Only members can modify the memory. To clear memory, join this centaur.',
      );
    }
    currentMemoryDetails.memory = [];
    const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
      if (centaur.id === centaurId) {
        return currentMemoryDetails;
      }
      return centaur;
    });

    const commitId = await updateMemoryDetails(updatedMemoryDetails);
    notification.success({ message: 'Memory cleared' });

    // Add action to the centaur
    const action = {
      actorAddress: account,
      commitId,
      description: 'cleared the memory',
      timestamp: Date.now(),
    };
    await addActionToCentaur(centaurId, action, memoryDetailsList);

    await fetchedUpdatedMemory();
  };

  const handleUpdateMemory = async () => {
    try {
      if (!isAddressPresent) {
        const errorMessage = 'Only members can modify the memory. To update memory, join this centaur.';
        notifyError(errorMessage);
        throw new Error(errorMessage);
      }

      setIsUpdatingMemory(true);

      const updatedMemory = editingMemory.trim();

      currentMemoryDetails.memory = currentMemoryDetails.memory.map(
        (item, index) => (index === currentEditingIndex ? updatedMemory : item),
      );

      const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
        if (centaur.id === centaurId) {
          return currentMemoryDetails;
        }
        return centaur;
      });

      const commitId = await updateMemoryDetails(updatedMemoryDetails);

      // Add action to the centaur
      const action = {
        actorAddress: account,
        commitId,
        description: 'updated a memory',
        timestamp: Date.now(),
      };
      await addActionToCentaur(centaurId, action, memoryDetailsList);

      notification.success({ message: 'Memory updated' });

      // reset the editing state
      setEditingMemory(null);

      // update the local state with the new memory
      await fetchedUpdatedMemory();
    } catch (error) {
      // handle error if needed
      console.error(error);
    } finally {
      setIsUpdatingMemory(false);
    }
  };

  const handleEditMemory = (index) => {
    setCurrentEditingIndex(index);
    setEditingMemory(currentMemoryDetails.memory[index]);
  };

  return (
    <Card
      title={<EducationTitle title="Memory" educationItem="memory" />}
      extra={(
        <AddToMemory
          updateMemoryAndOwnership={updateMemoryAndOwnership}
          addMemoryErrorMsg={addMemoryErrorMsg}
        />
      )}
      bodyStyle={{ padding: 0 }}
      actions={[
        <Popconfirm
          title="Are you sure you want to delete all memory items?"
          onConfirm={clearMemory}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="text" disabled={!account || !!addMemoryErrorMsg}>
            Clear memory
          </Button>
        </Popconfirm>,
      ]}
    >
      <List
        itemLayout="vertical"
        locale={{
          emptyText: !isAddressPresent
            ? 'To see memory, join this centaur'
            : 'No memory items',
        }}
        dataSource={currentMemoryDetails.memory}
        renderItem={(memoryItem, index) => (
          <List.Item
            className="memory-list-item"
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => handleEditMemory(index)}
              />,
              <Popconfirm
                title="Are you sure you want to delete this item?"
                onConfirm={() => removeMemoryItem(index)}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined danger key="remove" />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              description={
                <ExtendedReactMarkdown content={memoryItem} rows={5} />
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Edit Memory"
        visible={!!editingMemory}
        onCancel={() => setEditingMemory(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditingMemory(null)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdateMemory}
            loading={isUpdatingMemory}
          >
            Update
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={12}
          value={editingMemory}
          onChange={(e) => setEditingMemory(e.target.value)}
        />
      </Modal>
    </Card>
  );
};

MemoryCard.propTypes = {
  memoryDetailsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchedUpdatedMemory: PropTypes.func.isRequired,
  centaurId: PropTypes.string.isRequired,
  isAddressPresent: PropTypes.bool.isRequired,
  currentMemoryDetails: PropTypes.shape({
    memory: PropTypes.arrayOf(PropTypes.string),
    members: PropTypes.arrayOf(PropTypes.string),
  }),
};

MemoryCard.defaultProps = {
  currentMemoryDetails: { memory: [] },
};

export default MemoryCard;
