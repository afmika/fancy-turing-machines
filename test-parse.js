const Parser = require("./classes/Parser");

const parser = new Parser ();
// const machine = parser.parse ('./machines/infinite-hahaha.txt');
// const machine = parser.parse ('./machines/hello-turing.txt');
const machine = parser.parse ('./machines/hello-turing.txt');

machine.compile ();
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