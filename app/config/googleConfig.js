import { GoogleSignin } from 'react-native-google-signin';

const configSignin = ()=>{
	GoogleSignin.configure({
		scopes: ['https://www.googleapis.com/auth/drive.readonly'],
		webClientId: '786987080102-h5akdt6ijuqddi352e1s9nha1v4t9gvp.apps.googleusercontent.com',
		offlineAccess: true,
		hostedDomain: '',
		loginHint: '',
		forceConsentPrompt: true,
		accountName: '',
	});
};

export default configSignin;
