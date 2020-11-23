import database from '@react-native-firebase/database';
import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';

const generateToken = async () => {
	const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
	const code = nanoid();
	const exists = await database().ref()
		.child('teams')
		.orderByChild('token')
		.equalTo(String(code))
		.once('value')
		.then((snap) => snap.exists())
		.catch((e) => console.log('ERROR 423', e));

	if (exists) {
		return generateToken();
	}
	return code;
};

export default generateToken;
