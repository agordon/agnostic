/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramPaste Class Tester */
"use strict";

var paste_tests = [
{
	//empty input => empty output, no error
	name:"p1",
	exit_code: 0,
},
{
	name: "p2",
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
},
{
	name: "p3",
	argv: ["-"],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
},
{
	name: "p4",
	argv: [ "-s" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1\t2\t3\t4\t5\t6\t7\t8\t9\t10",
},
{
	name: "p5",
	argv: [ "-s", "-d," ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1,2,3,4,5,6,7,8,9,10",
},
{
	name: "p6",
	argv: [ "-", "-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1\t2\n3\t4\n5\t6\n7\t8\n9\t10",
},
{
	// because of "-s", the first file (STDIN) is first read and pasted,
	// then the second file (STDIN again, this time empty) is printed as an empty line
	// seq 10 | paste -s - -
	name: "p7",
	argv: [ "-s", "-", "-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1\t2\t3\t4\t5\t6\t7\t8\t9\t10\n\n",
},
{
	//Multiple delimiters
	// seq 10 | paste -d,= - - - -
	name: "p8",
	argv: [ "-d,=", "-", "-","-","-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1,2=3,4\n5,6=7,8\n9,10=,",
},
{
	name: "f1",
	argv: [ "foo.txt", "-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "a\t1\nb\t2\nc\t3\nd\t4\ne\t5\nf\t6\ng\t7\nh\t8\ni\t9\nj\t10",
},
{
	name: "f2",
	argv: [ "-d,", "foo.txt", "-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "a,1\nb,2\nc,3\nd,4\ne,5\nf,6\ng,7\nh,8\ni,9\nj,10",
},
{
	// Same file specified twice: content is duplicated
	name: "f3",
	argv: [ "-d,", "foo.txt", "-", "foo.txt" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "a,1,a\nb,2,b\nc,3,c\nd,4,d\ne,5,e\nf,6,f\ng,7,g\nh,8,h\ni,9,i\nj,10,j",
},
{
	// STDIN specified twice: content is shared
	// (also: file has more lines than STDIN)
	name: "f4",
	argv: [ "-d,", "-", "foo.txt", "-" ],
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
	stdout: "1,a,2\n3,b,4\n5,c,6\n7,d,8\n9,e,10\n,f,\n,g,\n,h,\n,i,\n,j,",
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem();
var fl = fs.openfile("/foo.txt",true);
fl.write(["a","b","c","d","e","f","g","h","i","j"]);
fl=null;

var ProgramPaste = require('programs/paste');

// run tests
run_program_tests("paste",ProgramPaste, paste_tests,fs);
