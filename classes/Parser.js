const fs = require ('fs');
const Machine = require ('./Machine');

module.exports = class Parser {
    parse (file_path) {
        const content = fs.readFileSync (file_path).toString();
        let rows = content.split(/[\n\r]+/);
        let res = [];
        for (let row of rows) {
            let trimed = row.trim ();
            if (trimed != '')
                res.push (trimed);
        }

        let [name, init, accept] = res.slice(0, 3).map(it => {
            return it.split(/:[ ]*/).pop();
        });

        const machine = new Machine (name, init, accept);
        let left = res.slice (3);
        while (left.length > 0) {
            let curr = left.shift();
            let next = left.shift();
            if (next == undefined) {
                throw Error ('Error after, next state not defined for ' + curr);
            }
            let [c_state, reads] = curr.replace(/[ ]+/g, '').split(',');
            let [n_state, writes, go] = next.replace(/[ ]+/g, '').split(',');

            machine.transitions.push ({
                current: {
                    state: c_state,
                    reads: reads
                },
                transitTo: {
                    state: n_state,
                    writes: writes,
                    go: go
                }
            });
        }

        return machine;
    }
}