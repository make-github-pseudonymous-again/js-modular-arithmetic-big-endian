import path from 'path';

import {map} from '@iterable-iterator/map';

import lines from './lines.js';

export default function numbers(filename) {
	const filepath = path.join('test/data/', filename);
	return map(
		([R, D, o, N, A, B, C]) => [Number(R), Number(D), o, N, A, B, C],
		map((line) => line.split(' '), lines(filepath)),
	);
}
