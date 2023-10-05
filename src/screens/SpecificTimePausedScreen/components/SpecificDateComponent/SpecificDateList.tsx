import React, {VFC} from 'react';
import {
  ISpecificDateComponentItem,
  SpecificDateComponent,
  SpecificDateComponentItemIdType,
} from './SpecificDateComponent';

export interface ISpecificDateListProps {
  items: ISpecificDateComponentItem[];
  onEdit: (id: SpecificDateComponentItemIdType) => void;
  onDelete: (id: SpecificDateComponentItemIdType) => void;
  onSave: (id: ISpecificDateComponentItem) => void;
}

export const SpecificDateList: VFC<ISpecificDateListProps> = ({
  items,
  onEdit,
  onSave,
  onDelete,
}) => {
  return (
    <>
      {items.map(item => (
        <SpecificDateComponent
          key={item.id}
          item={item}
          onEdit={onEdit}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};
