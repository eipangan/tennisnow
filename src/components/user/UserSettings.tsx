import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { Button, Popconfirm } from 'antd';
import { Auth } from 'aws-amplify';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
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

  return (
    <div className={classes.authPanel}>
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
    </div>
  );
};

export default UserSettings;
