import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import IcoCargando from '@images/Cargando.gif';

const Cargando = props => {
	return (
		<View style={styles.container}>
			<Image
				style={styles.image}
				source={IcoCargando}
				resizeMode='contain'
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container:{
		display:'flex',
		height:'100%',
		width:'100%',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor: '#FFFFFF',
	},
	image: {
		width: '100%',
		height:'100%',
	},
});

export default Cargando;
