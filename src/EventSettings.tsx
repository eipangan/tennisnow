import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event, EventType, Player } from './models';
import { ThemeType } from './Theme';
import { getNewPlayers, getPlayers, saveEvent, saveMatches } from './utils/EventUtils';
import { shuffle } from './utils/Utils';

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
  event: Event | undefined,
  setEvent: (event: Event) => void,
  onClose: () => void,
}

const EventSettings = (props: EventSettingsProps) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event, setEvent, onClose } = props;

  const [myEvent, setMyEvent] = useState<Event>(event || new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.SINGLES_ROUND_ROBIN,
  }));

  const [players, setPlayers] = useState<Player[]>([]);

  const { Item } = Form;
  const { Option } = Select;
  const { Panel } = Collapse;

  const [form] = Form.useForm();
  const [numPlayers, setNumPlayers] = useState<number>(6);

  const maxNumPlayers = 12;
  const minNumPlayers = 2;
  const playerPrefix = 'player';

  const getUpdatedEvent = (): Event => Event.copyOf(myEvent, (updated) => {
    // update date and time
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

  const getUpdatedPlayers = (myEventID: string): Player[] | undefined => {
    const oldPlayerNames: string[] = [];
    for (let p = 0; p < numPlayers; p += 1) {
      const newPlayerName = form.getFieldValue(`${playerPrefix}${p}`);
      if (newPlayerName && newPlayerName.length > 0) {
        oldPlayerNames.push(newPlayerName);
      } else {
        oldPlayerNames.push(String(p + 1));
      }
    }

    const updatedPlayers = getNewPlayers(myEventID, numPlayers, oldPlayerNames);
    return updatedPlayers;
  };

  // initialize screen (called only once)
  useEffect(() => {
    form.setFieldsValue({
      date: dayjs(myEvent.date),
      time: dayjs(myEvent.date).format('HHmm'),
      type: myEvent.type,
    });

    const fetchPlayers = async () => {
      let fetchedPlayers = await getPlayers(myEvent.id);
      if (fetchedPlayers.length < minNumPlayers) {
        fetchedPlayers = getNewPlayers(myEvent.id);
      }

      setPlayers(fetchedPlayers);
      setNumPlayers(fetchedPlayers.length);
    };

    fetchPlayers();
    return () => { };
  }, [myEvent, form]);

  // whenever players change, update player names
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
            key="type"
            name="type"
          >
            <Select size="large" style={{ width: 270 }}>
              <Option value={EventType.SINGLES_ROUND_ROBIN}>{t(EventType.SINGLES_ROUND_ROBIN)}</Option>
            </Select>
          </Item>
        </div>
        <div className={classes.eventSettingsRow}>
          <Collapse style={{ width: 270 }}>
            <Panel
              className={classes.eventSettingsPlayers}
              collapsible="disabled"
              showArrow={false}
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
            onClick={async () => {
              const okEvent = getUpdatedEvent();
              saveEvent(okEvent);
              saveMatches(okEvent.id);
              setEvent(okEvent);
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
