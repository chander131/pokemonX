import React, { useState, useEffect } from 'react';

const useSearch = ({ whitelist = [], blacklist = [] } = {}) => {
	const [searchValue, setSearchValue] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [sourceData, setSourceData] = useState([]);

	const plainObject = (obj) => {
		const resultObj = {};
		for (const prop in obj) {
			if (typeof obj[prop] !== 'object') {
				resultObj[prop] = obj[prop];
			} else if (Array.isArray(obj[prop])) {
				resultObj[prop] = obj[prop];
			} else {
				const innerObj = plainObject(obj[prop]);
				for (const nestProp in innerObj) {
					resultObj[`${prop}_${nestProp}`] = innerObj[nestProp];
				}
			}
		}
		return resultObj;
	  };

	const filter = () => {
		const value = searchValue.toLowerCase().trim().split(' ');

		const filteredData = sourceData && sourceData.filter((item, i) => {
			let res = false;
			const plainItem = plainObject(item);

			for (const prop in plainItem) {
				if (blacklist.includes(prop) || (whitelist.length && !whitelist.includes(prop))) {
					continue;
				}

				if (value.length === 1) { // una sola palabra
					const valueTC = String(plainItem[prop]).toLocaleLowerCase();
					const valueToCompare = valueTC.includes(value[0]);
					const valueToCompareMod = valueTC.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
						.includes(value[0]);

					if (valueToCompare || valueToCompareMod) {res = true;}
				} else { // al menos 2 palabras de busqueda
					let coincidencias = 0;
					value.forEach((el, i) => {
						const valueTC = String(plainItem[prop]).toLocaleLowerCase();
						const valueToCompare = valueTC.includes(el);
						const valueToCompareMod = valueTC.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
							.includes(el);
						if (valueToCompare || valueToCompareMod) {coincidencias++;}
					});

					if (coincidencias >= value.length) {res = true;}
				}
			}
			return res;
		});

		setFiltered(filteredData);
	};

	useEffect(() => {
		filter();
	}, [searchValue, sourceData]);

	return [filtered, setSearchValue, setSourceData];
};


export default useSearch;
