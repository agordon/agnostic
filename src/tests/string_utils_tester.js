/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* FileSystem Tester
 */

var assert = require('assert');
require('utils/string_utils');

var t = "hello";

assert.ok ( t.startsWith("he") ) ;
assert.ok ( t.startsWith("h") ) ;
assert.ok ( t.startsWith("hello") ) ;
assert.ok ( t.startsWith("") ) ;
assert.ok ( !t.startsWith("hellow") ) ;
assert.ok ( !t.startsWith("a") ) ;
assert.ok ( !t.startsWith("help") ) ;

assert.ok ( t.endsWith("o") ) ;
assert.ok ( t.endsWith("lo") ) ;
assert.ok ( t.endsWith("hello") ) ;
assert.ok ( t.endsWith("") ) ;
assert.ok ( !t.endsWith("whello") ) ;
assert.ok ( !t.endsWith("w") ) ;

var s = "" ;
assert.ok ( s.startsWith("") ) ;
assert.ok ( !s.startsWith("f") ) ;
assert.ok ( s.endsWith("") ) ;
assert.ok ( !s.endsWith("f") ) ;


/* Test trimWhitespace() */

assert.strictEqual(  "hello".trimWhitespace(),		"hello" ) ;
assert.strictEqual(  "hello   \t ".trimWhitespace(),	"hello" ) ;
assert.strictEqual(  "\t  \t\thello".trimWhitespace(),	"hello" ) ;
assert.strictEqual(  "  hello  ".trimWhitespace(),	"hello" ) ;
assert.strictEqual(  "\thello\t".trimWhitespace(),	"hello" ) ;
assert.strictEqual(  "hello world".trimWhitespace(),	"hello world" ) ;
assert.strictEqual(  "  hello\t world  ".trimWhitespace(),"hello\t world" ) ;
