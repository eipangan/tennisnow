/* eslint-disable no-param-reassign */
import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { SelectValue } from 'antd/lib/select';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
import getMatches from '../match/MatchUtils';
import getPlayers from '../player/PlayerUtils';
import getTeams from '../team/TeamUtils';
import { ThemeType } from '../utils/Theme';
import { getLocaleDateFormat, shuffle } from '../utils/Utils';

const DatePicker = React.lazy(() => import('../utils/DatePicker'));

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventSettings: {
    background: 'transparent',
  },
  eventSettingsRow: {
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
  },
  eventSettingsPlayers: {
    background: 'transparent',
    textAlign: 'left',
  },
}));

/**
 * EventSettingsProps
 */
type EventSettingsProps = {
  event: Event,
  isVisible: boolean,
  onClose?: () => void,
  onOk?: (event: Event) => void,
}

/**
 * EventSettings
 *
 * @param props
 */
const EventSettings = (props: EventSettingsProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, isVisible, onClose, onOk } = props;
  const { Panel } = Collapse;
  const { Option } = Select;

  const [myEvent, setMyEvent] = useState<Event>(event);
  const [form] = Form.useForm();

  const maxNumPlayers = 12;
  const minNumPlayers = 4;
  const playerPrefix = 'player';

  /**
   * clearNames
   */
  const clearNames = () => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      updated.players.forEach((player, index) => {
        player.name = String(index + 1);
      });
    }));
  };

  /**
   * randomizeOrder
   */
  const randomizeOrder = () => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      // keep old names
      const oldPlayerNames: string[] = [];
      myEvent.players.forEach((player) => {
        oldPlayerNames.push(player.name);
      });

      // shuffle sequence
      const newPlayerNames = shuffle(oldPlayerNames);

      // update names
      updated.players.forEach((player, index) => {
        player.name = newPlayerNames[index];
      });
    }));
  };

  /**
   * setDate
   *
   * @param d date
   */
  const setDate = (d: Dayjs) => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      updated.date = dayjs(myEvent.date)
        .set('month', d.get('month'))
        .set('date', d.get('date'))
        .set('year', d.get('year'))
        .toISOString();
    }));
  };

  /**
   * setTime
   *
   * @param d date
   */
  const setTime = (d: SelectValue) => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      updated.date = dayjs(myEvent.date)
        .set('hour', parseInt(d.toString().substring(0, 2), 10))
        .set('minute', parseInt(d.toString().substring(2, 5), 10))
        .toISOString();
    }));
  };

  /**
   * setPlayerName
   *
   * @param index index of the player
   * @param name new name
   */
  const setPlayerName = (index: number, name: string) => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      updated.players.forEach((player, myIndex) => {
        if (myIndex === index) {
          player.name = name;
        }
      });
    }));
  };

  /**
   * setNumPlayers
   *
   * @param numPlayers number of players
   */
  const setNumPlayers = (numPlayers: number) => {
    setMyEvent(Event.copyOf(myEvent, (updated) => {
      // keep old names
      const oldPlayerNames: string[] = [];
      myEvent.players.forEach((player) => {
        oldPlayerNames.push(player.name);
      });

      // recreate event
      const players = getPlayers(numPlayers, oldPlayerNames);
      const teams = getTeams(players);
      const matches = getMatches(teams);

      updated.numPlayers = numPlayers;
      updated.players = players;
      updated.teams = teams;
      updated.matches = matches;
    }));
  };

  /**
   * refreshForm
   *
   * @param baseEvent Event object with which to initialize form
   */
  const refreshForm = (baseEvent: Event) => {
    if (baseEvent) {
      form.setFieldsValue({
        date: dayjs(baseEvent.date),
        time: dayjs(baseEvent.date).format('HHmm'),
      });

      baseEvent.players.forEach((player, index) => {
        form.setFieldsValue({
          [`${playerPrefix}${index}`]: player.name,
        });
      });
    }
  };

  useEffect(() => {
    refreshForm(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    refreshForm(myEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myEvent]);

  return (
    <Drawer
      className={classes.eventSettings}
      getContainer={false}
      onClose={onClose}
      placement="right"
      title={t('eventSettings')}
      visible={isVisible}
      width={324}
    >
      <Form
        form={form}
        labelCol={{ span: 0 }}
      >
        <div className={classes.eventSettingsRow}>
          <Form.Item
            key="date"
            name="date"
          >
            <DatePicker
              allowClear={false}
              disabledDate={(current) => current && current < dayjs().add(1, 'hour').startOf('day')}
              format={getLocaleDateFormat()}
              hideDisabledOptions
              inputReadOnly
              size="large"
              onChange={(d) => { if (d) setDate(d); }}
            />
          </Form.Item>
          <div style={{ width: '3px' }} />
          <Form.Item
            key="time"
            name="time"
          >
            <Select
              size="large"
              onChange={(d) => { if (d) setTime(d); }}
            >
              {(() => {
                const children: JSX.Element[] = [];
                let now = dayjs().startOf('day');
                const end = dayjs().add(1, 'day').startOf('day');

                for (now; now.isBefore(end); now = now.add(30, 'minute')) {
                  children.push(
                    <Option
                      key={now.format('HHmm')}
                      value={now.format('HHmm')}
                    >
                      {now.format('LT')}
                    </Option>,
                  );
                }
                return children;
              })()}
            </Select>
          </Form.Item>
        </div>
        <div className={classes.eventSettingsRow}>
          <Collapse defaultActiveKey="players">
            <Panel
              className={classes.eventSettingsPlayers}
              key="players"
              header={(
                <Button type="link" size="large">
                  {t('players', { numPlayers: myEvent.numPlayers })}
                </Button>
              )}
              extra={(
                <ButtonGroup>
                  <Button
                    data-testid="minus"
                    onClick={(e) => {
                      setNumPlayers(Math.max(minNumPlayers, myEvent.numPlayers - 1));
                      e.stopPropagation();
                    }}
                  >
                    <MinusOutlined />
                  </Button>
                  <Button
                    data-testid="plus"
                    onClick={(e) => {
                      setNumPlayers(Math.min(maxNumPlayers, myEvent.numPlayers + 1));
                      e.stopPropagation();
                    }}
                  >
                    <PlusOutlined />
                  </Button>
                </ButtonGroup>
              )}
            >
              <div>
                {myEvent.players.map((player, index) => (
                  <Form.Item
                    key={index.toString()}
                    name={`${playerPrefix}${index}`}
                    style={{ margin: '9px 9px' }}
                  >
                    <Input
                      allowClear
                      onChange={(e) => setPlayerName(index, e.target.value)}
                      placeholder={t('player') + String(index + 1)}
                      size="large"
                    />
                  </Form.Item>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                >
                  <Button
                    type="link"
                    onClick={(e) => {
                      clearNames();
                      e.stopPropagation();
                    }}
                  >
                    {t('clearNames')}
                  </Button>
                  <Button
                    type="link"
                    onClick={(e) => {
                      randomizeOrder();
                      e.stopPropagation();
                    }}
                  >
                    {t('randomizeOrder')}
                  </Button>
                </div>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div style={{ height: '12px' }} />
        <div className={classes.eventSettingsRow}>
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
            shape="round"
          >
            {t('cancel')}
          </Button>
          <div style={{ width: '12px' }} />
          <Button
            icon={<CheckOutlined />}
            shape="round"
            type="primary"
            onClick={() => { if (onOk) onOk(myEvent); }}
          >
            {t('ok')}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default EventSettings;
