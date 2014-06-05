#!/usr/bin/env nodejs

/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
This script takes a shell command line as parameter(s),
parses it, and executes it.
*/

require('utils/object_utils');
require('utils/time_utils');
var nodefs = require('fs');
var assert = require('assert');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ProgramBase = require('programs/program_base');
var ProgramShell = require('programs/shell');

/* Load programs */
var program_functions = { } ;
var known_programs = [
			"cat",
			"cut",
			"date",
			"echo",
			"false",
			"head",
			"printf",
			"seq",
			"tail",
			"true",
		     ];

for (var i in known_programs) {
	var progname = known_programs[i];
	var prog_mod = require('programs/' + progname + ".js");
	var prog_key = GetOneKey(prog_mod);
	var prog_function = prog_mod[prog_key]; //the function used with "New" to create the program's object
	program_functions[progname] = prog_function;
}

var input = require("utils/single_cmdline_parameter");
if (input === "") {
	console.error("missing parameter: shell command to parse.");
	process.exit(1);
}

/* Setup the process-state ("current" process will be the shell executor) */
var os = new OperatingSystem.OperatingSystem();
var fs = new FileSystem.FileSystem();
var ps = new ProcessState.ProcessState(os,fs);

//Read STDIN, in one chunk
ps.stdin.fill_input_callback = function() {
	var stdin_text = nodefs.readFileSync('/dev/stdin').toString();

	//Remove last linebreak, if any (to prevent an extranous empty last line)
	stdin_text = stdin_text.replace(/\n$/,"");

	var stdin_lines = stdin_text.split("\n");
	return stdin_lines ;
}

var shell = new ProgramShell.ProgramShell();

for (var name in program_functions) {
	shell.add_external_program(name, program_functions[name]);
}

try {
	var exit_code = shell.run(ps,["/bin/sh", "-c", input]);
	var stdout = ps.stdout.__get_lines().join("\n");
	var stderr = ps.stderr.__get_lines().join("\n");

	if (stdout)
		process.stdout.write(stdout + "\n");
	if (stderr)
		process.stderr.write(stderr + "\n");

	process.exit(exit_code);
} catch (e) {
	console.error("Agnostic Shell Emulation Error");
	console.error("Program = ");
	console.error(JSON.stringify(shell,undefined,2));
	console.error("Exception = ");
	console.error(e);
	console.error(e.stack);
}
