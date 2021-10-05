module.exports = class Machine {
    static BLANK = '_';
    static RIGHT = '>';
    static LEFT = '<';
    static HALT = '-';

    constructor(name, init, accept) {
        this.name = name;
        this.initialState = init;
        this.acceptedState = accept;
        this.transitions = [];
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

            index++;
        }

    }
}