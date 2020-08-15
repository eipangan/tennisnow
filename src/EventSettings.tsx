import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { DatePicker } from './components';
import { getEvent, getNewEvent, getNewPlayers, getPlayers, saveEvent, savePlayers } from './EventUtils';
import { Event, EventType, Player } from './models';
import { ThemeType } from './Theme';
import { getLocaleDateFormat, isEmpty, shuffle } from './Utils';

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
  eventID: string,
  onClose: () => void,
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

  const { eventID, onClose } = props;

  const [event, setEvent] = useState<Event>();
  const [players, setPlayers] = useState<Player[]>([]);

  const { Item } = Form;
  const { Option } = Select;
  const { Panel } = Collapse;

  const [form] = Form.useForm();
  const [numPlayers, setNumPlayers] = useState<number>(6);

  const maxNumPlayers = 12;
  const minNumPlayers = 2;
  const playerPrefix = 'player';

  /**
   * get updated Event based on data in the form
   */
  const getUpdatedEvent = (): Event => Event.copyOf(event || getNewEvent(), (updated) => {
    // update date and time
    const date = form.getFieldValue('date');
    const time = form.getFieldValue('time');
    updated.date = dayjs()
      .set('month', date.get('month'))
      .set('date', date.get('date'))
      .set('year', date.get('year'))
      .set('hour', parseInt(time.toString().substring(0, 2), 10))
      .set('minute', parseInt(time.toString().substring(2, 5), 10))
      .toISOString();

    const eventType = form.getFieldValue('type');
    const eventTypeStr = t(eventType);
    updated.type = eventType;
    updated.summary = t('eventSummary', { eventTypeStr, numPlayers });
  });

  /**
   * get updated players
   *
   * @param eventID
   */
  const getUpdatedPlayers = (myEventID: string): Player[] | undefined => {
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
    const updatedPlayers = getNewPlayers(myEventID, numPlayers, oldPlayerNames);
    return updatedPlayers;
  };

  /**
   * whenever eventID changes
   */
  useEffect(() => {
    const fetchEvent = async (id: string) => {
      let myEvent: Event;

      if (!id) {
        myEvent = getNewEvent();
      } else {
        const fetchedEvent = await getEvent(id);
        if (!fetchedEvent || isEmpty(fetchedEvent)) {
          myEvent = getNewEvent();
        } else {
          myEvent = fetchedEvent;
        }
      }

      setEvent(myEvent);
      if (myEvent) {
        form.setFieldsValue({
          date: dayjs(myEvent.date),
          time: dayjs(myEvent.date).format('HHmm'),
          type: myEvent.type,
        });
      }
    };

    fetchEvent(eventID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventID]);

  // whenever event changes
  useEffect(() => {
    if (!event) return () => { };
    const fetchPlayers = async () => {
      let fetchedPlayers = await getPlayers(event.id);
      if (fetchedPlayers.length < minNumPlayers) {
        fetchedPlayers = getNewPlayers(event.id);
      }

      setPlayers(fetchedPlayers);
      setNumPlayers(fetchedPlayers.length);
    };

    fetchPlayers();
    return () => { };
  }, [event]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

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
            <Select size="large" style={{ width: 270 }}>
              <Option value={EventType.GENERIC_EVENT}>{t(EventType.GENERIC_EVENT)}</Option>
              <Option value={EventType.SINGLES_ROUND_ROBIN}>{t(EventType.SINGLES_ROUND_ROBIN)}</Option>
              {/* <Option value={EventType.FIX_DOUBLES_ROUND_ROBIN}>{t(EventType.FIX_DOUBLES_ROUND_ROBIN)}</Option> */}
              {/* <Option value={EventType.SWITCH_DOUBLES_ROUND_ROBIN}>{t(EventType.SWITCH_DOUBLES_ROUND_ROBIN)}</Option> */}
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
              <>
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
              </>
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
              const okEvent = getUpdatedEvent();
              saveEvent(okEvent)
                .then(() => {
                  const okPlayers = getUpdatedPlayers(okEvent.id);
                  savePlayers(okEvent.id, okPlayers || []);
                });

              onClose();
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
