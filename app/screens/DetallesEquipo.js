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
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from '@components/Layout';
import Badge from '@components/Badge';
import SinDatos from '@components/SinDatos';

import { Fonts } from '@helpers/Fonts';
import Colors from '@helpers/Colors';
import { normalize } from '@helpers/dimensions';

import Pokeball from '@images/pokeball.png';

const DetallesEquipo = ({ navigation: { navigate, state: { params, routeName } } }) => {
	const dataTeam = useSelector((state) => state.teams.curremItem);
	const [nameTeam, setNameTeam] = useState(dataTeam.name);
	const [listPokemons, setListPokemons] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

	useEffect(() => {
		console.log('currem item', dataTeam);
	}, [dataTeam]);

	const addTeam = () => {};
	const updateTeam = () => {};

	const handleOpenItem = (index) => {
		const modData = listPokemons;
		modData[index].isOpen = !modData[index].isOpen;
		setListPokemons([...modData]);
	};

	const ViewActionTeam = () => (
		<TouchableOpacity
			style={styles.containerActionTeam}
			onPress={params.isAding ? addTeam() : updateTeam()}
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
							onPress={()=>navigate('Pokemon', {
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
});

export default withNavigation(DetallesEquipo);
