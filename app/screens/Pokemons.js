import React, { useState, useEffect } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from '@components/Layout';
import CardListPokemon from '@components/CardListPokemon';

import useDataApi from '@hooks/useDataApi';
import useSearch from '@hooks/useSearch';

import { urlRegionByName } from '@config/pathsPokeApi';
import { Fonts } from '@helpers/Fonts';
import Colors from '@helpers/Colors';

const Pokemons = ({ navigation: { navigate, state: { params, routeName } } }) => {
	const dataTeam = useSelector((state) => state.teams.curremItem);
	const [data, setData] = useState([]);
	const [pokedexSize, setPokedexSize] = useState(-1);
	const [pokedexItem, setpokedexItem] = useState(0);
	const [txtSearch, setTxtSearch] = useState('');
	const [state, fetchData] = useDataApi({
		url: urlRegionByName(dataTeam.region_name),
		headers: null,
		hasCache: true,
	});
	const [statePokedex, fetchDataPokedex] = useDataApi();
	const [filteredData, setSearch, setSourceData] = useSearch();

	const handlePokemons = (pokemons) => {
		if (data.length < 1) {
			setData(pokemons);
		} else {
			const whiteList = data;
			for (const item of pokemons) {
				const found = whiteList.find(el => el.pokemon_species.name === item.pokemon_species.name);
				if (!found) {
					whiteList.push(item);
				}
				setData(whiteList);
			}
		}
		setpokedexItem(pokedexItem + 1);
	};

	const handlePokedexes = (pokedexes) => {
		setPokedexSize(pokedexes.length);
		for (const item of pokedexes) {
			fetchDataPokedex({url: item.url});
		}
	};

	useEffect(() => {
		if (!statePokedex.isLoading) {
			if (statePokedex.isSuccess && statePokedex.data) {
				handlePokemons(statePokedex.data.pokemon_entries);
			}
		}
	}, [statePokedex.isSuccess, statePokedex.isError]);

	useEffect(() => {
		if (!state.isLoading) {
			if (state.isSuccess && state.data) {
				handlePokedexes(state.data.pokedexes);
			}
		}
	}, [state.isSuccess, state.isError]);

	useEffect(() => {
		if (pokedexItem === pokedexSize) {setSourceData(data);}
	}, [pokedexItem]);

	useEffect(() => {
		setpokedexItem(0);
		setPokedexSize(-1);
		fetchData();
	}, []);

	return (
		<Layout>
			{pokedexItem < pokedexSize ? (
				<ActivityIndicator style={styles.loader} size='large' color={Colors.Salmon} />
			) : (
				<View style={styles.region}>
					{filteredData.length > 0 && (
						<>
							<View style={styles.searcher}>
								<Icon name={'search'} size={22} color={Colors.DarkGray} />
								<TextInput
									onChangeText={(value) => {setTxtSearch(value); setSearch(value);}}
									value={txtSearch}
									placeholder='Buscar un pokemon'
									style={styles.input}
								/>
							</View>
							<ScrollView style={styles.cardContainerScroll}>
								<View style={styles.cardContainer}>
									{filteredData.map((el, index) =>
										<CardListPokemon
											action={() =>
												navigate('DetallesPokemon', {
													url: el.pokemon_species.url,
													name: el.pokemon_species.name,
													isAdding: params.isAdding,
													selectedIndex: params.selectedIndex,
												})
											}
											key={index}
											text={el.pokemon_species.name}
											index={index}
										/>
									)}
								</View>
							</ScrollView>
						</>
					)}
				</View>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	region: {
		alignItems: 'center',
		marginHorizontal: 10,
		height: '100%',
	},
	text:{
		fontFamily: Fonts.MontserratBold,
	},
	searcher: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.LightGray,
		paddingHorizontal: 5,
		borderRadius: 12,
		marginVertical: 15,
	},
	input: {
		margin: 10,
		padding: 0,
		flex: 1,
		fontFamily: Fonts.MontserratRegular,
	},
	loader: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	cardContainerScroll:{
		height: '60%',
		width: '100%',
	},
	cardContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		width: '100%',
		height: '100%',
	},
});

export default withNavigation(Pokemons);
