import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from '@components/Layout';
import CustomButton from '@components/Button/CustomButton';
import CustomModal from '@components/Modals/CustomModal';

import Colors from '@helpers/Colors';
import { Fonts } from '@helpers/Fonts';
import verifyToken from '@helpers/firebase/verifyToken';

const Screen = ({navigation }) => {
	const [token, setToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [msg, setMsg] = useState({
		exists: false,
		msg: '',
	});

	const handleToken = async () => {
		setIsLoading(true);
		const response = await verifyToken(token);
		setMsg(response);
		setIsModalVisible(true);
		setIsLoading(false);
	};

	return (
		<Layout>
			<View style={styles.container}>
				<CustomModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
					<View style={{alignItems: 'center'}}>
						<Icon
							name={!msg.exists ? 'exclamation-circle' : 'check-circle'}
							size={30}
							color={!msg.exists ? Colors.Red : Colors.Green}
						/>
						<Text style={[styles.text, {textAlign: 'center'}]}>{msg.msg}</Text>
						<CustomButton
							text='De acuerdo'
							action={() => {
								setIsModalVisible(false);
								msg.exists && navigation.goBack();
							}}
							width='80%'
						/>
					</View>
				</CustomModal>
				{/* <CustomInput
					action={setTypedText}
					value={typedText}
					placeholder='Digita el token'
				/> */}
				<TextInput
					onChangeText={(value) => setToken(value)}
					defaultValue={token}
					placeholder='Digita el token amigo'
					style={styles.texInput}
				/>
				<View style={styles.button}>
					<CustomButton
						text='Buscar equipo'
						action={() => {
							handleToken();
						}}
						addSpacing={false}
						width='80%'
						isLoading={isLoading}
					/>
				</View>
			</View>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginHorizontal: 10,
		height: '100%',
	},
	button: {
		alignItems: 'center',
		width: '100%',
		marginVertical: 20,
	},
	text: {
		fontFamily: Fonts.MontserratRegular,
	},
	texInput: {
		width:'100%',
		borderWidth: 1,
		borderColor:Colors.MediumGray,
		margin: 10,
		padding: 0,
		fontFamily: Fonts.MontserratRegular,
		paddingHorizontal: 5,
	},
});

export default Screen;
