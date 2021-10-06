let str = '111110011110011';
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
        let longestMatch = '';
        for (let e = s + 2; e < str.length; e++) {
            let prefix = str.substring(s, e);
            let match = str.match(new RegExp(prefix, 'g')) || [];
            if (match.length >= 2) {
                if (longestMatch.length < prefix.length)
                    longestMatch = prefix;
            }
        }
        if (longestMatch.length != 0) {
            // delete the matches
            str = str.replace(new RegExp(longestMatch, 'g'), '');
            reusable_list.push (longestMatch);
            return searchAndReplace (str, reusable_list);
        }
    }

    return reusable_list;
}

console.log(searchAndReplace (str, []));