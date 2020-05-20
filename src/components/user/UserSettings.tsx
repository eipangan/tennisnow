import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Button, Drawer, Popconfirm, Typography } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../AppContext';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  authPanel: {
    background: 'transparent',
  },
}));

/**
 * UserSettingsProps
 */
type UserSettingsProps = {
  user: CognitoUser | undefined;
};

/**
 * UserSettings
 *
 * @param props
 */
const UserSettings = (props: UserSettingsProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { user } = props;
  const { setIsUserSettingsVisible } = useContext(AppContext);

  return (
    <Drawer
      className={classes.authPanel}
      getContainer={false}
      onClose={() => setIsUserSettingsVisible(false)}
      placement="left"
      title={t('userSettings')}
      visible
    >
      <Typography>
        {user?.getUsername()}
      </Typography>
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
        placement="bottom"
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
