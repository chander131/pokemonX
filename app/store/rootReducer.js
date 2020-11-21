import { combineReducers } from 'redux';

import ejemplo from './reducers/ejemplo.reducer';
import teams from './reducers/teams.reducer';

export default combineReducers({
	ejemplo,
	teams,
});
