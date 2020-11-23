import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from './Header';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';

const Layout = props => {
	const {
		children,
		navigation,
		navigation: { navigate, state: { params, routeName }},
	} = props;

	const SubHeader = ({}) => (
		<View style={styles.subHeader}>
			{routeName !== 'Regiones' && <Icon
				onPress={() => navigation.goBack()}
				name='arrow-left'
				size={30}
				color={Colors.DarkGray}
			/>}
			<Text style={styles.txtRoute}>{routeName}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<Header />
			<SubHeader />
			<View style={styles.main} >
				{children}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:'space-around',
		backgroundColor: '#FFFFFF',
	},
	main:{
		flex:1,
	},
	subHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	txtRoute: {
		fontSize: normalize(24),
		fontFamily: Fonts.MuliBold,
		color: Colors.DarkGray,
		marginLeft: 5,
	},
});

export default withNavigation(Layout);
