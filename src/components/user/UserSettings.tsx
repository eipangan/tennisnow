import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Popconfirm } from 'antd';
import { Auth } from 'aws-amplify';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../App';
import { ThemeType } from '../utils/Theme';

const useStyles = createUseStyles((theme: ThemeType) => ({
  authPanel: {
    background: 'transparent',
  },
}));

/**
 * UserSettings
 *
 * @param props
 */
const UserSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const {
    isUserSettingsVisible, setIsUserSettingsVisible,
  } = useContext(AppContext);

  return (
    <Drawer
      className={classes.authPanel}
      getContainer={false}
      onClose={() => setIsUserSettingsVisible(false)}
      placement="left"
      title={t('userSettings')}
      visible={isUserSettingsVisible}
      width={240}
    >
      <Popconfirm
        cancelText={t('cancel')}
        icon={<QuestionCircleOutlined />}
        key="signout"
        okText={t('signout')}
        onCancel={(e) => { if (e) e.stopPropagation(); }}
        onConfirm={(e) => {
          Auth.signOut();
          if (e) e.stopPropagation();
        }}
        title={t('signoutConfirm')}
      >
        <Button
          icon={<LogoutOutlined />}
          onClick={(e) => e.stopPropagation()}
          shape="round"
          type="primary"
        >
          {t('signout')}
        </Button>
      </Popconfirm>
    </Drawer>
  );
};

export default UserSettings;
