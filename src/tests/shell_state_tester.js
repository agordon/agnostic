/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
Shell-State tester

This module tests the shell's internal state variables,
and special built-in utilities.

It calls the utilities directly, bypassing shell syntax parsing and command execution.
*/
"use strict";

var assert = require('assert');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ShellState = require('shell/shell_state');

var os = new OperatingSystem();
var fs = new FileSystem();
var ps = new ProcessState(os,fs);

var ss = new ShellState();

var exit_code ;

/*
Validate name of Special built-in utilities
*/
var names = [
	"break", ":", "continue", ".", "eval", "exec", "exit", "export",
	"readonly", "return", "set", "shift", "times", "trap", "unset" ];
names.forEach(function(name){
	assert.ok ( ss.isSpecialBuiltinUtility(name) );
	assert.ok ( ! ss.isSpecialBuiltinUtility(name + "X") );
});


/*
Check the Colon (NULL) utility
*/
var exit_code = ss.colon(ps,[]);
assert.strictEqual (exit_code, 0);

exit_code = ss.runSpecialBuiltinUtility(ps,":",[]);
assert.strictEqual (exit_code, 0);


/*
Check the variable-related functions
*/
ss = new ShellState(); // Start a new shell

ss.variable_set(ps,"FOO","BAR");
assert.strictEqual( ss.variable_get(ps,"FOO"), "BAR");

// non-existing variable, NOUNSET option is off - return empty string, no STDERR messages.
ss.options.nounset = false;
assert.strictEqual( ss.variable_get(ps,"FOOXX"), "");
assert.strictEqual( ps.stderr.__get_lines().length, 0);

// non-existing variable, NOUNSET option is on - return empty string, with STDERR messages.
// TODO: in non-interactive-shell mode, this should throw an error and terminate the shell.
ss.options.nounset = true;
assert.strictEqual( ss.variable_get(ps,"FOOXX"), "");
assert.strictEqual( ps.stderr.__get_lines().length, 1);
ss.options.nounset = false;

//Set an existing variable
exit_code = ss.variable_set(ps,"FOO","BOO");
assert.strictEqual (exit_code, 0);
assert.strictEqual( ss.variable_get(ps,"FOO"), "BOO");
assert.strictEqual( ps.stderr.__get_lines().length, 0);

//Mark variable as read-only
ss.variable_mark_readonly(ps,"FOO");
assert.ok ( ss.variable_is_readonly("FOO") );
assert.strictEqual( ps.stderr.__get_lines().length, 0);

//Try to set a read-only variable - expect faillure code and STDERR message.
exit_code = ss.variable_set(ps,"FOO","BAR");
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);
assert.strictEqual( ss.variable_get(ps,"FOO"), "BOO"); //still has old value

//Try to unset a read-only variable - expected failure code and STDERR message.
exit_code = ss.variable_unset(ps,"FOO");
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);
assert.strictEqual( ss.variable_get(ps,"FOO"), "BOO"); //still has old value


//
//Test Unset vs Empty values
//
ss = new ShellState(); // Start a new shell

exit_code = ss.variable_set(ps,"HELLO","WORLD");
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stderr.__get_lines().length, 0);
assert.strictEqual( ss.variable_get(ps,"HELLO"), "WORLD");

exit_code = ss.variable_set(ps,"A","B");
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stderr.__get_lines().length, 0);
assert.strictEqual( ss.variable_get(ps,"A"), "B");

//Unset 'HELLO'
exit_code = ss.variable_unset(ps,"HELLO");
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stderr.__get_lines().length, 0);

//Set "A" to Empty
exit_code = ss.variable_set(ps,"A","");
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stderr.__get_lines().length, 0);

//Both variables should return empty strings
assert.strictEqual( ss.variable_get(ps,"HELLO"), "");
assert.strictEqual( ss.variable_get(ps,"A"), "");

// 'set' (listing variables) should return only "A" (HELLO is UNSET)
exit_code = ss.set(ps,[]);
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stdout.__get_lines().join("\n"), "A=''" );



/*
Check the 'set' Utility
*/
ss = new ShellState(); // Start a new shell

exit_code = ss.set(ps,[]);
assert.strictEqual (exit_code, 0);
console.log("\noutput of 'set':");
console.log(ps.stdout.__get_lines().join("\n"));

exit_code = ss.set(ps,["-o"]);
assert.strictEqual (exit_code, 0);
console.log("\noutput of 'set -o':");
console.log(ps.stdout.__get_lines().join("\n"));

exit_code = ss.set(ps,["+o"]);
assert.strictEqual (exit_code, 0);
console.log("\noutput of 'set +o':");
console.log(ps.stdout.__get_lines().join("\n"));



/*
Check the 'export' utility, part 1 (setting variables directly)
*/
ss = new ShellState();

// Create several variables, but only A and C are exported
ss.variable_set(ps,"A","1");
ss.variable_set(ps,"B","2");
ss.variable_mark_exported(ps,"A"); // set 'export' directory
ss.options.allexport = true; //emulate 'set -o allexport'
ss.variable_set(ps,"C","3");
ss.options.allexport = false; //emulate 'set +o allexport'

var expected_export = "export A='1'\nexport C='3'";

//call function directly
exit_code = ss._export(ps,[]); //without "-o"
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stdout.__get_lines().join("\n"), expected_export ) ;

exit_code = ss._export(ps,["-p"]); //with "-p"
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stdout.__get_lines().join("\n"), expected_export ) ;

//call function throw the dispatcher (emulating command line input)
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["-p"]);
assert.strictEqual (exit_code, 0);
assert.strictEqual( ps.stdout.__get_lines().join("\n"), expected_export ) ;


/*
Check the 'export' utility, part 2 (calling 'export' as a command)
*/
ss = new ShellState();
ss.variable_set(ps,"A","1");
ss.variable_set(ps,"B","2");

exit_code = ss.runSpecialBuiltinUtility(ps, "export",["A"]);
assert.strictEqual (exit_code, 0);
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["C=3"]);
assert.strictEqual (exit_code, 0);
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["D=4","E="]);
assert.strictEqual (exit_code, 0);

//no output so far
assert.strictEqual( ps.stdout.__get_lines().length,0);
assert.strictEqual( ps.stderr.__get_lines().length,0);

//Use 'export -p' => B should not appear (it wasn't exported)
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["-p"]);
assert.strictEqual (exit_code, 0);
assert.deepEqual( ps.stdout.__get_lines(),
	["export A='1'", "export C='3'", "export D='4'", "export E=''"]) ;

//Use 'set' => B should appear
exit_code = ss.runSpecialBuiltinUtility(ps, "set",[]);
assert.strictEqual (exit_code, 0);
assert.deepEqual( ps.stdout.__get_lines(),
	["A='1'", "B='2'", "C='3'", "D='4'", "E=''"]) ;


/*
Check the 'export' utility, part 3 (invalid variables)
*/
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["3=FOO"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);

exit_code = ss.runSpecialBuiltinUtility(ps, "export",["oo-$3=FOO"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);



/*
Check the 'readonly' utility, part 1
*/
ss = new ShellState();

ss.variable_set(ps,"A","1");
ss.variable_set(ps,"B","2");
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["A"]);
assert.strictEqual (exit_code, 0);
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["C=3"]);
assert.strictEqual (exit_code, 0);

//no output so far
assert.strictEqual( ps.stdout.__get_lines().length,0);
assert.strictEqual( ps.stderr.__get_lines().length,0);

//Use 'export -p' => B should not appear (it wasn't exported)
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["-p"]);
assert.strictEqual (exit_code, 0);
assert.deepEqual( ps.stdout.__get_lines(),
	["readonly A='1'", "readonly C='3'"]);

//Use 'set' => B should appear
exit_code = ss.runSpecialBuiltinUtility(ps, "set",[]);
assert.strictEqual (exit_code, 0);
assert.deepEqual( ps.stdout.__get_lines(),
	["A='1'", "B='2'", "C='3'"]);


/*
Check the 'readonly' utility, part 2 (invalid variables)
*/
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["3=FOO"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);

exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["oo-$3=FOO"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);


/*
Check the 'readonly' utility, part 3 (readonly violations)
*/
ss = new ShellState();

ss.variable_set(ps,"A","1");
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["A"]);

//no output so far
assert.strictEqual( ps.stdout.__get_lines().length,0);
assert.strictEqual( ps.stderr.__get_lines().length,0);

//Direct set should fail
exit_code = ss.variable_set(ps,"A","99");
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);

//Readonly should fail
exit_code = ss.runSpecialBuiltinUtility(ps, "readonly",["A=88"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);

//Export should fail
exit_code = ss.runSpecialBuiltinUtility(ps, "export",["A=77"]);
assert.strictEqual (exit_code, 1);
assert.strictEqual( ps.stderr.__get_lines().length, 1);

assert.strictEqual( ss.variable_get(ps,"A"), "1");


/*
Check the 'unset' utility
*/
ss = new ShellState();

ss.variable_set(ps,"A","1");
ss.variable_set(ps,"B","1");
exit_code = ss.runSpecialBuiltinUtility(ps, "unset",["A", "B"]);
assert.strictEqual (exit_code, 0);

//Set should return nothing
exit_code = ss.runSpecialBuiltinUtility(ps, "set",[]);
assert.strictEqual (exit_code, 0);
assert.deepEqual( ps.stdout.__get_lines(), []);
