import Colors from '@helpers/Colors';
import { normalize } from '@helpers/dimensions';
import { Fonts } from '@helpers/Fonts';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmptyList = () => (
	<View style={styles.emptyList}>
		<Icon name='ellipsis-h' size={30} color={Colors.MediumGray} />
		<Text style={[styles.text, styles.emptyText]}>Lista vacía</Text>
	</View>
);

const styles = StyleSheet.create({
	text:{
		fontFamily: Fonts.MontserratRegular,
	},
	emptyList: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 150,
	},
	emptyText: {
		fontSize: normalize(16),
		color: Colors.MediumGray,
	},
});

export default EmptyList;
