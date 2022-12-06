import { Fragment } from 'react';
import { Typography } from 'antd/lib';
import { Footnote } from '../styles';

const { Title } = Typography;

const DATA = [
  {
    name: '//001',
    desc: 'Users contribute ETH to fund the current collection. They receive collection fractions (in the form of tokens), proportional to the amount of funds they contributed',
  },
  {
    name: '//002',
    desc: 'These fractions can be used to vote on the minimum price at which the collection can be sold (reserve price) on fractional.art',
  },
  {
    name: '//003',
    desc: 'El Collectooorr uses the ETH to mint NFTs from various new drops on Art Blocks.',
  },
  {
    name: '//004',
    desc: 'It continues to add NFTs to the collection until it has spent the total budget (here, 10 ETH) or until the collection has been sold on fractional (at or above the reserve price)',
  },
  {
    name: '//005',
    desc: 'If the target budget of 10 ETH is reached, this should mean that the entire supply of collection fractions is distributed pro rata to those who funded the collection. Collectively, they should have full control of the reserve price, and should be able to use their fractions to vote via fractional.art. In the event that a collection is sold, fraction holders can claim their share of the proceeds, again through fractional.art.',
  },
  {
    name: '//006',
    desc: 'Once El Collectooorr finishes collecting for one collection, it may begin collecting for a new one and the cycle repeats',
  },
];

const Actions = () => (
  <div id="section-actions">
    <Title level={2}>Actions</Title>
    <br />
    <p>
      The current configuration of the application aims to produce a user flow
      that proceeds as follows:
    </p>
    <Footnote>
      We make no guarantees or warranties that the implementation matches the
      documentation.
    </Footnote>
    <br />

    {DATA.map(({ name, desc }, index) => (
      <Fragment key={`user-flow-${index}`}>
        <div className="green-text-2">{name}</div>
        <p>{desc}</p>
        <br />
      </Fragment>
    ))}

    <br />
    <div className="img-wrapper">
      <img
        src="/images/Documentation/el-col-how-it-works.png"
        alt="How El Collectooorr works"
        loading="lazy"
      />
    </div>
    <br />
    <br />
  </div>
);

export default Actions;
