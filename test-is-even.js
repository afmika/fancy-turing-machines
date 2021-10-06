const Parser = require("./classes/Parser");

const parser = new Parser ();
const machine = parser.parse ('./machines/is-even.txt');
machine.compile ();
// machine.setInput (1010101); // reject
machine.setInput (1011010); // accept
machine.show ();

let interval = setInterval (() => {
	machine.next ((verdict, tape_array, cursor_pos, error) => {
		machine.show ();
		if (verdict || error) {
			clearInterval (interval);
			console.log(verdict, 'curr_pos = ' + cursor_pos);
			if (error) 
				console.error (error.message);
		}
	});
}, 500);