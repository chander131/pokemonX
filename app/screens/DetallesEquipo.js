import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { useSelector } from 'react-redux';

import Layout from '@components/Layout';

const DetallesEquipo = ({ navigation: { state: { params, routeName } } }) => {

	return (
		<Layout>
			<View style={styles.container}>
				<Text>{routeName}</Text>
			</View>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default withNavigation(DetallesEquipo);