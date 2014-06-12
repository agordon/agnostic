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
//name,  path,         suffix,   expected-result
["b1",	"foo.txt",	"",	"foo.txt"],
["b2",	"foo",		"",	"foo"],
["b3",	"/bar/foo.txt",	"",	"foo.txt"],
["b4",	"/foo/",	"",	"foo"],
["b5",	"/",		"",	"/"], //NOTE: different than NodeJS's path.basename
["b6",	"///",		"",	"/"], //NOTE: different than NodeJS's path.basename
["b7",	"///.",		"",	"."],
["b8",	"foo///",	"",	"foo"],
["b9",	"///foo",	"",	"foo"],
["b10",	"/// ",		"",	" "],
["b11",	" ///",		"",	" "],
["b12", "",		"",	"."], //POSIX Basename(1) case 1
["b13", "//",		"",	"/"], //POSIX Basename(1) case 2
["b14", "foo.txt",	"txt",	"foo."], //POSIX Basename(2) case 6
["b15", "foo.txt",	".txt",	"foo"], //POSIX Basename(2) case 6
["b16", "/foo.txt",	".txt",	"foo"], //POSIX Basename(2) case 6
["b17", "foo.txt",	"foo.txt","foo.txt"], //NOTE: different than NodeJS's path.basename (POSIX says remove suffix ONLY if it is not equal to the path).
]

var dirname_tests = [
["d1",	"foo",			"."],
["d2",	".",			"."],
["d3",	"/",			"/"],
["d4",	"/foo/../",		"/foo"],
["d5",	"/foo/.././",		"/foo/.."],
["d6",	"foo/bar",		"foo"],
["d7",	"///",			"/"],
["d8",	"/usr/lib",		"/usr"], //Tests from POSIX dirname(3) page
["d9",	"/usr/",		"/"],
["d10",	"usr",			"."],
["d11",	"/",			"/"],
["d12",	".",			"."],
["d13",	"..",			"."],
["d14",	"",			"."],
["d15",	null,			"."],
["d16",	"//",			"//"], // Tests from POSIX dirname(1) page
["d17",	"/a/b/",		"/a"],
["d18",	"//a//b//",		"//a"],
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
		var suffix, output, expected_output;

		//Ugly hard-code hack for 'basename' tests with 4 items.
		if (tests[i].length==4) {
			suffix = tests[i][2];
			expected_output = tests[i][3];
			output = func(input,suffix);
		} else {
			expected_output = tests[i][2];
			output = func(input);
		}

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
