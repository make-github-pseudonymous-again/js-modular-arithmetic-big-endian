const fmt = (x) => (x.length <= 40 ? x : x.slice(0, 19) + '..' + x.slice(-19));
export default fmt;
