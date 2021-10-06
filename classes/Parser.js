const fs = require ('fs');
const Machine = require ('./Machine');
const Constant = require ('./Constant');


module.exports = class Parser {
    __clean (item) {
        return item.replace(/[ ]+/g, '');
    }

    parse (file_path) {
        const content = fs.readFileSync (file_path).toString();
        let rows = content.split(/[\n\r]+/);
        let res = [], line = 1;
        for (let row of rows) {
            let trimed = row.trim ();
            if (trimed != '')
                res.push ({str : trimed, line : line});
            line++;
        }

        let [name, init, accept] = res.slice(0, 3).map(it => {
            let [var_name, value] = it.str.split(/:[ ]*/);
            if (value == undefined || value.trim() == '')
                throw 'value badly defined for "' + var_name + '" at line ' + it.line;
            return value;
        });

        const machine = new Machine (name, init, accept);
        let left = res.slice (3);
        while (left.length > 0) {
            let curr = left.shift();
            let next = left.shift();
            
            if (next == undefined)
                throw Error ('Error : "next" state not defined for "' + curr.str + '" at line ' + curr.line);
            
            let [c_state, reads] = this.__clean(curr.str).split(',');
            let [n_state, writes, go] = this.__clean(next.str).split(',');

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