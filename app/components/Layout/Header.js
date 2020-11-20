import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import auth from '@react-native-firebase/auth';

import Logo from '@images/pokemon.png';

const Header = props => {
	const [user, setUser] = useState();

	const onAuthStateChanged = userData => setUser(userData);

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
});

export default withNavigation(Header);
