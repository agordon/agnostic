/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests VERY PRIMITIVE funtionality of variable assignment,
and Special-Built-in Functions.

Specifically, this tests the ShellState usage inside
the ShellExecutor.

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

/* Runs a shell command.
   1. 'cmd' is a string with a valid shell command.
   2. The string will be parsed using the POSIX shell parser
   3. The parse-tree will be executed.
   4. The returned exit code is expected to be zero
   5. STDOUT will be returned as array of strings (one per line)
*/
function run_shell_command(cmd)
{
	var cmd = shell_parser.parse(cmd);
	var exit_code = sh.ExecuteCommand(cmd);
	if (exit_code !== 0) {
		var msg = "shell command '" + cmd + "' returned non-zero exit code";
		console.error(msg);
		console.error("shell STDERR = ");
		console.error(ps.stderr.__get_lines().join("\n"));
		throw msg;
	}

	return ps.stdout.__get_lines();
}

// Shell Internal: assignment without a command - set shell variables.
run_shell_command("FOO=BAR HELLO=WORLD");

// Shell Special Build-in Utilities
run_shell_command("unset HELLO");
run_shell_command("export FOO");
run_shell_command("readonly A=B");

// List exported variables
var out = run_shell_command("export -p");
assert.deepEqual(out, [ "export FOO='BAR'" ]);

// List readonly variables
var out = run_shell_command("readonly -p");
assert.deepEqual(out, [ "readonly A='B'" ]);

// List all variables
var out = run_shell_command("set");
assert.deepEqual(out, [ "A='B'", "FOO='BAR'" ]);

// run the NULL internal command (should have no effect)
run_shell_command(":");

// run the NULL command, the assignment should not affect the current shell
run_shell_command("FOO=ZOOM :");

//FOO should have the current value (BAR), not "ZOOM" from the above command.
var out = run_shell_command("set");
assert.deepEqual(out, [ "A='B'", "FOO='BAR'" ]);


