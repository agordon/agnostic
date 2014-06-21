/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Tests BRE/ERE convertor */

var assert = require('assert');
var ob_utils = require('utils/object_utils');
var _ = require('utils/string_utils');

var BRE_tests = [
// BRE syntax		Javascript-compatible syntax
[ "(hello)",		"\\(hello\\)" ],
[ "\\(hello\\)",	"(hello)" ],
[ "h*",			"h*" ],
[ "h?",			"h\\?" ],
[ "h\\?",		"h?" ],
[ "h+",			"h\\+" ],
[ "a\\|b",		"a|b"],
[ "a\\{3\\}",		"a{3}" ],
[ "a{3}",		"a\\{3\\}" ],
[ "[a]",		"[a]" ],

//NOTE: inside bracket expressions, ) has no special menaning,
//      so no need to escape it.
[ "[)]",		"[)]" ],
[ "[+]",		"[+]" ],
[ "[}]",		"[}]" ],

// Javascript doesn't have character classes, so expand them explicitly
[ "[[:alnum:]]",	"[A-Za-z0-9]" ],
[ "[[:digit:]]",	"[0-9]" ],
[ "[[:xdigit:]]",	"[A-Fa-f0-9]" ],

//Javascript doesn't have collaiton of equivalent classes,
//But Agnostic currently only supports "C" locale -
//so accept single character classes, but reject others
//NOTE:
//  To avoid messy extreme cases (e.g. "[.].]",
//  which implies a closing right-bracket in the middle of a bracket-expression)
//  those are converted to hex-character.
[ "[ab[.c.]d]",		"[ab\\x63d]" ],
[ "[ab[=c=]d]",		"[ab\\x63d]" ],
[ "[ab[.].]d]",		"[ab\\x5dd]" ],
];

var ERE_tests = [
// ERE syntax		Javascript-compatible syntax
[ "(hello)",		"(hello)" ],
[ "\\(hello\\)",	"\\(hello\\)" ],
[ "h*",			"h*" ],
[ "h?",			"h?" ],
[ "h+",			"h+" ],
[ "a|b",		"a|b"],
[ "a{3}",		"a{3}" ],
[ "h\\*",		"h\\*" ],
[ "h\\?",		"h\\?" ],
[ "h\\+",		"h\\+" ],
[ "a\\|b",		"a\\|b"],
[ "a\\{3\\}",		"a\\{3\\}" ],

//In javascript (and perl) regex, \d,\w,\s etc have special meaning.
//In ERE, they have none. So escape the backslash to make them non-special.
[ "\\d",		"\\\\d" ],
[ "\\s",		"\\\\s" ],
[ "\\w",		"\\\\w" ],
[ "\\D",		"\\\\D" ],
[ "\\S",		"\\\\S" ],
[ "\\W",		"\\\\W" ],

//NOTE:
//not testing bracket expressions again, they are the same in BRE and ERE.
];


var regex_tests = [

//TODO
//Add many more tests

//name	type	syntax		input	expected result
//					if true/false - runs 'test'.
//					if object, runs 'match' and deepEquals the result
["b1",   "BRE",	"^a",		"aaa",	true],
["b2",   "BRE",	"^a",		"baa",	false],
["b3",   "BRE",	"a+",		"aaa",	false],
["e3",   "ERE",	"a+",		"aaa",	true],
["b4",   "BRE",  "a|b",		"a",	false],
["b5",   "BRE",  "a|b",		"b",	false],
["b6",   "BRE",  "a|b",		"a|b",	true],
["b7",   "BRE",  "a\\|b",	"a",	true],
["b7",   "BRE",  "a\\|b",	"b",	true],
["e7",   "ERE",  "a|b",		"a",	true],
["e8",   "ERE",  "a|b",		"b",	true],
["e9",   "ERE",  "a\\|b",	"a",	false],
["e10",  "ERE",  "a\\|b",	"b",	false],
["e11",  "ERE",  "a\\|b",	"a|b",	true],

];


BRE_tests.forEach(function(e){
	var bre_syntax = e[0];
	var js_syntax  = e[1];

	assert.equal( _.regex_BRE_to_JS(bre_syntax), js_syntax );
});


ERE_tests.forEach(function(e){
	var ere_syntax = e[0];
	var js_syntax  = e[1];

	assert.equal( _.regex_ERE_to_JS(ere_syntax), js_syntax );
});

regex_tests.forEach(function(test){
	var name = test[0];
	var type = test[1];
	var regex = test[2];
	var input = test[3];
	var expect = test[4];

	switch (type)
	{
	case 'BRE':
		regex = _.regex_BRE_to_JS(regex);
		break;
	case 'ERE':
		regex = _.regex_ERE_to_JS(regex);
		break;
	case 'JS':
		break;
	default:
		throw new Error("unknown regex type '" + type + "'");
	}

	var re = new RegExp(regex);
	if (ob_utils.IsBoolean(expect)) {
		var result = re.test(input);
		if ( result !== expect )
			console.error("regex test '" + name + "' failed");
		assert ( result === expect );
	} else {
	}
});
