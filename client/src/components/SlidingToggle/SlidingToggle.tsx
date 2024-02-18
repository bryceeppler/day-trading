import React, { useState } from 'react';
import styles from './SlidingToggle.module.scss';
import classNames from 'classnames';
import Switch from "react-switch";

interface SlidingToggleProps {
	setToggle: (checked: boolean) => void;
	toggled: boolean;
	leftLabel: string;
	rightLabel: string;
}
const SlidingToggle = ({setToggle, toggled, leftLabel, rightLabel}: SlidingToggleProps) => {
  return (
    <div className={styles.container}>
			<label>{leftLabel}</label>
			<Switch 
				onChange={setToggle} 
				checked={toggled}
				uncheckedIcon={false}
				checkedIcon={false}
				height={15}
				onHandleColor='#caa03d'
				offHandleColor='#caa03d'
				width={45}
				onColor='#888'
				handleDiameter={20}
				 />
			<label>{rightLabel}</label>
		</div>
  );
};

export default SlidingToggle;
