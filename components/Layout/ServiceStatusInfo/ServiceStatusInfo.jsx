/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Typography, Statistic, Button, Grid,
} from 'antd';
import { ShrinkOutlined } from '@ant-design/icons';
import { isUndefined, isNil } from 'lodash';
import { PoweredBy } from './helpers/PoweredBySvg';
import { MinimizedStatus } from './helpers/MinimizedStatus';
import {
  ContractsInfoContainer,
  Badge,
  NextUpdateTimer,
  OffChainContainer,
  MobileOffChainContainer,
} from './styles';

const { Text } = Typography;
const { Countdown } = Statistic;
const { useBreakpoint } = Grid;

const DotSpace = () => <>&nbsp;&nbsp;•&nbsp;&nbsp;</>;

export const ServiceStatusInfo = ({
  isHealthy,
  secondsLeftReceived,
  extra,
  extraMd,
  onTimerFinish,
  onMinimizeToggle,
}) => {
  const screens = useBreakpoint();
  const isMobile = (screens.xs || screens.sm) && !screens.md;
  const [isMinimized, setIsMinimized] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isUndefined(secondsLeftReceived)) {
      setSeconds(secondsLeftReceived);
    }
  }, [secondsLeftReceived]);

  const timerCountdown = isUndefined(secondsLeftReceived) ? undefined : (
    <Countdown
      value={Date.now() + Math.round(seconds || 0) * 1000}
      format="s"
      suffix="s"
      onFinish={async () => {
        window.console.log('timer completed!');

        // reseting timer to 0 as it is finished
        setSeconds(0);

        if (onTimerFinish) onTimerFinish({ setSeconds });
      }}
      onChange={(e) => setSeconds(parseInt(`${e / 1000}`, 10))}
    />
  );

  /**
   * show operations status (status, timer)
   * even if one of them is defined (hide if both are not defined)
   */
  const showOperationStatus = !isUndefined(isHealthy) || !isUndefined(secondsLeftReceived);

  const actualStatus = isHealthy ? (
    <>
      <span className="dot dot-online" />
      &nbsp;Operational
    </>
  ) : (
    <>
      <span className="dot dot-offline" />
      &nbsp;Disrupted
    </>
  );

  if (isMinimized) {
    return (
      <MinimizedStatus
        isOperational={isHealthy}
        onMaximize={() => {
          setIsMinimized(false);
          if (onMinimizeToggle) onMinimizeToggle(false);
        }}
        timerCountdown={timerCountdown}
      />
    );
  }

  return (
    <ContractsInfoContainer className="serive-status-maximized">
      <Badge>
        <a href="https://autonolas.network" target="_blank" rel="noreferrer">
          <PoweredBy />
        </a>
      </Badge>

      {/* status (green/orange dot) & timers */}
      {isMobile ? (
        <MobileOffChainContainer>
          {!isUndefined(isHealthy) && <div>{actualStatus}</div>}
          <div>{extraMd || extra}</div>
        </MobileOffChainContainer>
      ) : (
        <>
          {showOperationStatus && (
            <OffChainContainer>
              <Text className="status-sub-header">Off-chain Service Status</Text>
              <div className="status-sub-content">
                {!isUndefined(isHealthy) && (
                  <div>
                    {actualStatus}
                    <DotSpace />
                  </div>
                )}

                {!isUndefined(secondsLeftReceived) && (
                  <NextUpdateTimer>
                    Next update:&nbsp;
                    {isNil(seconds) ? '--' : timerCountdown}
                  </NextUpdateTimer>
                )}
              </div>
            </OffChainContainer>
          )}
          {extra}
        </>
      )}

      <Button
        type="link"
        size="small"
        icon={<ShrinkOutlined />}
        onClick={() => {
          setIsMinimized(true);
          if (onMinimizeToggle) onMinimizeToggle(true);
        }}
        className="minimize-btn"
      >
        {isMobile ? '' : 'Minimize'}
      </Button>
    </ContractsInfoContainer>
  );
};
