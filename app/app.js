import React from 'react';
import { Provider as ProviderRedux } from 'react-redux';

import { CacheProvider } from '@contexts/CacheContext';

import Router from './router';
import store from './store/index';

const App = () => {
	return (
		<ProviderRedux store={store} >
			<CacheProvider>
				<Router/>
			</CacheProvider>
		</ProviderRedux>
	);
};

export default App;
