import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { Easing, Animated } from 'react-native';

import Login from '@screens/Login';
import Regiones from '@screens/Regiones';
import Equipos from '@screens/Equipos';
import DetallesEquipo from '@screens/DetallesEquipo';
import Pokemons from '@screens/Pokemons';
import DetallesPokemon from '@screens/DetallesPokemon';
import EquipoAmigo from '@screens/EquipoAmigo';

const SlideFromRight = (index, position, width)=>{
	const translateX = position.interpolate({
		inputRange: [index - 1, index],
		outputRange: [ width, 0],
	});
	return { transform: [ { translateX } ]};
};

const SlideFromBottom = (index, position, height)=>{
	const translateY = position.interpolate({
		inputRange: [index - 1, index],
		outputRange: [ height, 0],
	});
	return { transform: [ { translateY } ]};
};

const CollapseTransition = (index, position)=>{
	const opacity = position.interpolate({
		inputRange: [index - 1, index, index + 1 ],
		outputRange: [ 0, 1, 1 ],
	});

	const scaleY = position.interpolate({
		inputRange: [index - 1, index, index + 1 ],
		outputRange: [ 0, 1, 1 ],
	});

	return {
		opacity,
		transform: [ { scaleY } ],
	};
};

const NavigationOptions = () =>{
	return {
		transitionSpec: {
			duration: 750,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: sceneProps => {
			const { layout, position, scene } = sceneProps;
			const width = layout.initWidth;
			const height = layout.initHeight;
			const { index, route } = scene;
			const params = route.params || {};
			const transition = params.transition || 'default';
			return {
				default: SlideFromRight(index, position, width),
				bottomTransition: SlideFromBottom(index, position, height),
				collapseTransition: CollapseTransition(index, position),
			}[transition];
		},
	};
};

const AppNavigator = createStackNavigator({
	Index:{
		screen:Login,
		navigationOptions:{
			title:'Login',
		},
	},
	Regiones:{
		screen:Regiones,
		navigationOptions:{ title:'Regiones' },

	},
	Equipos:{
		screen:Equipos,
		navigationOptions:{ title:'Equipos' },

	},
	DetallesEquipo:{
		screen:DetallesEquipo,
		navigationOptions:{ title:'Detalles del equipo' },
	},
	Pokemons:{
		screen:Pokemons,
		navigationOptions:{ title:'Pokemons' },
	},
	DetallesPokemon:{
		screen:DetallesPokemon,
		navigationOptions:{ title:'Detalles del Pokemon' },
	},
	EquipoAmigo:{
		screen:EquipoAmigo,
		navigationOptions:{ title:'Equipo amigo' },
	},
},{
	headerMode:'none',
	transitionConfig: NavigationOptions,
});

export default Router = createAppContainer(AppNavigator);
