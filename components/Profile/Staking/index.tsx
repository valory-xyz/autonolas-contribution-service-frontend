import { Button, Card, Flex, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import { XProfile } from 'types/x';

import { StakingDetails } from './StakingDetails';

const { Title, Text, Paragraph } = Typography;

const ImageContainer = styled.div`
  img {
    position: relative !important;
  }
`;

const SetupStaking = () => (
  <>
    <ImageContainer>
      <Image src="/images/set-up-staking.png" alt="Staking" layout="fill" objectFit="contain" />
    </ImageContainer>
    <Flex className="mt-24" justify="center">
      <Link href="/staking" passHref>
        <Button type="primary">Set up staking</Button>
      </Link>
    </Flex>
  </>
);

export const Staking = ({ profile }: { profile: XProfile }) => {
  const hasStaked = !!(profile.service_id_old || profile.service_id);

  // TODO: check if service_id_old is terminated (meaning the user went through the recovery process)
  // and clear service_id_old and service_multisig_old

  return (
    <Card bordered={false}>
      <Title level={3} className="mb-8">
        Staking
      </Title>
      <Paragraph type="secondary" className="mb-24">
        Staking allows you to earn OLAS rewards when you post about Olas on X.
      </Paragraph>
      {hasStaked ? <StakingDetails profile={profile} /> : <SetupStaking />}
    </Card>
  );
};
