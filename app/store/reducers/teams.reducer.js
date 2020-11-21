import { SET_CURRENT_TEAM, SET_TEAMS } from '@actions/teams.action';

const initialState = {
	teams: [],
	curremItem: null,
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
			curremItem: action.payload,
		};
	default: return state;
	}
};
