import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import auth from '@react-native-firebase/auth';
import { withNavigation } from 'react-navigation';
import { useDispatch } from 'react-redux';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

import Layout from '@components/Layout';
import SinDatos from '@components/SinDatos';
import CustomButton from '@components/Button/CustomButton';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';
import { setCurrentTeam } from '@actions/teams.action';
import CustomModal from '@components/Modals/CustomModal';

const Equipos = ({ navigation: { navigate, state: { params, routeName} } }) => {
	const dispatch = useDispatch();
	const [equipos, setEquipos] = useState([]);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const [curremKey, setCurremKey] = useState(-1);

	const setTeamWorking = (team) => dispatch(setCurrentTeam(team));

	const nuevoEquipo = () => {
		const detalles = {
			name: '',
			pokemons: [],
			token: '',
			region_name: params.name,
			user_id: auth().currentUser.uid,
			region_user: `${params.name}_${auth().currentUser.uid}`,
		};
		setTeamWorking(detalles);
		navigate('DetallesEquipo', { isAdding: true });
	};

	const transformData = (teams) => {
		const list = [];
		if (teams) {
			for (const key in teams) {
				teams[key].key = key;
				list.push(teams[key]);
			}
		}
		setEquipos(list);
	};

	const deleteTeam = () => {
		setShowModalDelete(false);
		database().ref('teams').child(curremKey).remove();
	};

	const ViewEditTeam = ({ setTeam, team }) => (
		<TouchableOpacity
			onPress={()=> {
				setTeam(team);
				navigate('DetallesEquipo', { isAdding: false });
			}}
		>
			<Icon name='edit' size={25} color={Colors.DarkGray} />
		</TouchableOpacity>
	);

	const onShare = async (team) => {
		try {
			await Share.share({
				message:
				`Obtén mi equipo de pokemons para la region ${team.region_name} 
				http://pokemonX.com/${team.region_name}/${team.token}`,
			});
		} catch (e) { console.log('ERROR 11', e);}
	};

	useEffect(() => {
		const onValueChange = database().ref()
			.child('teams')
			.orderByChild('region_user')
			.equalTo(`${params.name}_${auth().currentUser.uid}`)
			.on('value', snapshot => {
				if (snapshot) {
					transformData(snapshot.val());
				}
			});

		return () =>
			database()
				.ref(`/teams`)
				.off('value', onValueChange);
	}, []);

	return (
		<Layout>
			<View style={styles.container}>
				<View style={styles.containerHeader}>
					<Text style={styles.titulo}>
						{params.name}
					</Text>
					<View style={styles.containerHeaderButton}>
						<TouchableOpacity
							style={[{ backgroundColor: Colors.Green }, styles.botonAction]}
							onPress={nuevoEquipo}
						>
							<Text style={styles.options}>Nuevo equipo</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[{ backgroundColor: Colors.Blue }, styles.botonAction]}
							onPress={() => navigate('EquipoAmigo')}
						>
							<Text style={styles.options}>Obtener equipo</Text>
						</TouchableOpacity>
					</View>
				</View>

				<ScrollView>
					<View style={styles.containerEquipos}>
						<Text style={styles.myTeamsTitle}>Mis Equipos</Text>
						{equipos.length > 0 ? (
							<View style={styles.myTeams}>
								{equipos.map((el, index) =>
									<View key={index} style={styles.myItemTeams}>
										<View style={{width: '60%', height: 40}}>
											<Text style={styles.myTeamsText}>{`${el.name}`}</Text>
											<Text style={styles.myTeamsText}>{`Pokemons: ${el.pokemons.length}`}</Text>
										</View>
										<TouchableOpacity
											onPress={() => onShare(el)}
										>
											<Icon name='share' size={25} color={Colors.DarkGray} />
										</TouchableOpacity>
										<ViewEditTeam setTeam={setTeamWorking} team={el} />
										<TouchableOpacity
											onPress={() => {
												setCurremKey(el.key);
												setShowModalDelete(true);
											}}
										>
											<Icon name='trash' size={25} color={Colors.DarkGray} />
										</TouchableOpacity>
									</View>
								)}
							</View>
						) : (<SinDatos />)}
					</View>
				</ScrollView>
				<CustomModal
					isVisible={showModalDelete}
					setIsVisible={setShowModalDelete}
				>
					<View style={{alignItems: 'center'}}>
						<Text style={[styles.text, {textAlign: 'center'}]}>¿Deseas eliminar este equipo?</Text>
						<CustomButton
							text='Sí, eliminar'
							action={() => deleteTeam()}
							width='80%'
						/>
					</View>
				</CustomModal>
				<View style={styles.containerCard} />
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
		textTransform: 'capitalize',
	},
	containerCard: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	botonAction: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// marginTop: 10,
		width: '48%',
		// height: 30,
		height: '100%',
		borderWidth: 1,
		borderRadius: 10,
		// alignSelf: 'center',
		elevation: 2,
	},
	options: {
		fontFamily: Fonts.MontSerrattBold,
		fontSize: normalize(16),
	},
	containerEquipos: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: 20,
		padding: 10,
	},
	myTeams: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	myTeamsTitle: {
		fontSize: normalize(16),
		fontFamily: Fonts.MontserratBold,
	},
	myItemTeams: {
		marginVertical: 10,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		backgroundColor: Colors.White,
		flexDirection: 'row',
		justifyContent: 'space-around',
		height: 60,
		alignItems: 'center',
	},
	myTeamsText: {
		fontFamily: Fonts.Muli,
		fontSize: normalize(14),
	},
	containerHeader: {
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	containerHeaderButton: {
		marginTop: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: 40,
		paddingHorizontal: 5,
	},
});

export default withNavigation(Equipos);
