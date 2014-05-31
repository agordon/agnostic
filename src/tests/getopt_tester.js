/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
Test the GetOpt module.

GetOpt module:
	Github:	    https://github.com/davepacheco/node-getopt
	License:    MIT
	Written by: David Pacheco
	+ few modifications by Gordon.
*/

var assert = require('assert');

var mod_getopt = require('utils/posix-getopt');
var parser, option;

/* Test "getopt" module,
   with parameter list similar to head(1).

   The function returns TRUE if the given parameters given are valid.
*/
function test_getopt_head(params)
{
	console.log("parsing command line: '" + params.join(" ") +"'");

	var parser = new mod_getopt.BasicParser(':c:(bytes)n:(lines)q(quiet)\u1000(silent)v(verbose)', params );

	var result = {} ;

	while ((option = parser.getopt()) !== undefined) {
		switch (option.option) {
			case 'c':
				console.log('option -c/--bytes=' + option.optarg);
				result["c"] = option.optarg ;
				break;

			case 'n':
				console.log('option -n/--lines=' + option.optarg);
				result["n"] = option.optarg ;
				break;

			case 'q':
				console.log('option -q/--quiet');
				result["q"] = true ;
				break;

			case '\u1000':
				console.log('option --silent');
				result["silent"] = true ;
				break;

			case 'v':
				console.log('option -v/--verbose');
				result["v"] = true ;
				break;

			default:
				return false;
		}
	}

	var non_options = [] ;

	for (var i=parser.optind(); i < params.length ; i++) {
		console.log("non-option parameter: '" + params[i] + "'");
		non_options.push(params[i]);
	}

	if (non_options.length>0)
		result["non_options"] = non_options ;

	return result;
}

assert.deepEqual (
	test_getopt_head([]),
	{ }
);

assert.deepEqual (
	test_getopt_head(["hello"]),
	{ non_options: ["hello" ] }
);

// This should fail (Return false) -
//  "-c" requires an argument
assert.deepEqual ( test_getopt_head(["-c"]), false );

assert.deepEqual (
	test_getopt_head(["-c","12","hello"]),
	{ "c": 12,
	  non_options: ["hello"] }
 );


// First parameter is a non-option (foo),
// which stops option processing - the rest of the parameters
// will be treated as non-options.
assert.deepEqual (
	test_getopt_head(["foo", "-c","12","hello"]),
	{ non_options: [ "foo", "-c", "12", "hello"] }
);


assert.deepEqual (
	test_getopt_head(["-n", "13", "-c","11","hello"]),
	{ "n": 13, "c": 11, non_options: ["hello"] }
);

// two dashs stop option processing: "-c" will be parsed as a non-option parameter.
assert.deepEqual (
	test_getopt_head(["-n", "13", "--", "-c","11","hello"]),
	{ "n": 13, non_options: [ "-c", "11", "hello"] }
);

assert.deepEqual (
	test_getopt_head(["-qv"]),
	{ "q": true, "v": true }
);

assert.deepEqual (
	test_getopt_head(["-q", "-v"]),
	{ "q": true, "v": true }
);

assert.deepEqual (
	test_getopt_head(["--quiet", "-v"]),
	{ "q": true, "v": true }
);

assert.deepEqual (
	test_getopt_head(["-vqn1"]),
	{ "q" : true, "v" : true, "n":1 }
);

assert.deepEqual (
	test_getopt_head(["-vqn1","-"]),
	{ "q" : true, "v": true, "n": 1, non_options: ["-"]}
);

assert.deepEqual (
	test_getopt_head(["--quiet", "--silent"]),
	{ "q": true, "silent": true }
);


