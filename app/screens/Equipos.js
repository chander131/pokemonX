import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { withNavigation } from 'react-navigation';
import { useDispatch } from 'react-redux';

import Layout from '@components/Layout';

import { normalize } from '@helpers/dimensions';
import { Fonts } from '@helpers/Fonts';
import Colors from '@helpers/Colors';
import { setCurrentTeam } from '@actions/teams.action';

const Equipos = ({ navigation: { navigate, state: { params, routeName} } }) => {
	const dispatch = useDispatch();
	const [equipos, setEquipos] = useState([1]);

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

	useEffect(() => {
		// console.log(params.name);
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

				{equipos.length > 0 && (
					<View style={styles.containerEquipos}>
						<Text>Mis Equipos</Text>
					</View>
				)}
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
		alignItems: 'center',
		marginTop: 20,
		padding: 10,
	},
});

export default withNavigation(Equipos);
