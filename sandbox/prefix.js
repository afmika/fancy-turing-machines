const { match } = require("assert");
const MachineGenerator = require("../classes/MachineGenerator");

let str = 'MIKA_MIKA_YES_MIKA$MIKA$MIKA$MIKA$';
// Objective : represents higher index string in terms of lower indexes if possible (must be prefixes or exact matches)
// eg here we can factorise 1111 and get
// X1100X0011
// then factorise 11 and get
// XY00X00Y
// then finally factorise the 0s
// XYZXZY
// by using X,Y,Z states we could compute the original string

// goal : get the smallest prefix and replace it by an alias letter
// repeat

// a prefix of length 2, can be an exact match
function searchAndReplace (str, reusable_list) {

    // imma bruteforce this
    for (let s = 0; s < str.length; s++) {
        let longestMatch = '', count = 0;
        for (let e = s + 2; e < str.length; e++) {
            let prefix = str.substring(s, e);
            let match = str.match(new RegExp(prefix, 'g')) || [];
            if (match.length >= 2) {
                if (longestMatch.length < prefix.length) {
                    longestMatch = prefix;
                    count = match.length;
                }
            }
        }
        if (longestMatch.length != 0) {
            // delete the matches
            str = str.replace(new RegExp(longestMatch, 'g'), '');
            reusable_list.push ({str : longestMatch, n_match : count});
            return searchAndReplace (str, reusable_list);
        }
    }

    return reusable_list;
}

function findAllIndexes  (str, to_search) {
    let indexes = [], i = str.indexOf(to_search, 0);
    while (i > -1) {
        indexes.push({start : i, end : i + to_search.length - 1});
        i = str.indexOf(to_search, i + to_search.length);
    }
    return indexes;
}


function makeMachine (str) {
    const candidates = searchAndReplace (str, []);
    let res = {};
    for (let candidate of candidates) {
        res[candidate] = findAllIndexes (str, candidate);
    }

    console.log(candidates)

    // const transitions = MachineGenerator.getTransitions(str);
    // // let's replace
    // for (let substr in res) {
    //     let commonState = res[substr][0];
    //     let comTrans = transitions.slice(commonState.start, commonState.end + 1);
    //     for (let idx = 1; idx < res[substr].length; idx++) {
    //         let {start, end} = res[substr][idx];
    //         let trans = transitions.slice(start, end + 1);
    //         console.log(trans[0].current.state + ' to ' + trans[trans.length - 1].current.state + ' should be replaced with ' + 
    //         comTrans[0].current.state + ' to ' + comTrans[comTrans.length - 1].current.state);
    //     }
    // }

    // console.log(res);
}

makeMachine(str);