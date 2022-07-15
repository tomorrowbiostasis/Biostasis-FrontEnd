import {View} from 'native-base';
import React, {VFC} from 'react';
import {TouchableOpacity} from 'react-native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import TrashIcon from '~/assets/icons/TrashIcon';
import colors from '~/theme/colors';
import {
  ISpecificDateComponentItem,
  SpecificDateComponent,
  SpecificDateComponentItemIdType,
} from './SpecificDateComponent';

import styles from './styles';

export interface ISpecificDateListProps {
  items: ISpecificDateComponentItem[];
  onEdit: (id: SpecificDateComponentItemIdType) => void;
  onDelete: (id: SpecificDateComponentItemIdType) => void;
  onSave: (id: ISpecificDateComponentItem) => void;
}

export const SpecificDateList: VFC<ISpecificDateListProps> = ({
  items,
  onDelete,
  onEdit,
  onSave,
}) => {
  return (
    <SwipeListView
      data={items}
      renderItem={data => (
        <SwipeRow rightOpenValue={-50} disableRightSwipe>
          <View style={styles.containerTrash}>
            <TouchableOpacity
              onPress={() => onDelete(data.item.id)}
              style={styles.trash}>
              <TrashIcon color={colors.white} />
            </TouchableOpacity>
          </View>

          <SpecificDateComponent
            key={data.item.id}
            item={data.item}
            onEdit={onEdit}
            onSave={onSave}
          />
        </SwipeRow>
      )}
    />
  );
};
