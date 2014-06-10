/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
Test (more of a template) of running two programs, in a pipe.

The test emulates the following pipe:
	seq 10 | tail -n 4 | cat -nE

NOTE:
Passing STDIN to STDOUT is done explicitly,
not through "real" OS pipes.
*/
"use strict";

var assert = require('assert');
var ob_utils = require('utils/object_utils');
var time_utils = require('utils/time_utils');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ProgramBase = require('programs/program_base');
var ProgramSeq = require('programs/seq');
var ProgramTail = require('programs/tail');
var ProgramCat = require('programs/cat');

function run_program(parent_process_state, program_module, argv, stdin)
{
	if (! (parent_process_state instanceof ProcessState))
		throw new TypeError("run_program() called with wrong parameter (1st param is not ProcessState)");

	//TODO: Replace this with a "ProcessState.clone()" method
	var ps = parent_process_state.clone();

	if (stdin !== null) {
		if (! (stdin instanceof Streams.InputStream))
			throw new TypeError("run_program() called with wrong stdin parameter (not a Stream.InputStream)");
		ps.stdin = stdin ;
	}

	var program_obj = new program_module();
	var program_name = program_obj.program_name;

	var args = [ program_name ]; //argv[0] is the program name
	args = args.concat(argv);

	program_obj.run(ps, args);

	return ps;
}


var os = new OperatingSystem();
var fs = new FileSystem();

// 'ps' is the ProcessState of the "parent"
// (i.e. the shell, or the process doing the fork+exec)
var ps = new ProcessState(os,fs);

//Run the first program: 'seq 10'
var child_ps = run_program(ps, ProgramSeq, ["10"], null);
// Add STDERR to parent's STDERR (emulating sharing STDERR)
ps.stderr.put_lines(child_ps.stderr.__get_lines());

//Run the second program: 'tail -n 4'
var s2 = new Streams.InputStream();
s2.__set_lines(child_ps.stdout.__get_lines());
var child2_ps = run_program(ps, ProgramTail, ["-n","4"], s2);
// Add STDERR to parent's STDERR (emulating sharing STDERR)
ps.stderr.put_lines(child2_ps.stderr.__get_lines());

//Run the third program: 'cat -En'
var s3 = new Streams.InputStream();
s3.__set_lines(child2_ps.stdout.__get_lines());
var child3_ps = run_program(ps, ProgramCat, ["-nE"], s3);
// Add STDERR to parent's STDERR (emulating sharing STDERR)
ps.stderr.put_lines(child3_ps.stderr.__get_lines());

// Add the last child's STDOUT to parent's STDOUT
ps.stdout.put_lines(child3_ps.stdout.__get_lines());

// Send STRERR from children to parent's STDERR
if (!ps.stderr.__is_empty())
	console.error( ps.stderr.__get_lines().join("\n"));


// Send STDOUT from LAST child to parent's STDOUT
var out = ps.stdout.__get_lines();
console.log( out.join("\n"));


// The emulated pipe was "seq 10 | tail -n 4 | cat -nE".
// This is the expected output, if the pipe succceeded.
assert.deepEqual ( out, ["     1  7$",
			 "     2  8$",
			 "     3  9$",
			 "     4  10$"]);

process.exit(child3_ps.last_exit_code);
