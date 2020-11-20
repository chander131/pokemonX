import { SET_EJEMPLO } from '@actions/ejemplo.action';

const initialState = [
	{
		idAgencia: 1,
		imagen: '',
		nombre: 'Torre Futura',
		direccion: 'Calle el mirador, Colonia Escalon.',
		horarios: 'Lun-Vie: 8:00 AM - 5:00 PM',
		telefono: null,
		coordinates:{
			latitude: 37.78825,
			longitude: -122.4324,
		},
	},
];

export default (state = initialState, action) => {
	switch (action.type){
	case SET_EJEMPLO:
		return action.payload;
	default: return state;
	}
};
