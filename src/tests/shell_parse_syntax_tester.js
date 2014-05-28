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
	'Non_Operator_UnquotedCharacters' : 'Tokens_Command',
	'SingleQuotedString' : 'Tokens_Command',
	'DoubleQuotedString' : 'Tokens_Command',
	'SubshellExpandable' : 'Tokens_Command',
	'BacktickExpandable' : 'Tokens_Command',
	'ParameterExpandable' : 'Tokens_Command',
	'ParameterOperationExpandable' : 'Tokens_Command',
	'ArithmeticExpandable' : 'Tokens_Command',
	'Expandable'         : '',
	'Tokens_Command' : 'SimpleCommand',
	'Redirection' : 'Redirections',
	'Assignment' : 'Assignments_Or_Redirections',
	'Assignments_Or_Redirections' : 'SimpleCommand',
	'Redirections' : 'SimpleCommand',
	'SimpleCommand' : 'Command',
	'Command' : 'Pipeline',
	'Pipeline' : 'AndOrList',
	'AndOrList' : 'List',
	'List' : undefined, /* last rule in hierarchy */

	'Token_NoDelimiter' : undefined /* special rule */
};

var tests = [
/* test-name,	test-input,	should-be-accepted,		start-rule */

/* Single words, without any quoted characters, accpted in the context of a command. */
["nqc1",	"hello",	true,				"Non_Operator_UnquotedCharacters"],
["nqc2",	"he%llo",	true,				"Non_Operator_UnquotedCharacters"],
["nqc3",	"9hello",	true,				"Non_Operator_UnquotedCharacters"],
["nqc4",	"h_",		true,				"Non_Operator_UnquotedCharacters"],
["nqc5",	"==ds@_",	true,				"Non_Operator_UnquotedCharacters"],
["nqc6",	"foo bar",	true,				"Non_Operator_UnquotedCharacters"],
["nqc7",	"foo\"bar",	false,				"Non_Operator_UnquotedCharacters"],
["nqc8",	"foo\$bar",	false,				"Non_Operator_UnquotedCharacters"],
["nqc9",	"|foobar",	false,				"Non_Operator_UnquotedCharacters"],
["nqc10",	"foobar>",	false,				"Non_Operator_UnquotedCharacters"],
["nqc11",	"foobar&",	false,				"Non_Operator_UnquotedCharacters"],
["nqc12",	"foobar;",	false,				"Non_Operator_UnquotedCharacters"],
["nqc13",	";foobar",	false,				"Non_Operator_UnquotedCharacters"],

/* Single and Double Quoted strings (must be properly quoted) */
["dquote1",	'"hello"',	true,			"DoubleQuotedString"],
["dquote2",	'hello',	false,			"DoubleQuotedString"],
["dquote3",	'h"ello',	false,			"DoubleQuotedString"],
["dquote4",	'"hello',	false,			"DoubleQuotedString"],
["dquote5",	'hello"',	false,			"DoubleQuotedString"],
["dquote6",	'"he$llo"',	true,			"DoubleQuotedString"],
["dquote7",	'"he>llo"',	true,			"DoubleQuotedString"],
["dquote8",	'"he llo"',	true,			"DoubleQuotedString"],
["dquote9",	'"he\\llo"',	true,			"DoubleQuotedString"],
["dquote10",	'"he|llo"',	true,			"DoubleQuotedString"],
["dquote11",	'""',		true,			"DoubleQuotedString"],
["dquote12",	'"hell\'lo"',	true,			"DoubleQuotedString"],
["dquote13",	'"hello world"',true,			"DoubleQuotedString"],
["dquote14",	'"foo\tbar"',	true,			"DoubleQuotedString"],
["dquote15",	'"hello("',	true,			"DoubleQuotedString"],
["dquote16",	'"he)llo"',	true,			"DoubleQuotedString"],
["dquote17",	'"he{llo"',	true,			"DoubleQuotedString"],
["dquote18",	'"he}llo"',	true,			"DoubleQuotedString"],
["dquote19",	'"${FOO}world"',true,			"DoubleQuotedString"],
/* Double-Quotes with parameter expansion */
["dquote30",	'"hello$(uname)world"',	true,		"DoubleQuotedString"],
["dquote31",	'"hello$(uname -s)world"',true,		"DoubleQuotedString"],
["dquote32",	'"hello${uname}world"',	true,		"DoubleQuotedString"],
["dquote33",	'"hello$(echo "world")"',true,		"DoubleQuotedString"],
["dquote34",	'"hello$(echo \'world\')"',true,	"DoubleQuotedString"],
["dquote37",	'"hello$FOO"',	true,			"DoubleQuotedString"],
["dquote38",	'"hello$((1+4))"',true,			"DoubleQuotedString"],
["dquote39",	'"hello$(echo"',false,			"DoubleQuotedString"],
["dquote40",	'"hello${echo"',false,			"DoubleQuotedString"],
["dquote41",	'"hello$((1+4)"',false,			"DoubleQuotedString"],



["squote1",	"'hello'",	true,			"SingleQuotedString"],
["squote2",	"he'llo",	false,			"SingleQuotedString"],
["squote3",	"'hello",	false,			"SingleQuotedString"],
["squote4",	"hello'",	false,			"SingleQuotedString"],
["squote5",	"'he$llo'",	true,			"SingleQuotedString"],
["squote6",	"'he\"llo'",	true,			"SingleQuotedString"],
["squote7",	"'he llo'",	true,			"SingleQuotedString"],
["squote8",	"''",		true,			"SingleQuotedString"],
["squote9",	"'\"'",		true,			"SingleQuotedString"],


/* Test single tokens - any combination fo quoted and unquoted strings,
   that logically become one token/word.
   Special characters must be properly quoted. */
["word1",	'he"llo"',	true,			"Token_NoDelimiter"],
["word2",	'he"ll\'o"',	true,			"Token_NoDelimiter"],
["word3",	'he"ll""o"',	true,			"Token_NoDelimiter"],
["word4",	'hell\\"o',	true,			"Token_NoDelimiter"],
["word5",	'he"\'ll"o',	true,			"Token_NoDelimiter"],
["word6",	'he\\|llo',	true,			"Token_NoDelimiter"],
["word7",	'he"\\|"llo',	true,			"Token_NoDelimiter"],
["word8",	'he"\\\\"llo',	true,			"Token_NoDelimiter"],
["word9",	'he\\\\llo',	true,			"Token_NoDelimiter"],
["word10",	'"he|llo"',	true,			"Token_NoDelimiter"],
["word11",	'"he  l  lo"',	true,			"Token_NoDelimiter"],
["word12",	'"he&llo"',	true,			"Token_NoDelimiter"],
["word13",	'"he;llo"',	true,			"Token_NoDelimiter"],
["word14",	'"he>llo"',	true,			"Token_NoDelimiter"],
["word15",	'"he>llo"world',true,			"Token_NoDelimiter"],
["word16",	'foo>bar',	false,			"Token_NoDelimiter"],
["word17",	'foo|bar',	false,			"Token_NoDelimiter"],
["word18",	'foo bar',	false,			"Token_NoDelimiter"],
["word19",	'foo\\|bar',	true,			"Token_NoDelimiter"],
["word20",	'foo\\>bar',	true,			"Token_NoDelimiter"],
["word21",	'foo\\ bar',	true,			"Token_NoDelimiter"],
["word22",	'"foo|bar"',	true,			"Token_NoDelimiter"],
["word23",	'"foo>bar"',	true,			"Token_NoDelimiter"],
["word24",	'"foo bar"',	true,			"Token_NoDelimiter"],
["word25",	'"foo "bar',	true,			"Token_NoDelimiter"],
["word26",	"'foo 'bar",	true,			"Token_NoDelimiter"],
["word27",	"'foo '\"bar\"",true,			"Token_NoDelimiter"],
/* TODO: these are accepted, but at the moment - do not actually
         perform sub-shell and parameter expansion */

/* Test 'tokens' rule - whitespace separates tokens,
   only non-operator tokens should be accepted
   (operator characters can be accepted if they're quoted - thus
    losing their special meaning) */
["token1",	"hello world",			true,	"Tokens_Command"],
["token2",	"hello   world",		true,	"Tokens_Command"],
["token4",	"'hello   world' foo bar",	true,	"Tokens_Command"],
["token5",	"'hello   world' \"foo bar\"",	true,	"Tokens_Command"],
/* single-quote not terminated */
["token6",	"hello world' \"foo bar\"",	false,	"Tokens_Command"],
["token7",	"hello  \t \t  world",		true,	"Tokens_Command"],
["token8",	"hello  ''  world",		true,	"Tokens_Command"],
["token9",	'cut -f1 -d""',			true,	"Tokens_Command"],
["token10",	'foo bar|',			false,	"Tokens_Command"],
["token11",	'foo|bar',			false,	"Tokens_Command"],
["token12",	'foo>bar',			false,	"Tokens_Command"],
["token13",	'foo ">bar"',			true,	"Tokens_Command"],
["token14",	'foo && bar',			false,	"Tokens_Command"],
["token15",	'foo ; bar',			false,	"Tokens_Command"],
["token16",	'foo > bar',			false,	"Tokens_Command"],
["token17",	'foo ">" bar',			true,	"Tokens_Command"],

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
/* Few more cases */
["smpl27",	"true>foo.txt",	true,	"SimpleCommand" ],
["smpl28",	"true>foo.txt<foo.txt",	true,	"SimpleCommand" ],

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

/* Test Sub-Shell Parameter Expansion */
["subshell1",	"$()",						true,	"SubshellExpandable"],
["subshell2",	"$())",						false,	"SubshellExpandable"],
["subshell3",	"$(ls)",					true,	"SubshellExpandable"],
["subshell4",	"$(echo $(uname -s))",		true,	"SubshellExpandable"],
["subshell5",	"$(()",						false,	"SubshellExpandable"],
["subshell6",	"$(echo \\()",				true,	"SubshellExpandable"],
["subshell7",	"$(echo \\))",				true,	"SubshellExpandable"],
["subshell8",	"$(echo \\$)",				true,	"SubshellExpandable"],
["subshell9",	"$(echo $($()$()$($($()))uname -s))",		true,	"SubshellExpandable"],
["subshell10",	"$(echo ${USER})",			true,	"SubshellExpandable"],
["subshell11",	"$(echo `uname -s`)",		true,	"SubshellExpandable"],
["subshell12",	"aaa$()",					false,	"SubshellExpandable"],
["subshell13",	"$(echo hi)"	,			true,	"SubshellExpandable"],
["subshell14",	"$( )",						true,	"SubshellExpandable"],
["subshell15",	"$(  \t   \t )",			true,	"SubshellExpandable"],
["subshell16",	"$(FOO=BAR)",				true,	"SubshellExpandable"],
["subshell17",	"$(true|false)",			true,	"SubshellExpandable"],
["subshell18",	"$(true;false)",			true,	"SubshellExpandable"],
["subshell19",	"$(true;false;)",			true,	"SubshellExpandable"],
["subshell20",	"$(foo 2>1.txt | wc-l)",	true,	"SubshellExpandable"],

/* Test Backtick Subshell parameter expansion */
/*TODO: add more backtick tests */
["backtick1",	"`ls`",						true,	"BacktickExpandable"],
["backtick2",	"`ls",						false,	"BacktickExpandable"],
["backtick3",	"ls`",						false,	"BacktickExpandable"],
["backtick4",	"ls``",						false,	"BacktickExpandable"],
/* TODO: Test 5 should not fail. what's the diff between this and subshell13? */
/*["backtick5",	"`echo hi`",					true,	"BacktickExpandable"],*/


/* Test Parameter Expansion (without operations) */
["ParamExp1",	"${FOO}",					true,	"ParameterExpandable"],
["ParamExp2",	"$FOO",						true,	"ParameterExpandable"],
["ParamExp3",	"${FOO",					false,	"ParameterExpandable"],
["ParamExp4",	"$FOO}",					false,	"ParameterExpandable"],
["ParamExp5",	"$F.OO",					false,	"ParameterExpandable"],
["ParamExp6",	"$FOO=",					false,	"ParameterExpandable"],
["ParamExp7",	"$FO${O}",					false,	"ParameterExpandable"],
["ParamExp8",	"${FOO=BAR}",					false,	"ParameterExpandable"],
/* Special parameters */
["ParamExp9",	"$!",						true,	"ParameterExpandable"],
["ParamExp10",	"$$",						true,	"ParameterExpandable"],
["ParamExp11",	"$-",						true,	"ParameterExpandable"],
["ParamExp12",	"$?",						true,	"ParameterExpandable"],
["ParamExp13",	"$@",						true,	"ParameterExpandable"],
["ParamExp14",	"${!}",						true,	"ParameterExpandable"],
["ParamExp15",	"${$}",						true,	"ParameterExpandable"],
["ParamExp16",	"${-}",						true,	"ParameterExpandable"],
["ParamExp17",	"${?}",						true,	"ParameterExpandable"],
["ParamExp18",	"${@}",						true,	"ParameterExpandable"],

/* Test Parameter Expansion with operations */
["ParmOpExp1",	"${FOO=BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp2",	"${FOO:-BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp3",	"${FOO-BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp4",	"${FOO:=BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp5",	"${FOO=BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp6",	"${FOO:?BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp7",	"${FOO?BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp8",	"${FOO:+BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp9",	"${FOO+BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp10",	"${FOO%BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp12",	"${FOO%%BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp13",	"${FOO#BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp14",	"${FOO##BAR}",					true,	"ParameterOperationExpandable"],
["ParmOpExp15",	"${FOO=}",					true,	"ParameterOperationExpandable"],
["ParmOpExp16",	"${FOO=(}",					true,	"ParameterOperationExpandable"],
/* Go Recursive */
["ParmOpExp17",	"${FOO=${BAR}}",				true,	"ParameterOperationExpandable"],
["ParmOpExp18",	"${FOO=BAR${BAR}}",				true,	"ParameterOperationExpandable"],
["ParmOpExp19",	"${FOO=${BAR-BAZ}}",				true,	"ParameterOperationExpandable"],
["ParmOpExp20",	"${FOO=$(uname -s)BAZ}",			true,	"ParameterOperationExpandable"],
["ParmOpExp21",	"${FOO=$BAR}",					true,	"ParameterOperationExpandable"],
/* Test bad syntax */
["ParmOpExp22",	"${FOO",					false,	"ParameterOperationExpandable"],
["ParmOpExp23",	"${FOO=",					false,	"ParameterOperationExpandable"],
["ParmOpExp24",	"$FOO=BAR",					false,	"ParameterOperationExpandable"],
["ParmOpExp25",	"$FOO=BAR}",					false,	"ParameterOperationExpandable"],
["ParmOpExp26",	"$FOO}",					false,	"ParameterOperationExpandable"],
["ParmOpExp28",	"${FOO=HELLO\"WORLD}",				false,	"ParameterOperationExpandable"],
["ParmOpExp29",	"${FOO=HELLO\'WORLD}",				false,	"ParameterOperationExpandable"],
["ParmOpExp30",	"${FOO=HEL${LOWORLD}",				false,	"ParameterOperationExpandable"],


/* Test Arithmatic Expansion */
/* TODO: as more arithmetic operations are added, add appropriate tests */
/* TODO: the first two should work, but don't. Allow empty arithmetic expressions */
/*["arthm1",	"$(())",					true,	"ArithmeticExpandable"],
["arthm2",	"$(( ))",					true,	"ArithmeticExpandable"],*/
["arthm3",	"$((1))",					true,	"ArithmeticExpandable"],
["arthm4",	"$(( 3 ))",					true,	"ArithmeticExpandable"],
["arthm5",	"$((A))",					true,	"ArithmeticExpandable"],
["arthm6",	"$(($A))",					true,	"ArithmeticExpandable"],
["arthm7",	"$((1+2+3))",					true,	"ArithmeticExpandable"],
["arthm8",	"$((1+2*3))",					true,	"ArithmeticExpandable"],
["arthm9",	"$((A*3))",					true,	"ArithmeticExpandable"],
["arthm10",	"$((1+FOO*3))",					true,	"ArithmeticExpandable"],
["arthm11",	"$(((1+FOO)*3))",				true,	"ArithmeticExpandable"],
/* Go Recursive */
["arthm20",	"$(( $(nproc)+1 ))",				true,	"ArithmeticExpandable"],
["arthm21",	"$(( ${PID}*1 ))",				true,	"ArithmeticExpandable"],
["arthm22",	"$(( $((42))*9 ))",				true,	"ArithmeticExpandable"],
/* Test bad syntax */
["arthm30",	"$(( 3+4 )",					false,	"ArithmeticExpandable"],


/* Test possible combinations of parameter expansions - single token*/
["expan1",	"una$(echo me)",				true,	"Token_NoDelimiter"],
["expan2",	"una${A}",					true,	"Token_NoDelimiter"],
["expan3",	"una$A",					true,	"Token_NoDelimiter"],
["expan4",	"una${FOO-me}",					true,	"Token_NoDelimiter"],
["expan5",	"hel'lo'${USER}$(echo wo)`uptime`",		true,	"Token_NoDelimiter"],
["expan6",	"${A}$(ls)$B$C${D}-foo",			true,	"Token_NoDelimiter"],

/* TODO: test expansion with assignment, redirection */

];



var count_pass = 0 ;
var count_fail = 0 ;
var seen_tests = {};

require('utils/object_utils');
require('utils/shell_parser_loader');

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
console.log ("--Summary--");
console.log ("pass: " + count_pass);
console.log ("fail: " + count_fail);

process.exit( count_fail>0 ) ;
