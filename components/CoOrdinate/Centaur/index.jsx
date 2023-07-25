import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography, notification, Menu, Layout,
} from 'antd/lib';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash';

import {
  areAddressesEqual,
  getHash,
  isDevOrStaging,
  notifyError,
} from 'common-util/functions';
import { DEFAULT_COORDINATE_ID } from 'util/constants';
import WhitelistForm from './Members/WhitelistForm';
import { Members } from './Members/Members';
import GroupChat from './GroupChat';
import { Chat } from './Chat';
import MemoryCard from './MemoryCard';
import PluginsCard from './PluginsCard';
import MemberWhitelist from './Members/MemberWhitelist';
import Proposals from './Proposals';
import { SocialPoster } from './SocialPoster';
import { menuItems } from './utils';
import { useCentaursFunctionalities } from './hooks';
import { MainTitle, InnerLayoutContainer } from './styles';

const { Title, Text } = Typography;
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
  const [currentTab, setCurrentTab] = useState('home');

  useEffect(() => {
    setCurrentTab(hash || 'home');
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
    notification.success({ message: 'Joined centaur' });

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
      <MainTitle className="py-12 border-bottom">
        <Title level={4} className="mb-0 mr-12 pl-24">
          {currentMemoryDetails.name}
        </Title>
        <Text type="secondary">
          {` · ${currentMemoryDetails?.members?.length || 0} members`}
        </Text>
      </MainTitle>

      <Layout>
        <Sider width={250} className="border-right">
          <Menu
            items={menuItems}
            mode="inline"
            selectedKeys={[currentTab]}
            defaultOpenKeys={['home', 'plugins']}
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

            {currentTab === 'proposals' && (
              <Proposals
                centaur={currentMemoryDetails}
                isAddressPresent={isAddressPresent}
                fetchedUpdatedMemory={fetchedUpdatedMemory}
              />
            )}

            {currentTab === 'chatbot' && (
              <Chat
                name={currentMemoryDetails.name}
                memory={currentMemoryDetails.memory}
              />
            )}

            {currentTab === 'social-poster' && (
              <SocialPoster isAddressPresent={isAddressPresent} />
            )}

            {currentTab === 'members' && (
              <>
                <div className="mb-48">
                  <Members
                    members={membersOfCurrentCentaur}
                    addNewMember={addNewMember}
                    memberWhitelist={memberWhitelist}
                  />
                </div>

                {memberWhitelist?.length >= 1 && (
                  <div className="mb-48">
                    <MemberWhitelist members={memberWhitelist} />
                  </div>
                )}

                {isDevOrStaging && (
                  <div className="mb-48">
                    <WhitelistForm
                      currentCentaur={currentMemoryDetails}
                      centaursList={memoryDetailsList}
                      centaurId={centaurId}
                      isPermitted
                    />
                  </div>
                )}
              </>
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
