import React from 'react';
import { Provider as ProviderRedux } from 'react-redux';

import Router from './router';
import store from './store/index';

const App = () => {
	return (
		<ProviderRedux store={store} >
			<Router/>
		</ProviderRedux>
	);
};

export default App;
