import React, { ReactElement } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

export enum BUTTON_TYPE {
  SOLID = 'solid',
  OUTLINED = 'outlined',
  GREY_OUTLINED = 'greyOutlined',
  WHITE = 'white',
}

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  label: string;
  style?: BUTTON_TYPE;
  disabled?: boolean;
}

function Button({
  onClick,
  label,
  disabled,
  className,
  style = BUTTON_TYPE.SOLID,
}: Readonly<ButtonProps>): ReactElement {
  return (
    <button
      disabled={disabled}
      className={classNames(styles.button, styles[style], className, disabled && styles.disabled)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
