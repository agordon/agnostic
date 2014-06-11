/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
Path Utils Tester
*/

var assert = require('assert');
var path_utils = require('utils/path_utils');

var basename_tests = [
["b1",	"foo.txt",		"foo.txt"],
["b2",	"foo",			"foo"],
["b3",	"/bar/foo.txt",		"foo.txt"],
["b4",	"/foo/",		"foo"],
["b5",	"/",			"/"], //NOTE: different than NodeJS's path.basename
["b6",	"///",			"/"], //NOTE: different than NodeJS's path.basename
["b7",	"///.",			"."],
["b8",	"foo///",		"foo"],
["b9",	"///foo",		"foo"],
["b10",	"/// ",			" "],
["b11",	" ///",			" "],
]

var dirname_tests = [
["d1",	"foo",			"."],
["d2",	".",			"."],
["d3",	"/",			"/"],
["d4",	"/foo/../",		"/foo"],
["d5",	"/foo/.././",		"/foo/.."],
["d6",	"foo/bar",		"foo"],
["d7",	"///",			"/"],
];

var canon_tests = [
["n1",	"foo.txt",		"foo.txt"],
["n2",	"/foo.txt",		"/foo.txt"],
["n3",	"../foo.txt",		"../foo.txt"],
["n4",	"/bar/../foo.txt",	"/foo.txt"],
["n5",	"/bar/./foo.txt",	"/bar/foo.txt"],
["n6",	"/./foo.txt",		"/foo.txt"],
["n7",	"./foo.txt",		"foo.txt"],
["n8",	"/foo/bar/",		"/foo/bar"],
["n9",	"/foo/bar/./",		"/foo/bar"],
["n10",	"/foo/bar/.",		"/foo/bar"],
["n11",	"/foo/bar/../",		"/foo"],
["n12",	"/",			"/"],
["n13",	"/tmp/",		"/tmp"],
["n14",	"foo/bar/",		"foo/bar"],
["n15",	"./foo/bar/",		"foo/bar"],
];


var pass_count = 0 ;
var fail_count = 0;

function run_tests(func, func_name, tests)
{
	for (var i in tests) {
		var name = tests[i][0];
		var input = tests[i][1];
		var expected_output = tests[i][2];

		var output = func(input);
		if ( output === expected_output ) {
			console.log(func_name + ": " + name + " OK");
			pass_count++;
		} else {
			console.log(func_name + ": " + name + " FAILED: " +
				   " expected '" + expected_output + "' got '" +
				   output + "'");
			fail_count++;
		}
	}
}

run_tests(path_utils.basename, 'basename',  basename_tests);
run_tests(path_utils.dirname,  'dirname',   dirname_tests);
run_tests(path_utils.canonicalize,'canonicalize', canon_tests);

console.log ("--Path Utils tester--");
console.log ("pass: " + pass_count);
console.log ("fail: " + fail_count);

process.exit( fail_count>0 ) ;
