import React from 'react';
import {
  Card, Checkbox, List, Typography,
} from 'antd/lib';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import data from '../../Plugins/data.json';

const { Text } = Typography;
const { Meta } = List.Item;

const PluginCheckbox = ({ pluginName, enabled }) => (
  <Checkbox disabled checked={enabled} className="mt-4">
    {pluginName}
  </Checkbox>
);

PluginCheckbox.propTypes = {
  pluginName: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

const PluginsCard = ({ currentCentaur }) => (
  <>
    <Card
      title={<EducationTitle title="Plugins" educationItem="plugins" />}
      bodyStyle={{ padding: 0 }}
      className="mb-12"
    >
      <List
        dataSource={data}
        itemLayout="vertical"
        renderItem={(plugin) => (
          <List.Item
            actions={[
              plugin?.link?.url && (
                <Link href={plugin.link.url}>{plugin.link.text}</Link>
              ),
            ]}
            className="plugins-card-list-item"
          >
            <Meta
              title={plugin.title}
              description={(
                <>
                  <Text type="secondary">{plugin.description}</Text>
                  <br />
                  {plugin.title === 'Social Poster' && currentCentaur && (
                    <>
                      <br />
                      Enable daily posts:
                      <br />
                      <PluginCheckbox
                        pluginName="Twitter"
                        enabled={
                          currentCentaur?.configuration?.plugins?.twitter
                            ?.enabled
                        }
                      />
                      <PluginCheckbox
                        pluginName="Orbis"
                        enabled={
                          currentCentaur?.configuration?.plugins?.orbis?.enabled
                        }
                      />
                      <br />
                      <Text type="secondary">
                        {' '}
                        To enable or disable,&nbsp;
                        <a
                          href="https://t.me/+IUnSDNblV6E0MTI0"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          join the Innovataurs Telegram group and ask
                        </a>
                      </Text>
                    </>
                  )}
                </>
              )}
            />
          </List.Item>
        )}
      />
    </Card>
    <Text type="secondary">
      Want to create Centaurs plugins?
      {' '}
      <a
        href="https://t.me/+IUnSDNblV6E0MTI0"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </Text>
  </>
);

PluginsCard.propTypes = {
  currentCentaur: PropTypes.shape({
    configuration: PropTypes.shape({
      plugins: PropTypes.shape({
        twitter: PropTypes.shape({
          enabled: PropTypes.bool,
        }),
        orbis: PropTypes.shape({
          enabled: PropTypes.bool,
        }),
      }),
    }),
  }).isRequired,
};

export default PluginsCard;
