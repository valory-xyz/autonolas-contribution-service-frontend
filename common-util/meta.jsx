import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { META_TAGS_INFO } from 'util/constants';

const Meta = ({ meta }) => {
  const metaInfo = meta || META_TAGS_INFO;

  return (
    <Head>
      <title>{metaInfo.title}</title>
      <meta name="title" content={metaInfo.title} />
      <meta name="description" content={metaInfo.description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaInfo.siteUrl} />
      <meta property="og:title" content={metaInfo.title} />
      <meta property="og:description" content={metaInfo.description} />
      <meta property="og:image" content={metaInfo.image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaInfo.siteUrl} />
      <meta property="twitter:title" content={metaInfo.description} />
      <meta property="twitter:description" content={metaInfo.description} />
      <meta property="twitter:image" content={metaInfo.image} />
    </Head>
  );
};

Meta.propTypes = {
  meta: PropTypes.shape({}),
};

Meta.defaultProps = {
  meta: null,
};

export default Meta;
