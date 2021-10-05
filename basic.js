const Machine = require('./classes/Machine');

function generateMachineFrom(str) {
	const transitions = [];

	str = str.replace(' ', '_');

	for (let i = 0; i < str.length; i++) {
		const ch = str[i];
		transitions.push({
			current: {
				state: 'q' + i,
				reads: Machine.BLANK
			},
			transitTo: {
				state: 'q' + (i + 1),
				writes: ch,
				go: Machine.RIGHT
			}
		});
	}

	let L = str.length - 1;
	transitions.push({
		current: {
			state: 'q' + (L + 1),
			reads: Machine.BLANK
		},
		transitTo: {
			state: 'q' + (L + 2),
			writes: Machine.BLANK,
			go: Machine.HALT
		}
	});

	const machine = new Machine('Test');
	machine.transitions = transitions;
	machine.initialState = 'q0';
	machine.acceptedState = 'q1' + (L + 2);

	return machine;
}

// plz use std-out
const machine = generateMachineFrom ('Mika');
// const code = machine.asCode();
// console.log(code);

machine.compile ();
// machine.setInput ('RAZAFY BE');
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