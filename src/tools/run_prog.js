/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Generic Program Runner */

var nodefs = require('fs');
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
var ps = new ProcessState.ProcessState(os,fs);
ps.stdin = new Streams.InputStream();
ps.stdout = new Streams.OutputStream();
ps.stderr = new Streams.OutputStream();


if (process.argv.length<3) {
	console.error("Missing Javascript program name to run (programs in ./src/node_modules/progams)");
	process.exit(1);
}

var program_name = process.argv[2];
var program_args = process.argv.slice(2); //first item is the program name

//Read STDIN, in one chunk
ps.stdin.fill_input_callback = function() {
	var stdin_text = nodefs.readFileSync('/dev/stdin').toString();

	//Remove last linebreak, if any (to prevent an extranous empty last line)
	stdin_text = stdin_text.replace(/\n$/,"");

	var stdin_lines = stdin_text.split("\n");
	return stdin_lines ;
}

//Try to load the program's source code
var program_module = {} ;
try {
	program_module = require('programs/' + program_name + ".js");
} catch(e) {
	console.error("Failed to load program source code for '" + program_name + "'");
	console.error("looked in 'src/node_modules/programs/" + program_name + ".js'");
	console.error("Exception was:\n" + e );
	process.exit(1);
}

//Ugly Hack:
//	It is implicitly assumed that each program's source code
//	exports ONE key into the modules.export, and that key is
//	the program's class (or construtor function).
var k = GetOneKey(program_module);
var program = new program_module[k]();

try {
	var exit_code = program.run(ps,program_args);
	var stdout = ps.stdout.__get_lines().join("\n");
	var stderr = ps.stderr.__get_lines().join("\n");

	if (stdout)
		process.stdout.write(stdout + "\n");
	if (stderr)
		process.stderr.write(stderr + "\n");

	process.exit(exit_code);
} catch (e) {
	console.error("Agnostic Emulation error for program '" + program_name + "'");
	console.error("Program = ");
	console.error(JSON.stringify(program,undefined,2));
	console.error("Exception = ");
	console.error(e);
	console.error(e.stack);
}
