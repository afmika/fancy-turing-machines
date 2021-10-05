const Machine = require ('./classes/Machine');

function generateMachineFrom (str) {
	const transitions = [];
	
	str = str.replace(' ', '_');
	
	for (let i = 0; i < str.length; i++) {
		const ch = str[i];
		transitions.push({
			current : {state : 'q' + i, reads : Machine.BLANK},
			transitTo : {state : 'q' + (i + 1), writes : ch, go : Machine.RIGHT}
		});
	}
	
	let L = str.length - 1;
	transitions.push({
		current : {state : 'q' + (L + 1), reads : Machine.BLANK},
		transitTo : {state : 'q' + (L + 2), writes : Machine.BLANK, go : Machine.HALT}
	});
	
	const machine = new Machine ('Test');
	machine.transitions = transitions;
	machine.initialState = 'q0';
	machine.acceptedState = 'q' + (L + 2);
	
	return machine;
}

// plz use std-out
const code = generateMachineFrom ('Mika').asCode();
console.log(code);