/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Test 'fnmatch' functionality */

var assert = require('assert');
var ob_utils = require('utils/object_utils');
var str_utils = require('utils/string_utils');
var path_utils = require('utils/path_utils');


var fnmatch_match_tests = [

//name,  input		pattern		flags		should_match
//					^ - anchor start
//					$ - anchor end
//					? - non-greedy
["f1",	"abcde",	"d?",		'$',		true],
["f2",	"abcde",	"d?",		"^",		false],
["f3",	"abcde",	"d?",		"",		true],
["f4",	"abcde",	"d?",		'$?',		true],

["f5",	"abcde",	"e?",		'$',		false],
["f6",	"abcde",	"e?",		"",		false],

["f7",	"abcde",	"*",		"$",		true],
["f8",	"abcde",	"*",		"^",		true],
["f9",	"abcde",	"*",		"?",		true],

["f10",	"abcdeee",	"d*",		"$",		true],
["f11",	"abcdeee",	"b*e",		"$",		true],

/* Will be used in shell expansion, such as:
    FILE=/tmp/foo/bar/agnostic.tar.gz.gpg.sig"
    echo ${FILE%.*sig}    # non-greedy (shortest match), removes '.sig'
    echo ${FILE%%.*sig}   # greedy (longest match), removes all extensions
*/
["f12", "agnostic.tar.gz.gpg.sig", ".*sig", "$",        true],
["f13", "agnostic.tar.gz.gpg.sig", ".*sig", "$?",       true],

/* Test character classes */
["f14", "abcd",		"[a-c]",	"^",		true],
["f15", "abcd",		"[a-c]*",	"^",		true],
["f16", "abcd",		"[a-c]",	"$",		false],

["f17", "a",		"[[:xdigit:]]",	"^",		true],
["f18", "q",		"[[:xdigit:]]",	"^",		false],

//name,  input		pattern		flags		should_match
//					^ - anchor start
//					$ - anchor end
//					? - non-greedy
["m1",	"abcde",	"d?",		'$',		"de"],
["m2",	"abcde",	"d?",		"",		"de"],
["m3",	"abcde",	"d?",		'$?',		"de"],

["m4",	"abcde",	"*",		"$",		"abcde"],
["m5",	"abcde",	"*",		"^",		"abcde"],
["m6",	"abcde",	"*",		"?",		""],
["m7",	"abcde",	"?*",		"$",		"abcde"],
["m8",	"abcde",	"?*",		"^",		"abcde"],
["m9",	"abcde",	"?*",		"?",		"a"],

["m10",	"abcdeee",	"d*",		"$",		"deee"],
["m11",	"abcdeee",	"d*",		"?",		"d"],
["m12",	"abcdeee",	"b*e",		"$",		"bcdeee"],
["m13",	"abcdeee",	"b*e",		"?",		"bcde"],

/* Will be used in shell expansion, such as:
    FILE=/tmp/foo/bar/agnostic.tar.gz.gpg.sig"
    echo ${FILE%.*sig}    # non-greedy (shortest match), removes '.sig'
    echo ${FILE%%.*sig}   # greedy (longest match), removes all extensions
*/
["m14", "agnostic.tar.gz.gpg.sig", ".*sig", "$",        ".tar.gz.gpg.sig"],

/* TODO: FIX THIS
["m15", "agnostic.tar.gz.gpg.sig", ".*sig", "$?",       ".sig"],
*/

];


fnmatch_match_tests.forEach(function(test){
	var name = test[0];
	var input = test[1];
	var pattern = test[2];
	var flags = test[3];
	var expect = test[4];

	var anchor_start = ( flags.indexOf('^') != -1) ;
	var anchor_end   = ( flags.indexOf('$') != -1) ;
	var non_greedy   = ( flags.indexOf('?') != -1) ;

	var result = path_utils.__fnmatch_exec(pattern,input,
					anchor_start,anchor_end, !non_greedy);

	if (ob_utils.IsBoolean(expect)) {
	/* If the expected result is TRUE/FALSE, just check the pattern matched */
		result = (result)?true:false;
	} else {
	/* If the expected result is a string, check the returned matched string,
           (implied: string 'expect' should ALWAYS match) */
console.log( "result = " + JSON.stringify(result));
		assert ( result ) ;
		result = input.substr ( result.pos, result.len ) ;
	}

	if (result === expect)
		console.log(name + ": OK");
	else
		console.log(name + ": FAILED");
	assert.equal ( result, expect ) ;
});
