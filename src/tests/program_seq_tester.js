/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramSeq Class Tester
 */

var assert = require('assert');
require('utils/object_utils');
require('utils/time_utils');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ProgramBase = require('programs/program_base');
var ProgramSeq = require('programs/seq');

var os = new OperatingSystem.OperatingSystem();
var fs = new FileSystem.FileSystem();

function run_seq(params)
{
	var ps = new ProcessState.ProcessState(os,fs);
	ps.stdin = new Streams.InputStream();
	ps.stdout = new Streams.OutputStream();
	ps.stderr = new Streams.OutputStream();

	var s = new ProgramSeq.ProgramSeq();
	params.unshift("/bin/seq");
	var exit_code = s.run(ps,params);
	var stdout = ps.stdout.__get_lines().join("\n");
	var stderr = ps.stderr.__get_lines().join("\n");

	var result = { "exit_code" : exit_code } ;
	if (stdout)
		result["stdout"] = stdout + "\n";
	if (stderr)
		result["stderr"] = stderr + "\n" ;

	return result;
}

/*
Each Test contains:
1. Test Name (string)
2. Command-line parameters (array of strings)
3. Expected output (object with 'exit_code', 'stdout', 'stderr') - used with assert.deepEqual
*/

var try_help = "Try 'seq' for more information.\n";

var tests = [
["1",  [ "10" ],		{ exit_code: 0, stdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n" }],
["2",  [ "2", "10" ],		{ exit_code: 0, stdout: "2\n3\n4\n5\n6\n7\n8\n9\n10\n" }],
["3",  [ "2", "3", "10" ],	{ exit_code: 0, stdout: "2\n5\n8\n" }],
["w1", [ "-w", "8", "10" ],	{ exit_code: 0, stdout: "08\n09\n10\n" }],
["s1", [ "-s,", "8", "10" ],	{ exit_code: 0, stdout: "8,9,10\n" }],
["s2", [ "-s",",", "8", "10" ],	{ exit_code: 0, stdout: "8,9,10\n" }],
["s3", [ "-w", "-s,", "8","10"],{ exit_code: 0, stdout: "08,09,10\n" }],
["n1",  [ "10", "1", "1" ],	{ exit_code: 0 }],
["n2",  [ "10", "-1", "1" ],	{ exit_code: 0, stdout: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n" }],
["f1",  [ "2.2" ],		{ exit_code: 0, stdout: "1\n2\n" }],
["f2",  [ "0.9", "0.3", "2.2" ],{ exit_code: 0, stdout: "0.9\n1.2\n1.5\n1.8\n2.1\n" }],
["c1",  [ "-f","%04f", "4" ],	{ exit_code: 0, stdout: "0001\n0002\n0003\n0004\n" }],

["e1",  [ ],			{ exit_code: 1, stderr: "seq: missing operand\n" + try_help }],
["e2",  [ "5apples" ],		{ exit_code: 1, stderr: "seq: invalid floating point argument: 5apples\n" + try_help }],
["e3",  [ "1","2","3","4" ],	{ exit_code: 1, stderr: "seq: extra operand: '4'\n" + try_help }],

];

for(var t in tests) {
	var name   = tests[t][0];
	var argv   = tests[t][1];
	var expect = tests[t][2];

	console.log("Test '" + name + "'");
	var result = run_seq(argv);
	assert.deepEqual( result, expect );
}
