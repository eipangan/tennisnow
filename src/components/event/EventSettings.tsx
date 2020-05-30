import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
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

type EventSettingsProps = {
  event: Event,
  onUpdate?: () => void
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

  const { event } = props;
  const [myEvent, setMyEvent] = useState<Event>(cloneDeep(event));
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

      form.setFieldsValue({ [`player${player.id}`]: newPlayerName });
    });

    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * randomizeOrder
   */
  const randomizeOrder = () => {
    const oldPlayerNames: string[] = [];
    myEvent.players.forEach((player) => {
      oldPlayerNames.push(player.name);
    });

    const newPlayerNames = shuffle(oldPlayerNames);
    myEvent.players.forEach((player, index) => {
      const newPlayerName = newPlayerNames[index];

      form.setFieldsValue({ [`player${player.id}`]: newPlayerName });
    });

    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * setNumPlayers
   *
   * @param numPlayers number of players
   */
  const setNumPlayers = (numPlayers: number) => {
    setMyEvent(cloneDeep(myEvent));
  };

  /**
   * setPlayerName
   *
   * @param id id of the player
   * @param name new name
   */
  const setPlayerName = (id: string, name: string) => {
    const myPlayer = myEvent.players.find((player) => player.id === id);
    if (myPlayer) {
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
        form.setFieldsValue({ [`player${player.id}`]: player.name });
      });
    }
  }, [event, form]);

  return (
    <Drawer
      className={classes.eventSettings}
      getContainer={false}
      onClose={() => {}}
      placement="right"
      title={t('eventSettings')}
      visible
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
              onChange={(d) => { }}
            />
          </Form.Item>
          <div style={{ width: '3px' }} />
          <Form.Item
            key="time"
            name="time"
          >
            <Select
              size="large"
              onChange={(d) => { }}
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
                    name={`player${index.toString()}`}
                    style={{ margin: '9px 9px' }}
                  >
                    <Input
                      allowClear
                      onChange={(e) => setPlayerName(player.id, e.target.value)}
                      placeholder={t('player') + String(player.id)}
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
            onClick={() => {}}
            shape="round"
          >
            {t('cancel')}
          </Button>
          <div style={{ width: '12px' }} />
          <Button
            icon={<CheckOutlined />}
            shape="round"
            type="primary"
            onClick={() => { }}
          >
            {t('ok')}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default EventSettings;
