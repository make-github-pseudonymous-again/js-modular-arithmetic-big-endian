import fs from 'fs';

// https://stackoverflow.com/questions/34223065/read-lines-synchronously-from-file-in-node-js/34223227

/**
 * Lines.
 *
 * @param {string} filename
 * @return {string[]}
 */
export default function lines(filename) {
	return fs.readFileSync(filename, 'utf8').split('\n').filter(Boolean);
}
