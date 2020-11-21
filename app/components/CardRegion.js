import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { string, func, number } from 'prop-types';
import { getColor, cardColors } from '@helpers/style/setPatternColor';
import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';

const Card = ({ text, action, color, index }) => {
	return (
		<TouchableOpacity
			onPress={action}
			style={[styles.card, {backgroundColor: color ? color : cardColors[getColor(index)]}]}
		>
			<Text style={styles.cardText}>{text}</Text>
		</TouchableOpacity>
	);
};

Card.defaultProps = {
	action: () => { },
};

Card.propTypes = {
	text: string.isRequired,
	action: func,
	color: string,
	index: number,
};

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '46%',
		height: 85,
		borderRadius: 12,
		marginTop: 7,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	cardText: {
		fontSize: 15,
		textTransform: 'capitalize',
		color: Colors.White,
		fontFamily: Fonts.MontserratBold,
	},
});

export default Card;
