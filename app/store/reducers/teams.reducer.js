import { SET_CURRENT_TEAM, SET_TEAMS } from '@actions/teams.action';

const initialState = {
	teams: [],
	curremItem: {
		token: '',
		name: '',
		user_id: '',
		region_name: '',
		region_user: '',
		pokemons: [],
	},
};

export default (state = initialState, action) => {
	switch (action.type){
	case SET_TEAMS:
		return {
			...state,
			teams: action.payload,
		};
	case SET_CURRENT_TEAM:
		return {
			...state,
			curremItem: {...action.payload},
		};
	default: return state;
	}
};
