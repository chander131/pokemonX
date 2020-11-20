const api = 'https://pokeapi.co/api/v2';

export const urlRegion = () => `${api}/region`;
export const urlRegionByName = (name) => `${api}/region/${name}`;
export const urlPokemonByName = (name) => `${api}/pokemon/${name}`;
