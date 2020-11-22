import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {  node, oneOfType, func, bool } from 'prop-types';

import Colors from '@helpers/Colors';

const CustomModal = ({isVisible, setIsVisible, children }) => {
	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={isVisible}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.closeButton}>
						<TouchableOpacity
							onPress={() => setIsVisible(!isVisible)}
						>
							<Icon name='close' size={20} color={Colors.DarkGray} />
						</TouchableOpacity>
					</View>
					<View style={{marginTop: 30, width: '100%'}}>
						{children}
					</View>
				</View>
			</View>
		</Modal>
	);
};

CustomModal.propTypes = {
	isVisible: bool.isRequired,
	setIsVisible: func.isRequired,
	children: oneOfType([node, func]).isRequired,
};

const styles = StyleSheet.create({
	centeredView: {
		backgroundColor: 'rgba(0,0,0,0.4)',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		borderRadius: 20,
		width: '80%',
		padding: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		backgroundColor: '#fff',
	},
	closeButton: {
		position: 'absolute',
		top:20,
		right: 20,
		padding: 10,
	},
});

export default CustomModal;
