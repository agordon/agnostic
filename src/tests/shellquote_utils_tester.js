/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
Shell Quotes Utillities Tester
*/

var assert = require('assert');
require("utils/shell_quotes");

var split_tests = [
[ "n1",  "hello world",					["hello","world"] ],
[ "n2",  "    hello \t \t world\t\t",			["hello","world"] ],
[ "n3",  "hello\t\t",					["hello"] ],
[ "n4",  "\t\t",					[] ],

// Double quotes
[ "d1",  '"hell"o world',				['"hell"o',"world"] ],
[ "d2",  '"he  "o world',				['"he  "o',"world"] ],
[ "d3",  '"hel\'  "o world',				['"hel\'  "o',"world"] ],
[ "d4",  'foo"ba""r" world',				['foo"ba""r"',"world"] ],

// Single quotes
[ "s1",  "'hell'o world",				["'hell'o","world"] ],
[ "s2",  "'he  'o world",				["'he  'o","world"] ],
[ "s3",  "'hel\"  'o world",				["'hel\"  'o","world"] ],
[ "s4",  "foo'ba''r' world",				["foo'ba''r'","world"] ],

//Single and Double Quotes
[ "m1",  "he'll'\"o \"world",				["he'll'\"o \"world"] ],
[ "m2",  "he'l\"l'\"o' \"world",			["he'l\"l'\"o' \"world"] ],

//TODO: check Backslash+Doublequotes inside double quotes

];


var removequotes_tests = [
["r1",	"hello world",			"hello world"],
["r2",	"hel'lo' world",		"hello world"],
["r3",	"hel'l\"o' world",		"hell\"o world"],
["r4",	'hel"lo"" wo"rld',		"hello world"],
["r5",	'hel"\'lo"" wo"rld',		"hel\'lo world"],
];



/* Test Field Splitting */
for (var i in split_tests) {
	var name = split_tests[i][0];
	var input = split_tests[i][1];
	var expected = split_tests[i][2];

	try {
		var result = ShellQuotesSplit( input ) ;
		assert.deepEqual( result, expected );
		console.log(name + " OK");
	} catch (e) {
		console.log(name + " FAILED");
		throw e;
	}
}

/* Test Quotes Removal */
for (var i in removequotes_tests) {
	var name = removequotes_tests[i][0];
	var input = removequotes_tests[i][1];
	var expected = removequotes_tests[i][2];

	try {
		var result = ShellQuotesRemoveQuotes( input ) ;
		assert.deepEqual( result, expected );
		console.log(name + " OK");
	} catch (e) {
		console.log(name + " FAILED");
		throw e;
	}
}
