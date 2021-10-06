const MachineGenerator = require("./classes/MachineGenerator");

// plz use std-out
const machine = MachineGenerator.fromString ('Mika');
// const code = machine.asCode();
// console.log(code);

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