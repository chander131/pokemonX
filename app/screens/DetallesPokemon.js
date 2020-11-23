import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

import Layout from '@components/Layout';
import Badge from '@components/Badge';
import CustomModal from '@components/Modals/CustomModal';
import CustomButton from '@components/Button/CustomButton';

import useDataApi from '@hooks/useDataApi';
import { setCurrentTeam } from '@actions/teams.action';
import { urlPokemonByName } from '@config/pathsPokeApi';

import Pokeball from '@images/pokeball.png';
import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';

const Screen = ({ navigation: { navigate, state: { params, routeName }} }) => {
	const dispatch = useDispatch();
	const teamData = useSelector((state) => state.teams.curremItem);
	const [data, setData] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [typedText, setTypedText] = useState('');
	const [stateSpecies, fetchDataSpecies] = useDataApi({
		url: params.url,
		headers: null,
		hasCache: true,
	});
	const [statePokemon, fetchDataPokemon] = useDataApi({
		url: urlPokemonByName(params.name),
		headers: null,
		hasCache: true,
	});

	const traduce = (traductions) => {
		const index = traductions.findIndex(el => el.language.name === 'es');
		return traductions[index].flavor_text;
	};

	const handleColor = (color) => {
		if (['yellow', 'Yellow'].includes(color)) {
			return Colors.Yellow;
		} else if (['white', 'White'].includes(color)){
			return Colors.DarkGray;
		}
		return color;
	};

	const getCurrentPokemon = () => {
		const currentPokemon = {
			name: typedText,
			number: data.order,
			types: data.types,
			description: traduce(data.flavor_text_entries),
			img: data.sprites.front_default,
			color: handleColor(data.color.name),
		};
		return currentPokemon;
	};

	const add = () => {
		const { pokemons } = teamData;
		const pokemonsCopy = pokemons;
		const currentPokemon = getCurrentPokemon();
		pokemonsCopy.push(currentPokemon);
		return {
			...teamData,
			pokemons: pokemonsCopy,
		};
	};

	const edit = () => {
		const { pokemons } = teamData;
		const pokemonsCopy = pokemons;
		const currentPokemon = getCurrentPokemon();
		pokemonsCopy.splice(params.selectedIndex, 1, currentPokemon);
		return {
			...teamData,
			pokemons: pokemonsCopy,
		};
	};

	const handleAction = () => params.isAdding ? add() : edit();

	const setPokemons = () => dispatch(setCurrentTeam(handleAction()));

	const PokemonAdder = ({ onSetPokemon }) => (
		<CustomButton
			text='¡Listo!'
			action={() => {
				onSetPokemon();
				setIsModalVisible(false);
				navigate('DetallesEquipo');
			}}
			width='80%'
			isDisabled={typedText.length === 0}
		/>
	);

	useEffect(() => {
		if (!statePokemon.isLoading) {
			if (statePokemon.isSuccess && stateSpecies.isSuccess) {
				setData({...stateSpecies.data, ...statePokemon.data});
			}
		}
	}, [
		statePokemon.isSuccess,
		statePokemon.isError,
		stateSpecies.isSuccess,
		stateSpecies.isError,
	]);

	useEffect(() => {
		fetchDataSpecies();
		fetchDataPokemon();
	}, []);

	return (
		<>
			{
				!data ? (
					<ActivityIndicator style={styles.loader} size='large' color={Colors.Salmon} />
				) : (
					<Layout>
						<CustomModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
							<View style={{alignItems: 'center'}}>
								<TextInput
									onChangeText={(value) => setTypedText(value)}
									value={typedText}
									placeholder='Nombre de tu pokemon'
									style={styles.input}
								/>
								<PokemonAdder onSetPokemon={setPokemons} />
							</View>
						</CustomModal>
						<View style={styles.infoContainer}>
							<TouchableOpacity
								style={styles.plus}
								onPress={() => setIsModalVisible(true)}
							>
								<Icon name='plus' size={35} color={handleColor(data.color.name)} />
							</TouchableOpacity>
							<View style={styles.info}>
								{
									data.sprites.front_default ? (
										<FastImage
											style={styles.image}
											source={{
												uri: data.sprites.front_default,
												priority: FastImage.priority.normal,
											}}
											resizeMode={FastImage.resizeMode.contain}
											fallback
										/>
									) : (
										<View style={styles.defaultLogo}>
											<Image
												style={[styles.image]}
												source={Pokeball}
												resizeMode='contain'
											/>
										</View>
									)
								}
								<View style={styles.details}>
									<Text style={[styles.text]}>{traduce(data.flavor_text_entries)}</Text>
									<View style={[styles.card]}>
										<View style={styles.columnDetails}>
											<Text style={[styles.label]}>Peso:</Text>
											<Text style={[styles.text]}>{data.weight}</Text>
										</View>
										<View style={styles.columnDetails}>
											<Text style={[styles.label]}>Altura:</Text>
											<Text style={[styles.text]}>{data.height}</Text>
										</View>
										<View style={styles.columnDetails}>
											<Text style={[styles.label]}>Orden:</Text>
											<Text style={[styles.text]}>{data.order}</Text>
										</View>
									</View>

									<View style={styles.basicDetails}>
										<Text style={[styles.label]}>Tipos:</Text>
									</View>
									<View style={styles.types}>
										{data.types.map((el, index) =>
											<Badge
												key={index}
												color={handleColor(data.color.name)}
												text={el.type.name}
											/>
										)}
									</View>
								</View>
							</View>
						</View>
					</Layout>
				)
			}
		</>
	);
};

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: 2,
		top: -20,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		backgroundColor: Colors.White,
	},
	info: {
		alignItems: 'center',
		margin: 10,
	},
	defaultLogo: {
		padding: 20,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: '60%',
		height: '60%',
	},
	details: {
		flex: 1,
		alignItems: 'flex-start',
		flexGrow: 1,
	},
	text:{
		fontFamily: Fonts.MontserratRegular,
		fontSize: normalize(13),
	},
	basicDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 10,
	},
	columnDetails: {
		width: '33%',
		alignItems: 'center',
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
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
		backgroundColor: Colors.White,
	},
	label: {
		color: Colors.DarkGray,
		fontFamily: Fonts.MontserratBold,
		marginRight: 10,
	},
	types: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		margin: 10,
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
	plus: {
		alignItems: 'flex-end',
		marginTop: 30,
		marginRight: 30,
	},
	input: {
		padding: 0,
		height: 50,
		fontFamily: Fonts.MontserratRegular,
		backgroundColor: Colors.LightGray,
		paddingHorizontal: 5,
		borderRadius: 12,
		width: '100%',
	},
});

export default withNavigation(Screen);
