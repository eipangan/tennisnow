import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Button, Drawer, Popconfirm, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
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
  user?: CognitoUser;
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
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <Drawer
      className={classes.authPanel}
      getContainer={false}
      onClose={() => setIsVisible(false)}
      placement="right"
      title={t('userSettings')}
      visible={isVisible}
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
