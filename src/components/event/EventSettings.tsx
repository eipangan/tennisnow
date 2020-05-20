import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../AppContext';
import { getMatches, getOrderedMatches } from '../match/Match';
import { getPlayers } from '../player/Player';
import { getTeams } from '../team/Team';
import { ThemeType } from '../utils/Theme';
import { generateUUID, getLocaleDateFormat, shuffle } from '../utils/Utils';
import { EventType } from './Event';

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
 * EventSettings
 *
 * @param props
 */
const EventSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, setEvent, isEventSettingsVisible, setIsEventSettingsVisible } = useContext(AppContext);
  const [myEvent, setMyEvent] = useState<EventType>(cloneDeep(event));
  const { Panel } = Collapse;
  const { Option } = Select;
  const [form] = Form.useForm();

  const maxNumPlayers = 12;
  const minNumPlayers = 4;

  /**
   * clearNames
   */
  const clearNames = () => {
    myEvent.players.forEach((player) => {
      const newPlayerName = '';

      // eslint-disable-next-line no-param-reassign
      player.playerName = newPlayerName;
      form.setFieldsValue({ [`player${player.playerID}`]: newPlayerName });
    });

    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * randomizeOrder
   */
  const randomizeOrder = () => {
    const oldPlayerNames: string[] = [];
    myEvent.players.forEach((player) => {
      oldPlayerNames.push(player.playerName);
    });

    const newPlayerNames = shuffle(oldPlayerNames);
    myEvent.players.forEach((player, index) => {
      const newPlayerName = newPlayerNames[index];

      // eslint-disable-next-line no-param-reassign
      player.playerName = newPlayerName;
      form.setFieldsValue({ [`player${player.playerID}`]: newPlayerName });
    });

    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * setNumPlayers
   *
   * @param numPlayers number of players
   */
  const setNumPlayers = (numPlayers: number) => {
    myEvent.numPlayers = numPlayers;

    const oldPlayers = cloneDeep(myEvent.players);
    myEvent.players = getPlayers(myEvent.numPlayers);
    myEvent.players.forEach((player) => {
      const oldPlayer = oldPlayers.find((thisPlayer) => thisPlayer.playerID === player.playerID);
      if (oldPlayer) {
        // eslint-disable-next-line no-param-reassign
        player.playerName = oldPlayer.playerName;
      }
    });

    myEvent.teams = getTeams(myEvent.players);
    myEvent.matches = getMatches(myEvent.teams);
    myEvent.orderedMatches = getOrderedMatches(
      myEvent.players,
      myEvent.teams,
      myEvent.matches,
    );

    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * setPlayerName
   *
   * @param id id of the player
   * @param name new name
   */
  const setPlayerName = (id: string, name: string) => {
    const myPlayer = myEvent.players.find((player) => player.playerID === id);
    if (myPlayer) {
      myPlayer.playerName = name.trim();
      setMyEvent(cloneDeep(myEvent));
    }
  };

  useEffect(() => {
    if (event) {
      setMyEvent(cloneDeep(event));

      form.setFieldsValue({
        date: dayjs(event.date),
        time: dayjs(event.date).format('HHmm'),
      });

      event.players.forEach((player) => {
        form.setFieldsValue({ [`player${player.playerID}`]: player.playerName });
      });
    }
  }, [event, form]);

  return (
    <Drawer
      className={classes.eventSettings}
      getContainer={false}
      onClose={() => setIsEventSettingsVisible(false)}
      placement="right"
      title={t('eventSettings')}
      visible={isEventSettingsVisible}
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
              onChange={(d) => {
                if (d) {
                  myEvent.date = dayjs(myEvent.date)
                    .set('month', d.get('month'))
                    .set('date', d.get('date'))
                    .set('year', d.get('year'))
                    .toDate();
                }
              }}
            />
          </Form.Item>
          <div style={{ width: '3px' }} />
          <Form.Item
            key="time"
            name="time"
          >
            <Select
              size="large"
              onChange={(d) => {
                myEvent.date = dayjs(myEvent.date)
                  .set('hour', parseInt(d.toString().substring(0, 2), 10))
                  .set('minute', parseInt(d.toString().substring(2, 5), 10))
                  .toDate();
              }}
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
                {myEvent.players.map((player) => (
                  <Form.Item
                    key={`player${player.playerID}`}
                    name={`player${player.playerID}`}
                    style={{ margin: '9px 9px' }}
                  >
                    <Input
                      allowClear
                      onChange={(e) => setPlayerName(player.playerID, e.target.value)}
                      placeholder={t('player') + String(player.playerID)}
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
            onClick={() => setIsEventSettingsVisible(false)}
            shape="round"
          >
            {t('cancel')}
          </Button>
          <div style={{ width: '12px' }} />
          <Button
            icon={<CheckOutlined />}
            shape="round"
            type="primary"
            onClick={() => {
              if (!event.eventID) {
                myEvent.eventID = generateUUID();
              }
              setEvent({ ...myEvent });
              setIsEventSettingsVisible(false);
            }}
          >
            {t('ok')}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default EventSettings;
