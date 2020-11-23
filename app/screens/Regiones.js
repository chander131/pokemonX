import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
				setData(state.data.results);
			}
		}
	}, [state.isSuccess, state.isError]);

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Layout>
			<ScrollView>
				<View style={styles.container}>
					{data.map(({ name }, i) => (
						<CardRegion
							action={() => navigation.navigate('Equipos', { name: name })}
							key={i}
							text={name}
							index={i}
						/>
					))}
				</View>
			</ScrollView>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		padding: 10,
	},
});

export default withNavigation(Regiones);
