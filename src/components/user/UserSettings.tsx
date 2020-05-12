import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
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
    isAuthVisible, setIsAuthVisible,
  } = useContext(AppContext);

  return (
    <Drawer
      className={classes.authPanel}
      getContainer={false}
      onClose={() => setIsAuthVisible(false)}
      placement="left"
      title={t('userSettings')}
      visible={isAuthVisible}
      width={360}
    >
      <AmplifyAuthenticator>
        <Popconfirm
          cancelText={t('cancel')}
          icon={<QuestionCircleOutlined />}
          key="logout"
          okText={t('logout')}
          onCancel={(e) => { if (e) e.stopPropagation(); }}
          onConfirm={(e) => {
            Auth.signOut();
            if (e) e.stopPropagation();
          }}
          title={t('logoutConfirm')}
        >
          <Button
            icon={<LogoutOutlined />}
            onClick={(e) => e.stopPropagation()}
            type="primary"
          >
            {t('logout')}
          </Button>
        </Popconfirm>
      </AmplifyAuthenticator>
    </Drawer>
  );
};

export default UserSettings;
