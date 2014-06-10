/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* POSIX Shell parser unit test, part 1.
 * This test script ONLY checks acceptance/rejection of shell syntax.
 * It does not check the data object generated from the parser.
 */
"use strict";

var count_pass = 0 ;
var count_fail = 0 ;
var seen_tests = {};

var ob_utils = require('utils/object_utils');
var load_shell_parser = require('utils/shell_parser_loader');

var shell_syntax_tests = require('./shell_syntax_tests.js');
var tests = shell_syntax_tests.tests;
var rules = shell_syntax_tests.parser_rules;

var start_rules = Object.keys(rules);
var parser = load_shell_parser({ "allowedStartRules" : start_rules });


/* Tests one input.
 * returns TRUE if the test passes
 * (note: pass could be that the input failed to parse, and it was expected to fail).
 *
 * if 'should_be_accepted' is true, and the input was successfully parsed
 * using rule 'start_rule', the function will recursively test subsequent rules.
 */
function run_test(name,input,should_be_accepted,start_rule)
{
	if ( ! (start_rule in rules ) )
		throw "invalid start rule '" + start_rule + "' given for test name='"+name+"'";
	var next_rule = rules[start_rule];

	var threw = false;
	var err_message = "";
	try {
		var result = parser.parse(input, { 'startRule' : start_rule });
	} catch(err) {
		threw = true;
		err_message = err;
	}
	if ( should_be_accepted && threw ) {
		console.log(name + " FAIL: rejected by rule '" + start_rule + "': " + err_message );
		return false;
	}
	if ( !should_be_accepted && !threw ) {
		console.log(name + " FAIL: erroneously accepted by rule '" + start_rule + "' " + err_message );
		return false;
	}

	if (should_be_accepted && next_rule)
		return run_test(name,input,should_be_accepted,next_rule);

	console.log(name + " OK");

	return true;
}

for (var t in tests)
{
	var name  = tests[t][0];
	var input = tests[t][1];
	var should_be_accepted = tests[t][2];
	var start_rule = tests[t][3];

	if (name in seen_tests) {
		throw "Duplicated test found: '" + name + "' - aborting.";
	}
	seen_tests[name] = 1;

	var ok = run_test(name,input,should_be_accepted,start_rule);

	if ( ok ) {
		count_pass++;
	} else {
		count_fail++;
	}
}
console.log ("--Shell Parser Tests Summary--");
console.log ("pass: " + count_pass);
console.log ("fail: " + count_fail);

process.exit( count_fail>0 ) ;
