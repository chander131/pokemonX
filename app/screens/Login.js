import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import googleConfig from '@config/googleConfig';

const Login = () => { 
	const [user, setUser ] = useState(null);
	const [loggedIn, setLoggedIn ] = useState(false);
	const [loading, setLoading ] = useState(false);

	const signInWithFirebase = async ()=>{
		setLoading(true);
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			setUser(userInfo);
			setLoggedIn(true);

			const credential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
			const firebaseUserCredential = await auth().signInWithCredential(credential);

			console.log('SUCCESS LOGIN -> ', firebaseUserCredential);
		} catch (e) { console.log('ERROR 456 -> signInWithFirebase', e); }
		setLoading(false);
	};

	useEffect(()=>{
		googleConfig();
	},[]);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<GoogleSigninButton
					style={{ width: 220, height: 60 }}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Dark}
					onPress={signInWithFirebase}
					disabled={loading}/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default withNavigation(Login);
