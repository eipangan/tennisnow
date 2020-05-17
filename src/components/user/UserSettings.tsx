import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { Button, Popconfirm, Drawer } from 'antd';
import { Auth } from 'aws-amplify';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { ThemeType } from '../utils/Theme';
import { AppContext } from '../../App';

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
      width={360}
    >
      <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignIn slot="sign-in" />
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
      </AmplifyAuthenticator>
    </Drawer>
  );
};

export default UserSettings;
