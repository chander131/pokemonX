import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

import { Fonts } from '@helpers/Fonts';

const Index = ({ navigation }) => {
	const go = screen => navigation.navigate(screen);

	return (
		<View style={styles.body}>
			<Text>Index</Text>
			<Button
				onPress={() => go('Login')}
				title='Login'
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	body: {
		flex: 1,
		padding: 10,
		fontSize: 20,
		fontFamily: Fonts.Titulos,
	},
});

export default withNavigation(Index);
