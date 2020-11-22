import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { withNavigation } from 'react-navigation';
import { useDispatch } from 'react-redux';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from '@components/Layout';
import SinDatos from '@components/SinDatos';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import { normalize } from '@helpers/dimensions';
import { setCurrentTeam } from '@actions/teams.action';
import { ScrollView } from 'react-native-gesture-handler';

const Equipos = ({ navigation: { navigate, state: { params, routeName} } }) => {
	const dispatch = useDispatch();
	const [equipos, setEquipos] = useState([]);

	const nuevoEquipo = () => {
		const detalles = {
			name: '',
			pokemons: [],
			token: '',
			region_name: params.name,
			user_id: auth().currentUser.uid,
			region_user: `${params.name}_${auth().currentUser.uid}`,
		};
		dispatch(setCurrentTeam(detalles));
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

	const deleteTeam = (key) => {
		// setIsRemoveModalVisible(false);
		database().ref('teams').child(key).remove();
		// getTeams();
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
				<Text style={styles.titulo}>
					{params.name}
				</Text>
				<TouchableOpacity
					style={[styles.nuevoEquipo, styles.botonAction]}
					onPress={nuevoEquipo}
				>
					<Text style={styles.options}>Crear nuevo equipo</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.equipoAmigo, styles.botonAction]}
				>
					<Text style={styles.options}>Obtener equipo amigo</Text>
				</TouchableOpacity>

				<ScrollView>
					<View style={styles.containerEquipos}>
						<Text style={styles.myTeamsTitle}>Mis Equipos</Text>
						{equipos.length > 0 ? (
							<View style={styles.myTeams}>
								{equipos.map((el, index) =>
									<View key={index} style={styles.myItemTeams}>
										<View style={{width: '60%', height: 20}}>
											<Text style={styles.myTeamsText}>{el.name}</Text>
										</View>
										<TouchableOpacity
											onPress={() => {
												// onShare(el);
											}}
										>
											<Icon name='share' size={25} color={Colors.DarkGray} />
										</TouchableOpacity>
										{/* <TeamEditor onSetDetails={setTeamDetails} item={el} /> */}
										<TouchableOpacity
											onPress={() => {
												// setSelectedKey(el.key),
												// setIsRemoveModalVisible(true);
												deleteTeam(el.key);
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
		marginTop: 10,
		width: '96%',
		height: 30,
		borderWidth: 1,
		borderRadius: 25,
		alignSelf: 'center',
		elevation: 2,
	},
	nuevoEquipo: {
		backgroundColor: Colors.Green,
	},
	equipoAmigo: {
		backgroundColor: Colors.Blue,
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
});

export default withNavigation(Equipos);
