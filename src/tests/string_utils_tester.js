/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* FileSystem Tester
 */

var assert = require('assert');
var str_utils = require('utils/string_utils');

var t = "hello";

assert.ok( str_utils.startsWith(t,"he") ) ;
assert.ok( str_utils.startsWith(t,"h") ) ;
assert.ok( str_utils.startsWith(t,"hello") ) ;
assert.ok( str_utils.startsWith(t,"") ) ;
assert.ok( !str_utils.startsWith(t,"hellow") ) ;
assert.ok( !str_utils.startsWith(t,"a") ) ;
assert.ok( !str_utils.startsWith(t,"help") ) ;

assert.ok( str_utils.endsWith(t,"o") ) ;
assert.ok( str_utils.endsWith(t,"lo") ) ;
assert.ok( str_utils.endsWith(t,"hello") ) ;
assert.ok( str_utils.endsWith(t,"") ) ;
assert.ok( !str_utils.endsWith(t,"whello") ) ;
assert.ok( !str_utils.endsWith(t,"w") ) ;

var s = "" ;
assert.ok ( str_utils.startsWith(s,"") ) ;
assert.ok ( !str_utils.startsWith(s,"f") ) ;
assert.ok ( str_utils.endsWith(s,"") ) ;
assert.ok ( !str_utils.endsWith(s,"f") ) ;


/* Test trimWhitespace() */

assert.strictEqual(  str_utils.trimWhitespace("hello"),		"hello" ) ;
assert.strictEqual(  str_utils.trimWhitespace("hello   \t "),	"hello" ) ;
assert.strictEqual(  str_utils.trimWhitespace("\t  \t\thello"),	"hello" ) ;
assert.strictEqual(  str_utils.trimWhitespace("  hello  "),	"hello" ) ;
assert.strictEqual(  str_utils.trimWhitespace("\thello\t"),	"hello" ) ;
assert.strictEqual(  str_utils.trimWhitespace("hello world"),	"hello world" ) ;
assert.strictEqual(  str_utils.trimWhitespace("  hello\t world  "),"hello\t world" ) ;


/* Test unbackslash */
assert.strictEqual ( str_utils.unbackslash("hello"),		"hello" );
assert.strictEqual ( str_utils.unbackslash("h\tello"),		"h\tello" );
assert.strictEqual ( str_utils.unbackslash("h\\tello"),		"h\tello" );
assert.strictEqual ( str_utils.unbackslash("h\nello"),		"h\nello" );
assert.strictEqual ( str_utils.unbackslash("h\\nello"),		"h\nello" );
assert.strictEqual ( str_utils.unbackslash("h\\\\ello"),	"h\\ello" );
assert.strictEqual ( str_utils.unbackslash("hello\\"),		"hello\\" );

