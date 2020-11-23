import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import googleConfig from '@config/googleConfig';
import Colors from '@helpers/Colors';

const Login = props => {
	const [user, setUser ] = useState(null);
	const [loggedIn, setLoggedIn ] = useState(false);
	const [loading, setLoading ] = useState(true);

	const signInWithFirebase = async ()=>{
		setLoading(true);
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			setUser(userInfo);
			setLoggedIn(true);

			const credential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
			const firebaseUserCredential = await auth().signInWithCredential(credential);
			userInfo && props.navigation.reset([NavigationActions.navigate({routeName: 'Regiones'})], 0);
		} catch (e) { console.log('ERROR 456 -> signInWithFirebase', e); }
		setLoading(false);
	};

	const verificarSession = async () => {
		setLoading(true);
		const dataUser = await GoogleSignin.getCurrentUser();
		if (dataUser) {
			props.navigation.reset([NavigationActions.navigate({routeName: 'Regiones'})], 0);
		}
		setLoading(false);
	};

	useEffect(()=>{
		googleConfig();
		verificarSession();
	}, []);

	return (
		<View style={styles.container}>
			{ loading ? <ActivityIndicator style={styles.loader} size='large' color={Colors.Salmon} /> : (
				<View style={styles.content}>
					<GoogleSigninButton
						style={{ width: 220, height: 60 }}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={signInWithFirebase}
						disabled={loading}/>
				</View>
			)}
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
	loader: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});

export default withNavigation(Login);
