/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* strftime test.
strftime Javascript implementation from:
https://github.com/samsonjs/strftime ) - MIT license

NOTE:
Javascript's EPOCH is in Milliseconds, no seconds - need to multiply by 1000.
*/

var assert = require('assert');
var strftime = require('utils/strftime');
function strftimeUTC(format, time)
{
  return strftime.strftimeTZ(format,time,undefined,0);
}

// Sat Jun 14 00:28:57 UTC 2014
// With GNU Date:
//    $ date -ud @1402705737
var fixed_time = new Date(1402705737 * 1000);


var tests = [
[ "%%",				"%" ],
[ "%F",				"2014-06-14" ],
[ "%R",				"00:28" ],
[ "%T",				"00:28:57" ],
];


var pass_count = 0;
var fail_count = 0 ;

for (var i in tests) {
	var format = tests[i][0];
	var expect = tests[i][1];

	var result = strftimeUTC(format, fixed_time,undefined, 0);

	if ( result === expect ) {
		pass_count++;
		console.log(format + ": OK");
	} else {
		fail_count++;
		console.log(format + ": FAILED");
		console.log("  expected: '" + expect + "'");
		console.log("  result:   '" + result + "'");
	}
}

console.log ("--strftime tests--");
console.log ("pass: " + pass_count);
console.log ("fail: " + fail_count);

process.exit( fail_count>0 ) ;

