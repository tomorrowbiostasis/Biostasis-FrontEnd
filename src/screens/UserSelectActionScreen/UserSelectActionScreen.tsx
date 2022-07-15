import React, {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'native-base';
import {ImageSourcePropType} from 'react-native';

import {useNavigateToAddEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import Container from '~/components/Container';
import SelectItem from './components/SelectItem';

import styles from './styles';

type Action = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
};

const UserSelectActionScreen = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const addEmergencyContactScreenName =
    useNavigateToAddEmergencyContactScreenName();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const actionList = useMemo<Action[]>(
    () => [
      {
        title: t('selectAction.signUpForTheCryopreservation.title'),
        description: t('selectAction.signUpForTheCryopreservation.description'),
        icon: require('~/assets/icons/ClipboardWithPen.png'),
      },
      {
        title: t('selectAction.storeCrypreservationContract.title'),
        description: t('selectAction.storeCrypreservationContract.description'),
        icon: require('~/assets/icons/Clipboard.png'),
      },
      {
        title: t('selectAction.useAppForEmergencyManagement.title'),
        description: t('selectAction.useAppForEmergencyManagement.description'),
        icon: require('~/assets/icons/Siren.png'),
      },
    ],
    [t],
  );

  const handleContinuePress = useCallback(() => {
    switch (selectedIndex) {
      case 0:
        //FIXME: navigate to sign up for cryopreservation
        break;
      case 1:
        reset({
          index: 1,
          routes: [
            {name: 'Home'},
            {
              name: addEmergencyContactScreenName,
            },
          ],
        });
        break;
      case 2:
        reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        break;
    }
  }, [addEmergencyContactScreenName, reset, selectedIndex]);

  return (
    <Container title={t('selectAction.whatToDo')}>
      {actionList.map((item, index) => (
        <SelectItem
          key={`${index}`}
          icon={item.icon}
          title={item.title}
          description={item.description}
          selected={selectedIndex === index}
          onSelect={() => setSelectedIndex(index)}
        />
      ))}

      <Button
        disabled={selectedIndex === null}
        style={styles.button}
        onPress={handleContinuePress}>
        {t('common.continue')}
      </Button>
    </Container>
  );
};

export default UserSelectActionScreen;
