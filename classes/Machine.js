module.exports = class Machine {
    static BLANK = '_';
    static RIGHT = '>';
    static LEFT = '<';
    static HALT = '-';
    static TAPE_WINDOW = 10;

    constructor(name, init, accept) {
        this.name = name;
        this.initialState = init;
        this.acceptedState = accept;
        this.transitions = [];
    }

    initMachinery () {
        this.__tape = new Array (Machine.TAPE_WINDOW).fill(Machine.BLANK); // tape
        this.__init_ptr = Math.floor (this.__tape.length / 2) - 1; // current pos
        this.__offset = 0; // current offset
        this.__states_map = {}; // state table
        this.__state = null; // current state
    }

    /**
     * Computes a key given two string
     * @param {string} a 
     * @param {string} b 
     * @returns 
     */
    __key (a, b) {
        return a + ',' + b;
    }

    asCode() {
        this.compile();

        let code = [];
        code.push('name: ' + this.name);
        code.push('init: ' + this.initialState);
        code.push('accept: ' + this.acceptedState);
        code.push('');

        for (const {
                current,
                transitTo
            } of this.transitions) {
            code.push(current.state + ', ' + current.reads);
            code.push(transitTo.state + ', ' + transitTo.writes + ', ' + transitTo.go);
            code.push('');
        }

        return code.join('\n');
    }

    /**
     * Transistion table check
     */
    compile() {
        const invalid = x => x === null || x === undefined || x === '' || x === NaN;

        if (invalid(this.name))
            throw Error('name can not be undefined');

        if (invalid(this.initialState) || invalid(this.acceptedState))
            throw Error('initialState and acceptedState must be defined');

        if (this.transitions.length == 0)
            throw Error('Transition table cannot be empty');

        this.initMachinery ();

        let index = 0;
        for (const {
                current,
                transitTo
            } of this.transitions) {

            if (current) {
                if (invalid(current.state)) throw Error('Must define current.state');
                if (invalid(current.reads)) throw Error('Must define current.reads');
            } else throw Error('current is not well defined at index ' + index);

            if (transitTo) {
                if (invalid(transitTo.state)) throw Error('Must define transitTo.state');
                if (invalid(transitTo.writes)) throw Error('Must define transitTo.writes');
                if (invalid(transitTo.go)) throw Error('Must define transitTo.go');
            } else throw Error('transitTo is not well defined at index ' + index);
            this.__states_map [this.__key(current.state, current.reads)] = transitTo;
            index++;
        }
    }

    /**
     * Define an input, if none is defined, BLANK will be used
     * @param {string} input 
     */
    setInput (input) {
        input += '';
        for (let ch of input) {
            ch = ch == ' ' ? '_' : ch;
            let index = this.ptrIndex(); // computes and resize the __tape array if necessary
            this.__tape [index] = ch;
            this.__offset++;
        }
        this.__offset = 0; // rollback
    }

    ptrIndex () {
        let pos = this.__init_ptr + this.__offset;
        if (pos < 0) {
            this.__tape = ['_', ... this.__tape];
            this.__offset -= 1;
            this.__init_ptr += 1;
            pos = 0;
        }

        if (pos >= this.__tape.length)
            this.__tape.push('_');

        return pos;
    }

    read () {
        return this.__tape[this.ptrIndex()];
    }

    /**
     * @param {Function} fun (verdict : null | accepted | rejected, tape_array, cursor_pos, error?)
     * @returns 
     */
    next (fun) {
        let reads = this.read ();
        if (this.state == null || this.state == undefined)
            this.state = this.initialState;

        const pos = this.ptrIndex();
        let pair = this.__key (this.state, reads);

        if (this.__states_map[pair] == undefined) {
            fun('rejected', this.__tape, pos, Error('Unable to find handler for ' + reads + ' in state ' + this.state));
            return;
        }

        const {state, writes, go} = this.__states_map[pair];
        
        this.state = state;
        this.__tape[pos] = writes;

        
        if (go == Machine.HALT) {
            fun(this.state == this.acceptedState ? 'accepted' : 'rejected', this.__tape, pos);
            return;
        }
        fun(null, this.__tape, pos, null);

        if (go == Machine.LEFT) this.__offset--;
        if (go == Machine.RIGHT) this.__offset++;

    }

    show () {
        let currentPos = this.ptrIndex ();
        let list = this.__tape.map ((v, i) => {
            if (i == currentPos) return '[' + v + ']';
            return v;
        });
        console.log(list.join(' '));
    }
}