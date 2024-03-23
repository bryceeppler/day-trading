import React, { ReactElement } from 'react';
import styles from './TextField.module.scss';
import classNames from 'classnames';

interface TextFieldProps {
  className?: string;
  value?: string;
  setValue: (value: string) => void;
  label?: string;
  placeholder?: string;
  primary?: boolean;
  optional?: boolean;
  required?: boolean;
  type?: string;
  max?: number;
  extraVerify?: boolean;
  verify?: boolean;
}

function TextField({
  className,
  label,
  value,
  placeholder,
  optional,
  required,
  primary,
  verify,
  extraVerify,
  type = 'text',
  max,
  setValue,
}: Readonly<TextFieldProps>): ReactElement {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return (
    <div className={classNames(styles.container, className)}>
      {label && (
        <label>
          {label}
          {optional && <span>{' (Optional)'}</span>}
          {primary && <span>{' (Default)'}</span>}
          {required && <span className={styles.required}>{' *'}</span>}
        </label>
      )}
      <div>
        <input
          className={classNames(
            verify && (!value || (extraVerify !== undefined ? !extraVerify : false)) && styles.error
          )}
          type={type}
          value={value}
          maxLength={max}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default TextField;
