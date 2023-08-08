import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  notification, Menu, Layout,
} from 'antd/lib';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash';

import { areAddressesEqual, getHash, notifyError } from 'common-util/functions';
import { DEFAULT_COORDINATE_ID } from 'util/constants';
import { Members } from './Members/Members';
import GroupChat from './GroupChat';
import { Chat } from './Chat';
import MemoryCard from './MemoryCard';
import PluginsCard from './PluginsCard';
import { menuItems } from './utils';
import { useCentaursFunctionalities } from './hooks';
import { InnerLayoutContainer } from './styles';

const { Sider } = Layout;

const Centaur = () => {
  const router = useRouter();
  const account = useSelector((state) => state?.setup?.account);
  const {
    memoryDetailsList,
    currentMemoryDetails,
    fetchedUpdatedMemory,
    updateMemoryWithNewCentaur,
  } = useCentaursFunctionalities();

  const centaurId = router?.query?.id || DEFAULT_COORDINATE_ID;
  const hash = getHash(router);
  const [currentTab, setCurrentTab] = useState('propose-a-tweet');

  useEffect(() => {
    setCurrentTab(hash || 'propose-a-tweet');
  }, []);

  const membersOfCurrentCentaur = currentMemoryDetails?.members || [];
  const { memberWhitelist } = currentMemoryDetails?.configuration || [];

  const isAddressPresent = membersOfCurrentCentaur?.some((member) => {
    const isEqual = areAddressesEqual(member.address, account);
    return isEqual;
  });

  const addNewMember = async () => {
    const errorMessage = 'Only whitelisted members can take this action';

    const isPermitted = !memberWhitelist?.length
      || memberWhitelist.some((address) => areAddressesEqual(address, account));

    if (!isPermitted) {
      console.error(errorMessage);
      notifyError(errorMessage);
      return;
    }

    const newMember = { address: account, ownership: 0 };
    const updatedMembers = [...(membersOfCurrentCentaur || []), newMember];
    // update the members
    const updatedCentaur = cloneDeep(currentMemoryDetails);
    updatedCentaur.members = updatedMembers;

    // Update the Ceramic stream
    // const commitId = await updateMemoryWithNewCentaur(updatedCentaur);
    await updateMemoryWithNewCentaur(updatedCentaur);
    notification.success({ message: 'Joined coordinate' });

    // Add action to the centaur
    // const action = {
    //   actorAddress: account,
    //   commitId,
    //   description: 'joined the centaur',
    //   timestamp: Date.now(),
    // };

    await fetchedUpdatedMemory();
    // Commenting out until fixed
    // await triggerAction(centaurId, action);
  };

  return (
    <>
      <Layout>
        <Sider width={250} className="border-right">
          <Menu
            items={menuItems}
            mode="inline"
            selectedKeys={[currentTab]}
            defaultOpenKeys={['community-twitter']}
            onClick={(e) => {
              setCurrentTab(e.key);
              router.push(`/coordinate/${centaurId}#${e.key}`);
            }}
          />
        </Sider>

        <Layout style={{ height: 'calc(100vh - 126px)', overflow: 'auto' }}>
          <InnerLayoutContainer currentTab={currentTab}>
            {currentTab === 'home' && (
              <GroupChat
                displayName={account}
                isAddressPresent={isAddressPresent}
                chatEnabled
              />
            )}

            {currentTab === 'chatbot' && (
              <Chat
                name={currentMemoryDetails.name}
                memory={currentMemoryDetails.memory}
              />
            )}

            {currentTab === 'members' && (
              <div className="mb-48">
                <Members
                  members={membersOfCurrentCentaur}
                  addNewMember={addNewMember}
                />
              </div>
            )}

            {currentTab === 'plugins' && (
              <PluginsCard currentCentaur={currentMemoryDetails} />
            )}

            {currentTab === 'memory' && (
              <MemoryCard
                memoryDetailsList={memoryDetailsList}
                isAddressPresent={isAddressPresent}
                currentMemoryDetails={currentMemoryDetails}
                fetchedUpdatedMemory={fetchedUpdatedMemory}
                centaurId={centaurId}
              />
            )}
          </InnerLayoutContainer>
        </Layout>
      </Layout>
    </>
  );
};

export default Centaur;
