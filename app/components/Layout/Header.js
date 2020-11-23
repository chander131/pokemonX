import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';

import Logo from '@images/pokemon.png';
import Colors from '@helpers/Colors';

const Header = props => {
	const [user, setUser] = useState(null);

	const onAuthStateChanged = userData => setUser(userData);

	const signOut = async () => {
		auth().signOut();
		try {
			await GoogleSignin.revokeAccess();
			await GoogleSignin.signOut();
			setUser({ user: null });
			user && props.navigation.navigate('Index');
		} catch (e) {
			console.error('ERROR 45', e);
		}
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.imgLogo}
				onPress={()=>props.navigation.reset([
					NavigationActions.navigate({routeName: 'Regiones'}),
				],0)}
			>
				<Image
					style={styles.image}
					source={Logo}
					resizeMode='contain'
				/>
			</TouchableOpacity>
			{user && (
				<View style={styles.containerLogOut}>
					<Icon
						onPress={signOut}
						name='power-off'
						size={30}
						color={Colors.White}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 60,
		elevation: 5,
		backgroundColor: '#0548AD',
	},
	image: {
		width: 150,
		height: 35,
	},
	imgLogo: {
		width: '50%',
		height: '60%',
	},
	containerLogOut: {
		justifyContent: 'flex-end',
		padding: 10,
	},
});

export default withNavigation(Header);
