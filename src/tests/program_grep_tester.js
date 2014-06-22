/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramGrep Class Tester */
"use strict";

var grep_tests = [
{
	name:"e1",
	exit_code: 1,
	stderr: "grep: Usage: grep [OPTION]... PATTERN [FILE]...\nTry 'grep --help' for more information."
},
{
	name: "g1",
	argv: ["hel"],
	stdin: "hello world",
	stdout: "hello world"
},
{
	name: "g2",
	argv: ["helX"],
	stdin: "hello world",
	exit_code: 1
},
{
	name: "g3",
	argv: ["-w", "hello"],
	stdin: "hello world",
	stdout: "hello world",
},
{
	name: "g4",
	argv: ["-w", "hel"],
	stdin: "hello world",
	exit_code: 1
},
{
	name: "g5",
	argv: ["-i", "HE"],
	stdin: "hello world",
	stdout: "hello world",
},
{
	name: "g6",
	argv: ["-c", "he"],
	stdin: "hello world",
	stdout: "1"
},
{
	name: "g7",
	argv: ["-l", "he"],
	stdin: "hello world",
	stdout: "(standard input)"
},
{
	name: "g8",
	argv: ["-n", "he"],
	stdin: "hello world",
	stdout: "1:hello world",
},
{
	name: "f1",
	argv: ["r","/foo.txt"],
	stdout: "world\nbar"
},
{
	name: "f2",
	argv: ["[rz]$","/foo.txt"],
	stdout: "bar\nbaz"
},
{
	name: "f3",
	argv: ["-x", "[[:alpha:]]*","/foo.txt"],
	stdout: "hello\nworld\nfoo\nbar\nbaz"
},
{
	name: "f4",
	argv: ["-q", "XYZ","/foo.txt"],
	exit_code: 1
},
{
	name: "f5",
	argv: ["-vq", "XYZ","/foo.txt"],
	exit_code: 0
},
//TODO: Add many more tests for BRE, ERE.
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem();
var fl = fs.openfile("/foo.txt",true);
fl.write(["hello","world","foo","bar","baz"]);
fl=null;

var ProgramGrep = require('programs/grep');

// run tests
run_program_tests("grep",ProgramGrep, grep_tests,fs);
