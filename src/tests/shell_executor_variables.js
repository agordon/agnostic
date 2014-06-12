/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables when executing external programs.

Specifically, tests the interaction between:
   ShellExecutor (see 'runExternalCommand()' )
   ProcessState  (see 'clone' and ENV related functions)
   ShellState

NOTE:
These tests DO NOT yet test the ShellExecutor's ability to expand variables
(e.g. no "${VAR}" in the tested command line). There's another unit test for that.


TODO:
Implement and Test inheriting ENV variables from parent processes.
(and make them all exportable by default).
*/
"use strict";

var assert = require('assert');

var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');

var load_shell_parser = require('utils/shell_parser_loader');
var shell_parser = load_shell_parser();

var ShellExecutor = require('shell/shell_executor2');

var os = new OperatingSystem();
var fs = new FileSystem();
var ps = new ProcessState(os,fs);

var sh = new ShellExecutor(ps);

/*
When the Shell Executor wants to run an external command
(i.e. not a shell-builtin), it uses this call back.
For this test, we ignore the actual command line and parameters,
and simply prints to STDOUT the environment variables we got,
very similar to 'env(1)' .

This callback (representing an external program) shares the same
STDOUT as the calling shell - so we print the ENV variables to STDOUT.

The result this function return will be checked below with 'assert.deepEqual'.
*/
sh.set_external_program_callback(function(process_state,command_name,argv){
	var env = process_state.environ();
	var keys = Object.keys(env);
	keys.sort();
	for (var i in keys) {
		var name = keys[i];
		var value = env[name];
		process_state.stdout.put_line(name + "=" + value);
	}
	return 0;
});

/* Runs a shell command.
   1. 'cmd' is a string with a valid shell command.
   2. The string will be parsed using the POSIX shell parser
   3. The parse-tree will be executed.
   4. The returned exit code is expected to be zero
   5. STDOUT will be returned as array of strings (one per line)
*/
function run_shell_command(text)
{
	var cmd = shell_parser.parse(text);
	var exit_code = sh.ExecuteCommand(cmd);
	if (exit_code !== 0) {
		var msg = "shell command '" + text + "' returned non-zero exit code";
		console.error(msg);
		console.error("shell STDERR = ");
		console.error(ps.stderr.__get_lines().join("\n"));
		throw msg;
	}

	return ps.stdout.__get_lines();
}

//Test 1: Internal variable (not exported) -
// the external program should not see any ENV variables
run_shell_command("FOO=BAR");
var out = run_shell_command("env"); //since "env" is not a shell-builtin, it will trigger the external program callback.
assert.deepEqual( out, [] );

//Test 2: mark "FOO" as exportable - the shell should pass it to the external program
run_shell_command("export FOO");
var out = run_shell_command("env");
assert.deepEqual( out, [ "FOO=BAR" ] );

//Test 3: change its value, since it's exportable, the external program should see the new value
run_shell_command("FOO=ZOOM");
var out = run_shell_command("env");
assert.deepEqual( out, [ "FOO=ZOOM" ] );

//Test 4: unset it, the program should not see it again
run_shell_command("unset FOO");
var out = run_shell_command("env");
assert.deepEqual( out, [ ] );

//Test 5: Set it again
run_shell_command("export FOO=LOO");
var out = run_shell_command("env");
assert.deepEqual( out, [ "FOO=LOO" ] );

//Test 6: Add variable assignment for the program only
run_shell_command("OOO=PPP"); //internal (non-exported) variable)
run_shell_command("export FOO=LOO");
var out = run_shell_command("A=B env");
assert.deepEqual( out, [ "A=B", "FOO=LOO" ] );
//show all variables (including non-exported) in the shell)
// OOO should be there (it's internal),
// but "A" should not be (it was specific for the previous program execution)
var out = run_shell_command("set");
assert.deepEqual( out, [ "FOO='LOO'","OOO='PPP'" ] );

//Test 7: Variable override
run_shell_command("unset FOO OOO");
run_shell_command("export A=1 B=2");
var out = run_shell_command("C=3 A=9 env"); //A=9 should override the exported variable above
assert.deepEqual( out, [ "A=9", "B=2", "C=3" ] );
