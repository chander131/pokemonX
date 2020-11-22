import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { string, bool, func, shape, oneOfType, number } from 'prop-types';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';

const Button = ({ text, isDisabled, action, color, icon, typeOfShape, addSpacing, width, isLoading}) => {
	const handleTypeOfShape = () => {
		switch (typeOfShape) {
		case 'icon':
			return styles.btnIcon;
		case 'squared':
			return styles.btnSquared;
		default:
			return styles.btnRoundedContour;
		}
	};

	return (
		<Pressable
			onPress={() => {
				isDisabled || isLoading ? () => { } : action();
			}}
			style={({ pressed }) => ([{
				backgroundColor: pressed
					? 'rgb(210, 230, 255)'
					: color,
			},
			isDisabled && styles.btnDisabled,
			styles.btn,
			handleTypeOfShape(),
			addSpacing && {
				marginHorizontal: 4,
				marginVertical: 20,
			},
			{width},
			])}
		>
			{isLoading ? <ActivityIndicator size='small' color='rgb(210, 230, 255)' /> :
				icon && <Icon name={icon.name} size={22} color={isDisabled ? Colors.MediumGray : icon.color} />}
			{text && (
				<Text
					style={[
						icon && { marginLeft: 10 },
						styles.text,
						isDisabled ? styles.textDisabled : styles.textActive]}
				>{text}</Text>
			)}
		</Pressable>
	);
};

Button.defaultProps = {
	isDisabled: false,
	color: Colors.Salmon,
	typeOfShape: 'rounded-contour',
	addSpacing: true,
	width: '100%',
	action: () => { },
	isLoading: false,
};

Button.propTypes = {
	text: string,
	isDisabled: bool,
	action: func.isRequired,
	color: string,
	icon: shape({
		name: string.isRequired,
		color: string.isRequired,
	}),
	typeOfShape: string,
	addSpacing: bool,
	width: oneOfType([number, string]),
	isLoading: bool,
};

const styles = StyleSheet.create({
	btn: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: 45,
	},
	btnSquared: {
		borderRadius: 4,
		paddingHorizontal: 5,
		paddingVertical: 7,
	},
	btnIcon: {
		borderRadius: 20,
		width: 40,
		height: 40,
	},
	btnRoundedContour: {
		borderRadius: 20,
		paddingHorizontal: 5,
		paddingVertical: 7,
	},
	text:{
		fontFamily: Fonts.MontserratMedium,
		fontSize: normalize(14),
		textAlign: 'center',
	},
	btnDisabled: {
		backgroundColor: Colors.LightGray,
	},
	textActive: {
		color: Colors.White,
	},
	textDisabled: {
		color: Colors.MediumGray,
	},
});

export default Button;
