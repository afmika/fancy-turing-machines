const Parser = require("./classes/Parser");
const invalid = x => x === null || x === '' || x === undefined;

(() => {
    const how_to = () => {
        console.log('node afturing.js filename input [millis]');
    };

    let [ , , filename, input_value, millis] = process.argv;
    
    if (invalid(filename)) {
        console.error('=> filename not provided');
        how_to();
        return;
    }
    if (invalid(input_value)) {
        console.warn ('no input given -- blank used');
        input_value = '_';
    }

    if (millis != undefined && parseInt(millis) === NaN) {
        console.error ('millis must be a valid integer');
        return;
    }

    const parser = new Parser ();
    const machine = parser.parse (filename);
    machine.compile ();
    // machine.setInput (1010101); // reject
    machine.setInput (input_value); // accept

    machine.show ();
    console.log('[-] State '  + machine.state);

    let interval = setInterval (() => {
        machine.next ((verdict, tape_array, cursor_pos, error) => {
            console.clear();
            console.log('[-] State '  + machine.state);
            machine.show ();
            if (verdict || error) {
                clearInterval (interval);
                console.log(verdict, 'curr_pos = ' + cursor_pos);
                if (error) 
                    console.error (error.message);
            }
        });
    }, millis || 500);
}) ();
