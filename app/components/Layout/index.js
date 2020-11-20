import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import Header from './Header';

const Layout = props => {
	const { children } = props;

	return (
		<View style={styles.container}>
			<Header />
			<View style={styles.main} >
				{children}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container:{
		display:'flex',
		flex:1,
		justifyContent:'space-around',
		backgroundColor: '#FFFFFF',
	},
	main:{
		flex:1,
	},
});

export default withNavigation(Layout);
