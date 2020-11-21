export const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
export const SET_TEAMS = 'SET_TEAMS';

export const setCurrentTeam = data => ({type: SET_CURRENT_TEAM, payload: data});
export const setTeams = data => ({type: SET_TEAMS, payload: data});
