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


var fnmatch_tests = [

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

];


fnmatch_tests.forEach(function(test){
	var name = test[0];
	var input = test[1];
	var pattern = test[2];
	var flags = test[3];
	var expect = test[4];

	var anchor_start = ( flags.indexOf('^') != -1) ;
	var anchor_end   = ( flags.indexOf('$') != -1) ;
	var non_greedy   = ( flags.indexOf('?') != -1) ;

	var result = path_utils.__fnmatch(pattern,input,
					anchor_start,anchor_end, !non_greedy);

	if (result == expect)
		console.log(name + ": OK");
	else
		console.log(name + ": FAILED");
	assert.equal ( result, expect ) ;
});
