// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import numbers from './numbers.js';

export default function iter(path, test, macro) {
	for (const args of numbers(path)) {
		test(macro, ...args);
	}
}
