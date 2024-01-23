import React from 'react';
import { IconButton, type IconButtonProps } from 'react-native-paper';
interface MenuButtonProps extends IconButtonProps {
  isActive?: boolean;
}
const MenuButton = ({ isActive, ...props }: MenuButtonProps) => {
  return (
    <IconButton
      size={18}
      mode={isActive ? 'contained' : 'outlined'}
      {...props}
    />
  );
};

export default MenuButton;
