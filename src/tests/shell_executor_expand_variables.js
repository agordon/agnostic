/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables expansion.

Specifically, tests the interaction between:
   ShellExecutor (see Token/EnvVar/EnvVarOperation)

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

For this test, we will write EACH command line parameter
to a new line in STDOUT (since we're sharing the calling Shell's STDOUT,
any output here will be passed to the shell, then to the caller
(which is 'run_shell_command'). It will then be compared with 'assert.deepEqual'.
*/
sh.set_external_program_callback(function(process_state,command_name,argv){
	argv.shift(); // skip the first arg: the program's name.
	for (var i in argv) {
		process_state.stdout.put_line(argv[i]);
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


//Create few variables
run_shell_command("FOO=BAR");
run_shell_command("A=B");
run_shell_command('C="HELLO WORLD"'); //a variable with a whitespace

//since "echo" is not a shell-builtin, it will trigger the external program callback.
//test 1: simple expansion
var out = run_shell_command("echo $FOO");
assert.deepEqual( out, [ "BAR" ] );

//test 2: parameter expansion for the arguments happens BEFORE
//        variable assignment. FOO should be still BAR, not ZOO.
var out = run_shell_command("FOO=ZOO echo $FOO");
assert.deepEqual( out, [ "BAR" ] );

//Test 3: double-quoted string
var out = run_shell_command('echo "$FOO"');
assert.deepEqual( out, [ "BAR" ] );

//Test 4: single-quoted string
var out = run_shell_command("echo '$FOO'");
assert.deepEqual( out, [ "$FOO" ] );

//Test 5: compound string
var out = run_shell_command('echo "LO$FOO"');
assert.deepEqual( out, [ "LOBAR" ] );

//Test 6: curly braces
var out = run_shell_command('echo ${FOO}');
assert.deepEqual( out, [ "BAR" ] );

//Test 7: curly braces + more
var out = run_shell_command('echo LO${FOO}HI');
assert.deepEqual( out, [ "LOBARHI" ] );

//Test 8: curly braces + more
var out = run_shell_command('echo ${FOO}$FOO');
assert.deepEqual( out, [ "BARBAR" ] );

//Test 9: two variables
var out = run_shell_command('echo ${A}$FOO');
assert.deepEqual( out, [ "BBAR" ] );

//Test 10: non-existing variable
var out = run_shell_command('echo ==$ZOOM==');
assert.deepEqual( out, [ "====" ] );

//Test 11: single parameter with whitespace
var out = run_shell_command('echo "$FOO BAR"');
assert.deepEqual( out, [ "BAR BAR" ] );

//Test 12: two parameters
var out = run_shell_command('echo "$FOO" "BAR"');
assert.deepEqual( out, [ "BAR", "BAR" ] );

//Test 12: two parameters
var out = run_shell_command('echo "$FOO" "BAR"');
assert.deepEqual( out, [ "BAR", "BAR" ] );

//Test 13: a variable which expands with whitespace, inside doublequotes - single parameter
var out = run_shell_command('echo "$C"');
assert.deepEqual( out, [ "HELLO WORLD" ] );

//Test 14: a variable which expands with whitespace, becomes two parameters
var out = run_shell_command('echo $C');
assert.deepEqual( out, [ "HELLO","WORLD" ] );

//Test 15: field-splitting tricks - this should expand to 'echo uname -s'
run_shell_command('e="me -s"');
var out = run_shell_command('echo una$e');
assert.deepEqual( out, [ "uname","-s" ] );

//Test 16: commands can also contain expanded parameters
// this should expand to 'uname -s' - since we discard the command name,
// the returned value should be '-s'.
run_shell_command('e="me -s"');
var out = run_shell_command('una$e');
assert.deepEqual( out, [ "-s" ] );

//Test 17: Assignment can contain expansions
run_shell_command("K=U$FOO");
var out = run_shell_command('echo $K');
assert.deepEqual( out, [ "UBAR" ] );

//Test 18: Assignment which expands with whitespace - a single variable
run_shell_command("K=ZZ${C}ZZ");
var out = run_shell_command('echo "$K"');
assert.deepEqual( out, [ "ZZHELLO WORLDZZ" ] );

//Test 19: Assignment which expands with whitespace - a single variable
run_shell_command("K=ZZ$C");
var out = run_shell_command('echo "$K"');
assert.deepEqual( out, [ "ZZHELLO WORLD" ] );


