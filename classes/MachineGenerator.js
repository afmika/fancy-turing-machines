const Constant = require('./Constant');
const Machine = require('./Machine');

module.exports = class MachineGenerator {
    /**
     * Creates a non-compiled working Turing Machine that displays a given string of any length
     * @param {string} str 
     * @returns 
     */
    static fromString (str) {
        const transitions = [];
    
        str = str.replace(' ', '_');
    
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            transitions.push({
                current: {
                    state: 'q' + i,
                    reads: Constant.BLANK
                },
                transitTo: {
                    state: 'q' + (i + 1),
                    writes: ch,
                    go: Constant.RIGHT
                }
            });
        }
    
        let L = str.length - 1;
        transitions.push({
            current: {
                state: 'q' + (L + 1),
                reads: Constant.BLANK
            },
            transitTo: {
                state: 'q' + (L + 2),
                writes: Constant.BLANK,
                go: Constant.HALT
            }
        });

        // console.log(transitions);
    
        const machine = new Machine('Test');
        machine.transitions = transitions;
        machine.initialState = 'q0';
        machine.acceptedState = 'q' + (L + 2);
    
        return machine;
    }
}
