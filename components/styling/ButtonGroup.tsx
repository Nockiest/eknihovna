import React from 'react';
import { Box, Button } from '@mui/material';

type ButtonGroupProps = {
  buttons: Array<{
    text: string;
    onClick: () => void;
  }>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  buttonStyles?: string;
  activeButtonStyles?: string
  inactiveOpacity?: string;
};


const CustomButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  activeIndex,
  setActiveIndex, // it usefull to move active index upwards
  buttonStyles = '',
  activeButtonStyles = '',
  inactiveOpacity = '0.5',
}) => {
  return (
    <Box className={`flex gap-4 p-4 bg-gray-200 rounded-md justify-center`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={() => {
            button.onClick();
            setActiveIndex(index);
          }}
          className={`${buttonStyles} ${activeIndex === index ? `${activeButtonStyles} opacity-${inactiveOpacity}  ` : ''}`}
        >
          {button.text}
        </Button>
      ))}
    </Box>
  );
};

export default CustomButtonGroup;
