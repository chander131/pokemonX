import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import { useDispatch } from 'react-redux';

import Layout from '@components/Layout';
import CardRegion from '@components/CardRegion';

import useDataApi from '@hooks/useDataApi';
import { urlRegion } from '@config/pathsPokeApi';
import { normalize } from '@helpers/dimensions';
import { Fonts } from '@helpers/Fonts';
import Colors from '@helpers/Colors';

const Regiones = ({ navigation }) => {
	const dispatch = useDispatch();
	const [data, setData] = useState([]);

	const [state, fetchData] = useDataApi({
		url: urlRegion(),
		headers: null,
		hasCache: true,
	});

	useEffect(() => {
		if (!state.isLoading) {
			if (state.isSuccess && state.data) {
				console.log('data api', state.data.results);
				setData(state.data.results);
			}
		}
	}, [state.isSuccess, state.isError]);

	useEffect(() => {
		fetchData();
		// Linking.getInitialURL().then(url => {
		// 	if (url) {urlHandler(url);}
		// });
		// Linking.addEventListener('url', handleOpenUrl);
		// return ()=> Linking.removeEventListener('url', handleOpenUrl);

	}, []);

	return (
		<Layout>
			<View style={styles.container}>
				<Text style={styles.titulo}>Regiones</Text>
				<View style={styles.containerCard}>
					{data.map(({ name }, i) => (
						<CardRegion
							action={() => navigation.navigate('Team', { name: name })}
							key={i}
							text={name}
							index={i}
						/>
					))}
				</View>
			</View>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	titulo: {
		fontSize: normalize(20),
		fontFamily: Fonts.MuliBold,
		color: Colors.DarkGray,
		marginHorizontal: 20,
	},
	containerCard: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
});

export default withNavigation(Regiones);
