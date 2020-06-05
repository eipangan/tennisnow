/* eslint-disable no-param-reassign */
import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Drawer, Form, Input, Select } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import dayjs from 'dayjs';
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

  const [form] = Form.useForm();
  const [numPlayers, setNumPlayers] = useState<number>(event.numPlayers);

  const maxNumPlayers = 12;
  const minNumPlayers = 4;
  const playerPrefix = 'player';

  /**
   * clearNames
   */
  const clearNames = () => {
    for (let p = 0; p < numPlayers; p += 1) {
      form.setFieldsValue({ [`${playerPrefix}${p}`]: '' });
    }
  };

  /**
   * randomizeOrder
   */
  const randomizeOrder = () => {
    // keep old names
    const oldPlayerNames: string[] = [];
    for (let p = 0; p < numPlayers; p += 1) {
      oldPlayerNames.push(form.getFieldValue(`${playerPrefix}${p}`));
    }

    // shuffle sequence
    const newPlayerNames = shuffle(oldPlayerNames);

    // update names
    for (let p = 0; p < numPlayers; p += 1) {
      form.setFieldsValue({ [`${playerPrefix}${p}`]: newPlayerNames[p] });
    }
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

  /**
   * get updated Event based on data in the form
   */
  const getUpdatedEvent = (): Event => Event.copyOf(event, (updated) => {
    // update date and time
    const date = form.getFieldValue('date');
    const time = form.getFieldValue('time');
    updated.date = dayjs(event.date)
      .set('month', date.get('month'))
      .set('date', date.get('date'))
      .set('year', date.get('year'))
      .set('hour', parseInt(time.toString().substring(0, 2), 10))
      .set('minute', parseInt(time.toString().substring(2, 5), 10))
      .toISOString();

    // TODO: keep old names
    const oldPlayerNames: string[] = [];
    for (let p = 0; p < numPlayers; p += 1) {
      oldPlayerNames.push(form.getFieldValue(`${playerPrefix}${p}`));
    }

    // recreate event
    const players = getPlayers(numPlayers, oldPlayerNames);
    const teams = getTeams(players);
    const matches = getMatches(teams);

    updated.players = players;
    updated.teams = teams;
    updated.matches = matches;
  });

  useEffect(() => {
    refreshForm(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

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
            />
          </Form.Item>
          <div style={{ width: '3px' }} />
          <Form.Item
            key="time"
            name="time"
          >
            <Select
              size="large"
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
                      <Form.Item
                        key={p.toString()}
                        name={`${playerPrefix}${p}`}
                        style={{ margin: '9px 9px' }}
                      >
                        <Input
                          allowClear
                          placeholder={t('player') + String(p + 1)}
                          size="large"
                        />
                      </Form.Item>,
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
            onClick={() => { if (onOk) onOk(getUpdatedEvent()); }}
          >
            {t('ok')}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default EventSettings;
