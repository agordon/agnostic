/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramBase Class Tester
 */

var assert = require('assert');
require('utils/object_utils');
require('utils/time_utils');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ProgramBase = require('programs/program_base');

var os = new OperatingSystem.OperatingSystem();
var fs = new FileSystem.FileSystem();

/*
 Run a ProgramBase, while optionally skipping an initialization step
 (which should throw an exception)
*/
function run_program_skip_step(step_to_skip)
{
	var ps = {} ;
	var args = [] ;

	if (step_to_skip!==1)
		ps = new ProcessState.ProcessState(os,fs);
	if (step_to_skip!==2)
		ps.stdin = new Streams.InputStream();
	if (step_to_skip!==3)
		ps.stdout = new Streams.OutputStream();
	if (step_to_skip!==4)
		ps.stderr = new Streams.OutputStream();
	if (step_to_skip!==5)
		args.push("/bin/foo");

	var prog = new ProgramBase.ProgramBase();

	var exit_code = prog.run(ps,args);

	return { "exit_code" : exit_code,
		 "ps" : ps };
}


// Test 1-
// Run the program - it should it should run (not throw exception),
// but fail (return exit code 1, STDERR = "not implemented")
{
var test = run_program_skip_step(0);
var exit_code = test.exit_code;
var ps = test.ps ;
assert.strictEqual(exit_code, 1);
assert.strictEqual(ps.stderr.__shift_line(), "Not implemented");
}

// Test 2
// Check "run" with invalid parameters
for (var i=1;i<=5;i++) {
	assert.throws(
		function() { run_program_skip_step(i) },
		/ProgramExecutionError/
	);
}

