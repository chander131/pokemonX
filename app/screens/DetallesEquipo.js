import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';

import Layout from '@components/Layout';
import Badge from '@components/Badge';
import SinDatos from '@components/SinDatos';
import CustomModal from '@components/Modals/CustomModal';
import CustomButton from '@components/Button/CustomButton';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';
import generateToken from '@helpers/firebase/generateToken';

import Pokeball from '@images/pokeball.png';
import { setCurrentTeam } from '@actions/teams.action';

const DetallesEquipo = ({
	navigation: {
		navigate,
		goBack,
		state: { params, routeName },
	},
}) => {
	const dispatch = useDispatch();
	const dataTeam = useSelector((state) => state.teams.curremItem);
	const [nameTeam, setNameTeam] = useState(dataTeam.name);
	const [listPokemons, setListPokemons] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

	const addTeam = async () => {
		setLoading(true);
		const token = await generateToken();
		database().ref('teams').push({
			...dataTeam,
			token,
			name: nameTeam,
		});
		setIsSuccessModalVisible(true);
		setLoading(false);
	};

	const updateTeam = () => {
		setLoading(true);
		const teamDataCopy = dataTeam;
		const key = teamDataCopy.key;
		delete teamDataCopy.key;
		database().ref('teams').child(key).update({
			...dataTeam,
			name: nameTeam,
		});
		setIsSuccessModalVisible(true);
		setLoading(false);
	};

	const handleOpenItem = (index) => {
		const modData = listPokemons;
		modData[index].isOpen = !modData[index].isOpen;
		setListPokemons([...modData]);
	};

	const transformData = () => {
		const { pokemons } = dataTeam;
		const list = [];
		for (const item of pokemons) {
			list.push({...item, isOpen: false});
		}
		setListPokemons(list);
	};

	const remove = () => {
		const { pokemons } = dataTeam;
		const pokemonsCopy = pokemons;
		console.log();
		pokemonsCopy.splice(selectedIndex, 1);
		dispatch(setCurrentTeam({ ...dataTeam, pokemons: pokemonsCopy }));
	};

	const ViewActionTeam = () => (
		<TouchableOpacity
			style={styles.containerActionTeam}
			onPress={params.isAdding ? addTeam : updateTeam}
		>
			<Text style={styles.textActionTeam}>Guardar Equipo</Text>
		</TouchableOpacity>
	);

	const ItemList = (item, index) => {
		return (
			<View key={item.number} style={{backgroundColor: index % 2 && Colors.LightGray}}>
				<View style={styles.list}>
					<View style={{ flex: 1 }}>
						{
							item.img ? (
								<FastImage
									style={styles.icon}
									source={{
										uri: item.img,
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
					</View>
					<View style={{flex: 3}}>
						<Text style={[styles.name]}>{item.name}</Text>
						<Text style={[styles.number]}>{`#${item.number}`}</Text>
					</View>
					<View style={styles.actions}>
						<TouchableOpacity
							onPress={()=>navigate('Pokemons', {
								isAdding: false,
								selectedIndex: index,
							})}
						>
							<Icon name='edit' size={25} color={Colors.DarkGray} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setSelectedIndex(index);
								setIsRemoveModalVisible(true);
							}}
						>
							<Icon name='trash' size={25} color={Colors.DarkGray} />
						</TouchableOpacity>
					</View>
				</View>
				<TouchableOpacity onPress={()=>handleOpenItem(index)} style={styles.moreBtn}>
					<Text style={[styles.more]}>{item.isOpen ? 'Ver menos' : 'Ver más'}</Text>
				</TouchableOpacity>
				{
					item.isOpen && (
						<View style={{flex: 1, width: '100%'}}>
							<View style={styles.description}>
								<Text style={[styles.descriptionText]}>{item.description}</Text>
							</View>
							<View style={styles.types}>
								{item.types.map((el, i) =>
									<Badge key={i} text={el.type.name} color={item.color} />
								)}
							</View>
						</View>
					)
				}
			</View>
		);
	};

	const PokemonRemover = ({ onRemovePokemon }) => (
		<CustomButton
			text='Sí, eliminar'
			action={() => {
				onRemovePokemon();
				setIsRemoveModalVisible(false);
			}}
			width='80%'
		/>
	);

	useEffect(() => {
		if (!isRemoveModalVisible) {setSelectedIndex(-1);}
	}, [isRemoveModalVisible]);

	useEffect(() => {
		console.log('data del team actual', dataTeam.key);
		transformData();
	}, [dataTeam]);

	return (
		<Layout>
			<View style={styles.container}>
				<TextInput
					onChangeText={(value) => setNameTeam(value)}
					defaultValue={nameTeam}
					placeholder='Nombre de tu equipo'
					style={styles.texInput}
				/>
				<TouchableOpacity
					onPress={()=> listPokemons.length - 6 ? navigate('Pokemons', {
						isAdding: true,
						selectedIndex: -1,
					} ) : { }}
					style={[styles.teamHeaderButtons, styles.plus]}
				>
					<Icon name={listPokemons.length - 6 ? 'plus' : 'ban'} size={22} color={Colors.DarkGray} />
				</TouchableOpacity>
			</View>
			<FlatList
				data={listPokemons}
				ListEmptyComponent={<SinDatos />}
				ListFooterComponent={<ViewActionTeam />}
				renderItem={({item, index}) => ItemList(item, index)}
				keyExtractor={(item, index) => index.toString()}
			/>
			<CustomModal isVisible={isSuccessModalVisible} setIsVisible={setIsSuccessModalVisible}>
				<View style={{alignItems: 'center'}}>
					<Icon name='check-circle' size={30} color={Colors.Green} />
					<Text style={[styles.text, {textAlign: 'center'}]}>¡Equipo guardado exitosamente!</Text>
					<CustomButton
						text='De acuerdo'
						action={() => {
							setIsSuccessModalVisible(false);
							goBack();
						}}
						width='80%'
					/>
				</View>
			</CustomModal>
			<CustomModal isVisible={isRemoveModalVisible} setIsVisible={setIsRemoveModalVisible}>
				<View style={{alignItems: 'center'}}>
					<Text style={[styles.text, {textAlign: 'center'}]}>¿Deseas eliminar este pokemon?</Text>
					<PokemonRemover onRemovePokemon={remove} />
				</View>
			</CustomModal>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '90%',
		alignSelf: 'center',
	},
	containerActionTeam: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		marginVertical: 10,
		borderWidth: 1,
		borderRadius: 25,
		borderColor: Colors.Purple,
		alignSelf: 'center',
		width: '90%',
	},
	textActionTeam: {
		fontFamily: Fonts.Muli,
		fontSize: normalize(16),
		textTransform: 'capitalize',
	},
	texInput: {
		width:'100%',
		borderWidth: 1,
		borderColor:Colors.MediumGray,
		margin: 10,
		padding: 0,
		fontFamily: Fonts.MontserratRegular,
		paddingHorizontal: 5,
	},
	list: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	actions: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	description: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	descriptionText: {
		fontFamily: Fonts.MontserratRegular,
		fontSize: normalize(13),
	},
	moreBtn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
	},
	more: {
		fontFamily: Fonts.MontserratBold,
		color: Colors.Blue,
	},
	icon: {
		width: 70,
		height: 70,
	},
	image: {
		width: 35,
		height: 35,
	},
});

export default withNavigation(DetallesEquipo);
