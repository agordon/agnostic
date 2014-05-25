/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* POSIX Shell parser unit test, part 1.
 * This test script ONLY checks acceptance/rejection of shell syntax.
 * It does not check the data object generated from the parser.
 *
 * Each test in 'tests' array has the following elements:
 *   1. short name for the test (must be unique).
 *   2. input string for the parser
 *   3. should-be-accepted: true/false.
 *      if TRUE, the syntax is expected to be
 *      accepted by the parser, using the specific rule in item 4,
 *      *AND ALL SUBSEQUENT* rules. See "rules" variable for the list and order
 *      of rules.
 *      if FALSE, the syntax must not be accepted by the parser, using the
 *      specific rule in item 4.
 *   4. parser rule to check.
 *      The rule name must match the names in 'posix_shell.pegjs' .
 *      See 'rules' variable for list of valid starting rules.
 */


/* List of rules, must be the same as the rules
 * listed in "posix_shell.pegjs".
 * For each rule (the key), the subsequent rules to be also tested are listed.
 * The hierarchial order must match 'posix_shell.pegjs'.
 */
var rules = {
	'NonQuotedCharacters' : 'word',
	'QuotedString' : 'word',
	'word' : 'non_operator_tokens',
	'non_operator_tokens' : 'SimpleCommand',
	'Redirection' : 'Redirections',
	'Assignment' : 'Assignments_Or_Redirections',
	'Assignments_Or_Redirections' : 'SimpleCommand',
	'Redirections' : 'SimpleCommand',
	'SimpleCommand' : 'Command',
	'Command' : 'Pipeline',
	'Pipeline' : 'AndOrList',
	'AndOrList' : 'List',
	'List' : undefined /* last rule */
};

var tests = [
/* test-name,	test-input,	should-be-accepted,		start-rule */

/* Single words, without any quoted characters */
["nqc1",	"hello",	true,				"NonQuotedCharacters"],
["nqc2",	"he%llo",	true,				"NonQuotedCharacters"],
["nqc3",	"9hello",	true,				"NonQuotedCharacters"],
["nqc4",	"h_",		true,				"NonQuotedCharacters"],
["nqc5",	"==ds@_",	true,				"NonQuotedCharacters"],
["nqc6",	"foo bar",	false,				"NonQuotedCharacters"],
["nqc7",	"foo\"bar",	false,				"NonQuotedCharacters"],
["nqc8",	"foo\$bar",	false,				"NonQuotedCharacters"],
["nqc9",	"|foobar",	false,				"NonQuotedCharacters"],
["nqc10",	"foobar>",	false,				"NonQuotedCharacters"],

/* Single and Double Quoted strings (must be properly quoted) */
["quote1",	'"hello"',	true,			"QuotedString"],
["quote2",	"'hello'",	true,			"QuotedString"],
["quote3",	'hello',	false,			"QuotedString"],
["quote4",	'h"ello',	false,			"QuotedString"],
["quote5",	'"hello',	false,			"QuotedString"],
["quote6",	'hello"',	false,			"QuotedString"],
["quote7",	"he'llo",	false,			"QuotedString"],
["quote8",	"'hello",	false,			"QuotedString"],
["quote9",	"hello'",	false,			"QuotedString"],
["quote10",	'"he$llo"',	true,			"QuotedString"],
["quote11",	'"he>llo"',	true,			"QuotedString"],
["quote12",	'"he llo"',	true,			"QuotedString"],
["quote13",	'"he\\llo"',	true,			"QuotedString"],
["quote14",	'"he|llo"',	true,			"QuotedString"],
["quote15",	'""',		true,			"QuotedString"],
["quote16",	'"hell\'lo"',	true,			"QuotedString"],
["quote17",	"'he$llo'",	true,			"QuotedString"],
["quote18",	"'he\"llo'",	true,			"QuotedString"],
["quote19",	"'he llo'",	true,			"QuotedString"],
["quote20",	"''",		true,			"QuotedString"],
["quote21",	"'\"'",		true,			"QuotedString"],


/* Test single tokens - any combination fo quoted and unquoted strings,
   that logically become one token/word.
   Special characters must be properly quoted. */
["word1",	'he"llo"',	true,			"word"],
["word2",	'he"ll\'o"',	true,			"word"],
["word3",	'he"ll""o"',	true,			"word"],
["word4",	'hell\\"o',	true,			"word"],
["word5",	'he"\'ll"o',	true,			"word"],
["word6",	'he\\|llo',	true,			"word"],
["word7",	'he"\\|"llo',	true,			"word"],
["word8",	'he"\\\\"llo',	true,			"word"],
["word9",	'he\\\\llo',	true,			"word"],
["word10",	'"he|llo"',	true,			"word"],
["word11",	'"he  l  lo"',	true,			"word"],
["word12",	'"he&llo"',	true,			"word"],
["word13",	'"he;llo"',	true,			"word"],
["word14",	'"he>llo"',	true,			"word"],
["word15",	'"he>llo"world',true,			"word"],
["word16",	'foo>bar',	false,			"word"],
["word17",	'foo|bar',	false,			"word"],
["word18",	'foo bar',	false,			"word"],
["word19",	'foo\\|bar',	true,			"word"],
["word20",	'foo\\>bar',	true,			"word"],
["word21",	'foo\\ bar',	true,			"word"],
["word22",	'"foo|bar"',	true,			"word"],
["word23",	'"foo>bar"',	true,			"word"],
["word24",	'"foo bar"',	true,			"word"],
["word25",	'"foo "bar',	true,			"word"],
["word26",	"'foo 'bar",	true,			"word"],
["word27",	"'foo '\"bar\"",true,			"word"],
/* TODO: these are accepted, but at the moment - do not actually
         perform sub-shell and parameter expansion */

/* Test 'tokens' rule - whitespace separates tokens,
   only non-operator tokens should be accepted
   (operator characters can be accepted if they're quoted - thus
    losing their special meaning) */
["token1",	"hello world",			true,	"non_operator_tokens"],
["token2",	"hello   world",		true,	"non_operator_tokens"],
["token3",	"   hello   world   ",		true,	"non_operator_tokens"],
["token4",	"'hello   world' foo bar",	true,	"non_operator_tokens"],
["token5",	"'hello   world' \"foo bar\"",	true,	"non_operator_tokens"],
/* single-quote not terminated */
["token6",	"hello world' \"foo bar\"",	false,	"non_operator_tokens"],
["token7",	"hello  \t \t  world   ",	true,	"non_operator_tokens"],
["token8",	"hello  ''  world   ",		true,	"non_operator_tokens"],
["token9",	'cut -f1 -d""  ',		true,	"non_operator_tokens"],
["token10",	'foo bar|',			false,	"non_operator_tokens"],
["token11",	'foo|bar',			false,	"non_operator_tokens"],
["token12",	'foo>bar',			false,	"non_operator_tokens"],
["token13",	'foo ">bar"',			true,	"non_operator_tokens"],
["token14",	'foo && bar',			false,	"non_operator_tokens"],
["token15",	'foo ; bar',			false,	"non_operator_tokens"],
["token16",	'foo > bar',			false,	"non_operator_tokens"],
["token17",	'foo ">" bar',			true,	"non_operator_tokens"],

/* Test single redirection */
["redir1",	">foo.txt",		true,		"Redirection"],
["redir2",	"2>foo.txt",		true,		"Redirection"],
["redir3",	"<foo.txt",		true,		"Redirection"],
["redir4",	"2>&1",			true,		"Redirection"],
["redir5",	">&1",			true,		"Redirection"],
["redir6",	"<>foo.txt",		true,		"Redirection"],
["redir7",	">>foo.txt",		true,		"Redirection"],
["redir8",	">'f  o o.txt'",	true,		"Redirection"],
["redir9",	">f  o o.txt",		false,		"Redirection"],
["redir10",	">",			false,		"Redirection"],
["redir11",	"<",			false,		"Redirection"],
/* The redirection rule accepts just one redirection.
   multiple redirections are tested below. */
["redir12",	">foo.txt 2>&1",	false,		"Redirection"],
["redir13",	"<bar.txt >foo.txt",	false,		"Redirection"],

/* Test Multiple Redirections */
["mredir1",	">foo.txt 2>&1",	true,		"Redirections"],
["mredir2",	"<bar.txt >foo.txt",	true,		"Redirections"],
["mredir3",	"<bar.txt>foo.txt",	true,		"Redirections"],
["mredir4",	"2>&1<foo.txt",		true,		"Redirections"],

/* Test Single Assignment */
["asgn1",	"FOO=BAR",		true,		"Assignment"],
["asgn2",	"FOO='fo fo > BAR'",	true,		"Assignment"],
["asgn3",	"FOO=HELLO\"WOR LD\"",	true,		"Assignment"],
/* TODO: asgn4 fails, but should be accepted */
/*["asgn4",	"FOO=",			true,		"Assignment"],*/
["asgn5",	"F\"OO\"=BAR",		false,		"Assignment"],
["asgn6",	"=BAR",			false,		"Assignment"],

/* Test multiple assignments and redirections.
   though not very common, both assignments AND redirections can appear
   before the actual command to execute, eg.:
	FOO=BAR <input.txt >counts.txt wc -l
   Additionally, shell commands with only assignments and redirections
   (and no command to execute) are perfectly valid.
*/
["asgnrdr1",	"FOO=BAR >hello.txt",	true,		"Assignments_Or_Redirections"],
["asgnrdr2",	"FOO=BAR HELLO=WORLD",	true,		"Assignments_Or_Redirections"],
["asgnrdr3",	"2>&1 FOO=BAR BAZ=BOM",	true,		"Assignments_Or_Redirections"],
["asgnrdr4",	"FOO=BAR>out.txt",	true,		"Assignments_Or_Redirections"],
["asgnrdr5",	"FOO=\">foo.txt\">out.txt",	true,	"Assignments_Or_Redirections"],
/* this test includes a command 'seq', and should not be accepted by this rule.
   it should be accepted by later rules. */
["asgnrdr6",	"FOO=BAR seq 10",	false,		"Assignments_Or_Redirections"],
["asgnrdr7",	"FOO=BAR >out.txt seq 10",	false,	"Assignments_Or_Redirections"],


/* Test Simple Commands, with assignment and redirections */
["smpl1",	"FOO=BAR cut -f1",			true,		"SimpleCommand" ],
["smpl2",	"FOO=BAR HELLO=WORLD cut -f1",		true,		"SimpleCommand" ],
/* NOTE: the last BAZ=BOO is NOT a variable assignment. it should be parsed
 * as a normal parameter to 'cut' - but it is still a valid command syntax. */
["smpl3",	"FOO=BAR HELLO=WORLD cut -f1 BAZ=BOO",	true,	"SimpleCommand" ],
["smpl4",	"FOO=BAR <foo.txt cut -f1",		true,	"SimpleCommand" ],
["smpl5",	"<foo.txt cut -f1",			true,	"SimpleCommand" ],
["smpl6",	"7<foo.txt cut -f1",			true,	"SimpleCommand" ],
["smpl7",	"7<foo.txt FOO=BAR ZOOM=ZOOM >text.txt cut -f1",	true,	"SimpleCommand" ],
["smpl8",	"2>&1 FOO=BAR ZOOM=ZOOM cut -f1",	true,	"SimpleCommand" ],
["smpl9",	"7<&1 FOO=BAR ZOOM=ZOOM cut -f1",	true,	"SimpleCommand" ],
["smpl10",	"<>yes.txt FOO=BAR ZOOM=ZOOM cut -f1",	true,	"SimpleCommand" ],
["smpl11",	"FFO=BAR>yes.txt cut -f1",		true,	"SimpleCommand" ],
["smpl12",	">yes.txt cut -f1 <foo.txt",		true,	"SimpleCommand" ],
/* test 'redirection_word_hack' rule */
["smpl13",	"cut -f1 >foo.txt 2>&1",		true,	"SimpleCommand" ],
["smpl14",	"cut -f1 2>&1",				true,	"SimpleCommand" ],
["smpl15",	"cut -f1 1>foo.txt 2>&1",		true,	"SimpleCommand" ],
["smpl16",	"HELLO=FOO 1>foo.txt 2>&1"	,	true,	"SimpleCommand" ],
/* Simple commands must not accept pipes, ands, ors and
   other special operators, unless quoted. */
["smpl17",	"seq 10 | wc -l",			false,	"SimpleCommand" ],
["smpl18",	"seq 10 '|' wc -l",			true,	"SimpleCommand" ],
["smpl19",	"seq 10 && echo ok",			false,	"SimpleCommand" ],
["smpl20",	"seq 10 \"&&\" echo ok",		true,	"SimpleCommand" ],
["smpl21",	"seq 10 || echo ok",			false,	"SimpleCommand" ],
["smpl22",	"seq 10 \"||\" echo ok",		true,	"SimpleCommand" ],
["smpl23",	"seq 10 \\|\\| echo ok"	,		true,	"SimpleCommand" ],
["smpl25",	"seq 10 ; echo ok",			false,	"SimpleCommand" ],
["smpl26",	"seq 10 & echo ok",			false,	"SimpleCommand" ],

/* Test Pipeline rule */
["pipe1",	"seq 1 2 10 | wc -l",							true,	"Pipeline"],
["pipe2",	"seq 1 2 10 2>foo.txt | wc -l 2>>foo2.txt ",				true,	"Pipeline"],
["pipe3",	"FOO=BAR seq 1 2 10 2>foo.txt | wc -l 2>>foo2.txt ",			true,	"Pipeline"],
["pipe4",	"FOO=BAR seq 1 2 10 2>foo.txt | FOO=BAR Pc -l 2>>foo2.txt ",		true,	"Pipeline"],
["pipe5",	"FOO=BAR seq 1 2 10 2>foo.txt | <input.txt wc -l 2>>foo2.txt ",		true,	"Pipeline"],
["pipe6",	"FOO=BAR seq 1 2 10 2>foo.txt | FOO=BAR <input.txt wc -l 2>>foo2.txt ",	true,	"Pipeline"],
["pipe7",	"cut -f1 <genes.txt|sort -k1V,1 -k2nr,2 ",				true,	"Pipeline"],
["pipe8",	"cut -f1 <genes.txt | sort -k1V,1 -k2nr,2 | uniq -c >text.txt",		true,	"Pipeline"],
/* Pipeline'd commands must not accept ands, ors and
   other special operators, unless quoted. */
["pipe9",	"cut -f1 | seq 10 && echo ok ",						false,	"Pipeline"],
["pipe10",	"cut -f1 | seq 10 & echo ok ",						false,	"Pipeline"],
["pipe11",	"cut -f1 | seq 10 ; echo ok ",						false,	"Pipeline"],
["pipe12",	"true && cut -f1 | seq 10",						false,	"Pipeline"],
["pipe13",	"cut -f1 |",								false,	"Pipeline"],
["pipe14",	"|cut -f1 |",								false,	"Pipeline"],
["pipe15",	"|cut -f1",								false,	"Pipeline"],

/* Test AndOrList rule */
["andor1",	"true && false || seq 1",			true,	"AndOrList" ],
["andor2",	"true && false | wc",				true,	"AndOrList" ],
["andor3",	"true && false | wc || seq 1",			true,	"AndOrList" ],
["andor4",	"true && false && false && echo ok || echo fail",true,	"AndOrList" ],
["andor5",	"true && false ; wc",				false,	"AndOrList" ],
["andor6",	"true && false & wc",				false,	"AndOrList" ],
["andor7",	"true &&",					false,	"AndOrList" ],
["andor8",	"true ||",					false,	"AndOrList" ],
["andor9",	" && true",					false,	"AndOrList" ],
["andor10",	" || true",					false,	"AndOrList" ],
["andor11",	"&& true",					false,	"AndOrList" ],
["andor12",	"|| true",					false,	"AndOrList" ],
["andor13",	"true && && true",				false,	"AndOrList" ],
["andor14",	"false && || true",				false,	"AndOrList" ],

/* Test List rule */
["list1",	"true ;",					true,	"List" ],
["list2",	"true &",					true,	"List" ],
["list3",	"true ; false",					true,	"List" ],
["list4",	"true ; false ;",				true,	"List" ],
["list5",	"true & false ;",				true,	"List" ],
["list6",	"true & false &",				true,	"List" ],
["list7",	"true && false &",				true,	"List" ],
["list8",	";",						false,	"List" ],
["list9",	"&",						false,	"List" ],

];



var count_pass = 0 ;
var count_fail = 0 ;
var seen_tests = {};

var fs = require('fs');
var PEG = require("pegjs");
var path = require("path");

var start_rules = Object.keys(rules);

/* TODO: don't Hard-code path to the PEGJS file. */
var script_file = process.argv[1]; // Filename of current script
var posix_parser_syntax = path.join( path.dirname(script_file), "..", "src", "shell", "posix_shell.pegjs" );
var parser_text = fs.readFileSync(posix_parser_syntax, 'ascii');
var parser = PEG.buildParser(parser_text,{ 'allowedStartRules': start_rules });


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
console.log ("--Summary--");
console.log ("pass: " + count_pass);
console.log ("fail: " + count_fail);
