import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { string } from 'prop-types';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';

const Badge = ({text, color}) => (
	<View style={[styles.typeItem, {borderColor: color}]}>
		<Text style={[styles.text, styles.typeText, {color: color}]}>
			{text}
		</Text>
	</View>
);

Badge.propTypes = {
	text: string.isRequired,
	color: string.isRequired,
};

const styles = StyleSheet.create({
	text:{
		fontFamily: Fonts.MontserratRegular,
	},
	typeItem: {
		borderRadius: 20,
		borderWidth: 1,
		paddingHorizontal: 20,
		margin: 5,
	},
	typeText: {
		fontSize: normalize(12),
		textTransform: 'capitalize',
	},
});

export default Badge;
