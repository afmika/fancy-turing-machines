const Parser = require("./classes/Parser");

const parser = new Parser ();
const machine = parser.parse ('./machines/mika-machine.txt');
console.log(machine.__states_map)
machine.show ();

let interval = setInterval (() => {
	machine.next ((verdict, tape_array, cursor_pos, error) => {
		machine.show ();
		if (verdict || error) {
			clearInterval (interval);
			console.log(verdict, 'curr_pos = ' + cursor_pos, error || 'No error');
		}
	});
}, 500);