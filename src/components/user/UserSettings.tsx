import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Drawer } from 'antd';
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
        <AmplifySignOut />
      </AmplifyAuthenticator>
    </Drawer>
  );
};

export default UserSettings;
