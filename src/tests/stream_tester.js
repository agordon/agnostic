/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Stream encapsulation Tester
 *
 */

var assert = require('assert');
require('utils/object_utils');
var Streams = require('os/streams');

/*********************************************************************
 * Test Generic Stream - Internal functions
*********************************************************************/
var gs = new Streams.GenericStream();

// Test 1 - push_line
gs.__clear_lines();
gs.__push_line("Hello World");
assert.equal( gs.__shift_line(), "Hello World");
gs.__push_line("Foo");
assert.equal( gs.__shift_line(), "Foo");
assert.strictEqual ( gs.__is_empty(), true );
assert.strictEqual ( gs.__shift_line(), null );

// Test 2 - clear_lines
gs.__push_line("Hello World");
assert.strictEqual ( gs.__is_empty(), false );
gs.__clear_lines();
assert.strictEqual ( gs.__is_empty(), true );
assert.strictEqual ( gs.__shift_line(), null );

// Test 3 push_line / shift_line
gs.__clear_lines();
gs.__push_line("hello");
gs.__push_line("world");
gs.__push_line("foo");
gs.__push_line("bar");
assert.equal( gs.__shift_line(), "hello");
assert.equal( gs.__shift_line(), "world");
assert.equal( gs.__shift_line(), "foo");
assert.equal( gs.__shift_line(), "bar");
assert.strictEqual ( gs.__shift_line(), null );

// Test 4 - push_lines
gs.__clear_lines();
gs.__push_lines(["hello","foo","bar","world"]);
assert.equal( gs.__shift_line(), "hello");
assert.equal( gs.__shift_line(), "foo");
assert.equal( gs.__shift_line(), "bar");
assert.equal( gs.__shift_line(), "world");
assert.strictEqual ( gs.__shift_line(), null );

//Test 5 - set_lines
gs.__clear_lines();
gs.__push_line("hello");
gs.__set_lines(["foo","bar"]); // Set-line should override any existing content
assert.equal( gs.__shift_line(), "foo");
assert.equal( gs.__shift_line(), "bar");
assert.strictEqual ( gs.__shift_line(), null );

//Test 6 - Get_lines
gs.__clear_lines();
gs.__push_lines(["hello","foo","bar","world"]);
var tmp = gs.__get_lines();
assert.strictEqual ( gs.__is_empty(), true );
assert.strictEqual ( gs.__shift_line(), null );
VerifyArray(tmp);
assert.strictEqual ( tmp[0], "hello" );
assert.strictEqual ( tmp[1], "foo" );
assert.strictEqual ( tmp[2], "bar" );
assert.strictEqual ( tmp[3], "world" );



/*********************************************************************
 * Test Input Stream
*********************************************************************/
var is = new Streams.InputStream();
assert.strictEqual ( is.is_empty(), true);

//Use internal functions to set content
is.__set_lines(["hello","world","foo","bar"]);
//Then read input as a normal progra
assert.strictEqual ( is.is_empty(), false);
assert.strictEqual ( is.get_line(), "hello" );
assert.strictEqual ( is.is_empty(), false);
assert.strictEqual ( is.get_line(), "world" );
assert.strictEqual ( is.get_line(), "foo" );
assert.strictEqual ( is.is_empty(), false);
assert.strictEqual ( is.get_line(), "bar" );
assert.strictEqual ( is.is_empty(), true); //end of input


/*********************************************************************
 * Test Output Stream
*********************************************************************/
var os = new Streams.OutputStream();
var os2 = new Streams.OutputStream();

//Use public methods to store output lines
os.put_line("hello");
os.put_line("world");
os.put_line("foo");
os.put_line("bar");

//Verify two streams don't share "lines"
assert.deepEqual ( os2.__get_lines(), [] );

//Use internal methods to get the lines
var tmp = os.__get_lines();
VerifyArray(tmp);
assert.strictEqual ( tmp[0], "hello" );
assert.strictEqual ( tmp[1], "world" );
assert.strictEqual ( tmp[2], "foo" );
assert.strictEqual ( tmp[3], "bar" );

