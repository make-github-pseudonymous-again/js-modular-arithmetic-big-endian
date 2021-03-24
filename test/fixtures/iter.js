import 'regenerator-runtime/runtime.js';
import numbers from './numbers';

export default function iter ( path, test, macro ) {
	for (const args of numbers(path)) {
		test(macro, ...args);
	}
}
