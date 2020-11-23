import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import generateToken from './generateToken';

const verifyToken = async (token) => {
	const asignTeam = async (data) => {
		const info = {...Object.values(data)[0]};
		const { region_name } = info;
		const newToken = await generateToken();
		database().ref('teams').push({
			...info,
			token: newToken,
			user_id: auth().currentUser.uid,
			region_user: `${region_name}_${auth().currentUser.uid}`,
		});
		return {
			exists: true,
			msg: 'Equipo creado exitosamente.',
		};
	};

	return database().ref()
		.child('teams')
		.orderByChild('token')
		.equalTo(token)
		.once('value')
		.then((snap) => {
			if (snap.exists()){
				const response = asignTeam(snap.val());
				return response;
			} else {
				return {
					exists: false,
					msg: 'El equipo no fue encontrado, verifica si el token es correcto.',
				};
			}
		})
		.catch((err) => console.log('err', err));

};

export default verifyToken;
