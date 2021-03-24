import path from 'path';
import lines from './lines.js';
import {map} from '@aureooms/js-itertools';

export default function numbers(filename) {
	const filepath = path.join('test/data/', filename);
	return map(
		([R, D, o, N, A, B, C]) => [Number(R), Number(D), o, N, A, B, C],
		map((line) => line.split(' '), lines(filepath)),
	);
}
