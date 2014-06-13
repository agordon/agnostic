/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
An interactive shell Emulator
*/

"use strict";

var assert = require('assert');
var readline = require('readline');

var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');

var load_shell_parser = require('utils/shell_parser_loader');
var shell_parser = load_shell_parser();

var ShellExecutor = require('shell/shell_executor2');

/* Load programs */
var programs = { } ;
var known_programs = [
			"cat",
			"cut",
			"date",
			"echo",
			"false",
			"head",
			"printf",
			"seq",
			"tac",
			"tail",
			"true",
			"wc"
		     ];

for (var i in known_programs) {
	var progname = known_programs[i];
	var prog_module = require('programs/' + progname);
	programs[progname] = prog_module;
}

var os = new OperatingSystem();
var fs = new FileSystem();
var ps = new ProcessState(os,fs);
var sh = new ShellExecutor(ps);


/*
When the Shell Executor wants to run an external command
(i.e. not a shell-builtin), it uses this call back.
*/
sh.set_external_program_callback(function(process_state,command_name,argv){
	if ( command_name in programs ) {
		var prog_constructor = programs[command_name];
		var prog_obj = new prog_constructor();
		return prog_obj.run(process_state,argv);
	} else {
		process_state.stderr.put_line("Agnostic Shell Emulation error: unknown command '" + command_name + "'");
		return 1;
	}
});

function run_shell_command(text)
{
	var cmd,exit_code;
	try {
		cmd = shell_parser.parse(text);
	} catch (e) {
		console.error("Shell-Parser failed on command '" + text + "'");
		throw e;
	}
	try {
		exit_code = sh.ExecuteCommand(cmd);
	} catch (e) {
		console.error("Shell-Executor failed on command '" + text + "'");
		throw e;
	}
	var stdout = ps.stdout.__get_lines();
	var stderr = ps.stderr.__get_lines();

	var result = { };
	if (exit_code !== 0)
		result["exit_code"] = exit_code;
	if (stdout.length>0)
		result["stdout"] = stdout;
	if (stderr.length>0)
		result["stderr"] = stderr;

	return result;
}



//
// Prompt loop starts here
//
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('$ ');
rl.prompt();

rl.on('line', function(line) {
	var result = run_shell_command(line);
	if ( 'stdout' in result )
		console.log(result.stdout.join("\n"));
	if ( 'stderr' in result )
		console.error(result.stderr.join("\n"));

	rl.prompt();
}).on('close', function() {
  process.exit(0);
});

