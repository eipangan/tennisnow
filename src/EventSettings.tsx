import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { DatePicker } from './components';
import { getNewPlayers, getPlayers } from './EventUtils';
import { Event, EventType, Player } from './models';
import { ThemeType } from './Theme';
import { getLocaleDateFormat, shuffle } from './Utils';

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
  onClose?: () => void,
  onOk?: (event: Event, players: Player[]) => void,
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

  const { event, onClose, onOk } = props;

  const { Item } = Form;
  const { Option } = Select;
  const { Panel } = Collapse;

  const [form] = Form.useForm();
  const [players, setPlayers] = useState<Player[]>();
  const [numPlayers, setNumPlayers] = useState<number>(6);

  const maxNumPlayers = 12;
  const minNumPlayers = 4;
  const playerPrefix = 'player';

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * get updated Event based on data in the form
   */
  const getUpdatedEvent = (): Event => Event.copyOf(event, (updated) => {
    // update date and time
    const date = form.getFieldValue('date');
    const time = form.getFieldValue('time');
    updated.date = dayjs(event.date)
      .set('month', date.get('month'))
      .set('date', date.get('date'))
      .set('year', date.get('year'))
      .set('hour', parseInt(time.toString().substring(0, 2), 10))
      .set('minute', parseInt(time.toString().substring(2, 5), 10))
      .toISOString();
    updated.type = form.getFieldValue('type');
    updated.summary = t('eventSummary', { numPlayers });
  });

  /**
   * get updated players
   *
   * @param eventID
   */
  const getUpdatedPlayers = (eventID: string): Player[] | undefined => {
    // keep default or old names
    const oldPlayerNames: string[] = [];
    for (let p = 0; p < numPlayers; p += 1) {
      const newPlayerName = form.getFieldValue(`${playerPrefix}${p}`);
      if (newPlayerName && newPlayerName.length > 0) {
        oldPlayerNames.push(newPlayerName);
      } else {
        oldPlayerNames.push(String(p + 1));
      }
    }

    // return update players
    return getNewPlayers(event.id, numPlayers, oldPlayerNames);
  };

  /**
   * Loader
   */
  const Loader = (): JSX.Element => {
    if (!isLoading) return <></>;
    return (
      <div className="loader" />
    );
  };

  /**
   * whenever event changes
   */
  useEffect(() => {
    form.setFieldsValue({
      date: dayjs(event.date),
      time: dayjs(event.date).format('HHmm'),
      type: event.type,
    });

    const fetchPlayers = async () => {
      setIsLoading(true);
      let fetchedPlayers = await getPlayers(event.id);
      if (fetchedPlayers.length < minNumPlayers) {
        fetchedPlayers = getNewPlayers(event.id);
      }
      setPlayers(fetchedPlayers);
      setNumPlayers(fetchedPlayers.length);
      setIsLoading(false);
    };

    fetchPlayers();
  }, [event.date, event.id, event.type, form]);

  /**
   * whenever players change
   */
  useEffect(() => {
    if (players) {
      players.forEach((player, index) => {
        form.setFieldsValue({
          [`${playerPrefix}${index}`]: player.name === String(index + 1) ? '' : player.name,
        });
      });
    }
  }, [players, form]);

  return (
    <Drawer
      className={classes.eventSettings}
      getContainer={false}
      onClose={onClose}
      placement="right"
      title={t('eventSettings')}
      visible
      width={324}
    >
      <Loader />
      <Form
        form={form}
        labelCol={{ span: 0 }}
      >
        <div className={classes.eventSettingsRow}>
          <Item
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
            />
          </Item>
          <div style={{ width: '3px' }} />
          <Item
            key="time"
            name="time"
          >
            <Select size="large">
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
          </Item>
        </div>
        <div className={classes.eventSettingsRow}>
          <Item
            key="type"
            name="type"
          >
            <Select style={{ width: 270 }}>
              <Option value={EventType.GENERIC_EVENT}>{t(EventType.GENERIC_EVENT)}</Option>
              <Option value={EventType.SINGLES_ROUND_ROBIN}>{t(EventType.SINGLES_ROUND_ROBIN)}</Option>
              <Option value={EventType.FIX_DOUBLES_ROUND_ROBIN}>{t(EventType.FIX_DOUBLES_ROUND_ROBIN)}</Option>
              <Option value={EventType.SWITCH_DOUBLES_ROUND_ROBIN}>{t(EventType.SWITCH_DOUBLES_ROUND_ROBIN)}</Option>
            </Select>
          </Item>
        </div>
        <div className={classes.eventSettingsRow}>
          <Collapse defaultActiveKey="players">
            <Panel
              className={classes.eventSettingsPlayers}
              key="players"
              header={(
                <Button type="link" size="large">
                  {t('players', { numPlayers })}
                </Button>
              )}
              extra={(
                <ButtonGroup>
                  <Button
                    data-testid="minus"
                    onClick={(e) => {
                      setNumPlayers(Math.max(minNumPlayers, numPlayers - 1));
                      e.stopPropagation();
                    }}
                  >
                    <MinusOutlined />
                  </Button>
                  <Button
                    data-testid="plus"
                    onClick={(e) => {
                      setNumPlayers(Math.min(maxNumPlayers, numPlayers + 1));
                      e.stopPropagation();
                    }}
                  >
                    <PlusOutlined />
                  </Button>
                </ButtonGroup>
              )}
            >
              <div>
                {(() => {
                  const playerInputBox = [];
                  for (let p = 0; p < numPlayers; p += 1) {
                    playerInputBox.push(
                      <Item
                        key={p.toString()}
                        name={`${playerPrefix}${p}`}
                        style={{ margin: '9px 9px' }}
                      >
                        <Input
                          allowClear
                          placeholder={t('player') + String(p + 1)}
                          size="large"
                        />
                      </Item>,
                    );
                  }
                  return playerInputBox;
                })()}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                >
                  <Button
                    type="link"
                    onClick={(e) => {
                      for (let p = 0; p < numPlayers; p += 1) {
                        form.setFieldsValue({ [`${playerPrefix}${p}`]: '' });
                      }
                      e.stopPropagation();
                    }}
                  >
                    {t('clearNames')}
                  </Button>
                  <Button
                    type="link"
                    onClick={(e) => {
                      const oldPlayerNames: string[] = [];
                      for (let p = 0; p < numPlayers; p += 1) {
                        oldPlayerNames.push(form.getFieldValue(`${playerPrefix}${p}`));
                      }
                      const newPlayerNames = shuffle(oldPlayerNames);
                      for (let p = 0; p < numPlayers; p += 1) {
                        form.setFieldsValue({ [`${playerPrefix}${p}`]: newPlayerNames[p] });
                      }
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
            onClick={() => {
              if (onOk) {
                const okEvent = getUpdatedEvent();
                const okPlayers = getUpdatedPlayers(okEvent.id);

                onOk(okEvent, okPlayers || []);
              }
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
