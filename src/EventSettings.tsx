import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Radio } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event, EventType, Player } from './models';
import { ThemeType } from './Theme';
import { getNewPlayers, saveEvent, saveMatches, savePlayers } from './utils/EventUtils';
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
  players: Player[],
  setPlayers: (players: Player[]) => void,
  onClose: () => void,
}

const EventSettings = (props: EventSettingsProps) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event, setEvent, players, setPlayers, onClose } = props;
  const [myEvent, _] = useState<Event>(new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: event ? event.type : EventType.DOUBLES_ROUND_ROBIN,
  }));

  const [minNumPlayers, setMinNumPlayers] = useState<number>(event && event.type === EventType.SINGLES_ROUND_ROBIN ? 2 : 4);
  const maxNumPlayers = 8;
  const playerPrefix = 'player';

  const [form] = Form.useForm();
  const [numPlayers, setNumPlayers] = useState<number>(players && players.length >= minNumPlayers && players.length <= maxNumPlayers ? players.length : 6);

  const { Item } = Form;
  const { Panel } = Collapse;

  const getOkEvent = (): Event => Event.copyOf(myEvent, (updated) => {
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

  const getUpdatedPlayers = (myEventID: string): Player[] => {
    const oldPlayerNames: string[] = [];
    for (let p = 0; p < numPlayers; p += 1) {
      let newPlayerName = form.getFieldValue(`${playerPrefix}${p}`);
      newPlayerName = newPlayerName ? newPlayerName.trim() : '';
      if (newPlayerName && newPlayerName.length > 0) {
        oldPlayerNames.push(newPlayerName);
      } else {
        oldPlayerNames.push(String(p + 1));
      }
    }

    const updatedPlayers = getNewPlayers(myEventID, numPlayers, oldPlayerNames);
    return updatedPlayers;
  };

  // initialize player names if already exist (called only once)
  useEffect(() => {
    if (players) {
      players.forEach((player, index) => {
        form.setFieldsValue({
          [`${playerPrefix}${index}`]: player.name === String(index + 1) ? '' : player.name,
        });
      });
    }
  }, [form, players]);

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
        initialValues={{
          date: dayjs(myEvent.date),
          time: dayjs(myEvent.date).format('HHmm'),
          type: myEvent.type,
        }}
        onValuesChange={({ type }: { type: EventType }) => {
          switch (type) {
            case EventType.SINGLES_ROUND_ROBIN:
              setMinNumPlayers(2);
              break;
            case EventType.DOUBLES_ROUND_ROBIN:
              setMinNumPlayers(4);
              if (numPlayers < 4) {
                setNumPlayers(4);
              }
              break;
            default:
              break;
          }
        }}
      >
        <div className={classes.eventSettingsRow}>
          <Item
            key="type"
            name="type"
          >
            <Radio.Group size="large">
              <Radio.Button value={EventType.SINGLES_ROUND_ROBIN}>{t(EventType.SINGLES_ROUND_ROBIN)}</Radio.Button>
              <Radio.Button value={EventType.DOUBLES_ROUND_ROBIN}>{t(EventType.DOUBLES_ROUND_ROBIN)}</Radio.Button>
            </Radio.Group>
          </Item>
        </div>
        <div className={classes.eventSettingsRow}>
          <Collapse style={{ width: 270 }} defaultActiveKey={players.find((player) => (player.name && player.name.length > 1)) ? 'players' : undefined}>
            <Panel
              className={classes.eventSettingsPlayers}
              showArrow={false}
              key="players"
              header={(
                <Button type="link">
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
          {event !== undefined ? (
            <Button
              icon={<CloseOutlined />}
              onClick={onClose}
              shape="round"
            >
              {t('cancel')}
            </Button>
          ) : <div />}
          <div style={{ width: '12px' }} />
          <Button
            icon={<CheckOutlined />}
            shape="round"
            type="primary"
            onClick={async () => {
              const okEvent = getOkEvent();
              saveEvent(okEvent);
              setEvent(okEvent);

              const okPlayers = getUpdatedPlayers(okEvent.id);
              savePlayers(okEvent.id, okPlayers);
              setPlayers(okPlayers);

              saveMatches(okEvent, okPlayers);
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
