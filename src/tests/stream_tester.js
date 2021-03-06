/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Stream encapsulation Tester
 *
 */
"use strict";

var assert = require('assert');
var ob_utils = require('utils/object_utils');
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
ob_utils.VerifyArray(tmp);
assert.strictEqual ( tmp[0], "hello" );
assert.strictEqual ( tmp[1], "foo" );
assert.strictEqual ( tmp[2], "bar" );
assert.strictEqual ( tmp[3], "world" );



/*********************************************************************
 * Test Input Stream
*********************************************************************/
var is = new Streams.InputStream();
assert.strictEqual ( is.__is_empty(), true);

//Use internal functions to set content
is.__set_lines(["hello","world","foo","bar"]);
//Then read input as a normal progra
assert.strictEqual ( is.__is_empty(), false);
assert.strictEqual ( is.get_line(), "hello" );
assert.strictEqual ( is.__is_empty(), false);
assert.strictEqual ( is.get_line(), "world" );
assert.strictEqual ( is.get_line(), "foo" );
assert.strictEqual ( is.__is_empty(), false);
assert.strictEqual ( is.get_line(), "bar" );
assert.strictEqual ( is.__is_empty(), true); //end of input

//Test 'get_all_lines()'
is.__set_lines(["hello","world"]);
assert.strictEqual ( is.__is_empty(), false);
assert.deepEqual(is.get_all_lines(), [ "hello", "world"] );
assert.strictEqual ( is.__is_empty(), true); //end of input

// Ensure multiple streams don't intermix
var is2 = new Streams.InputStream();
is.__set_lines(["hello"]);
is2.__set_lines(["world"]);
assert.strictEqual( is2.get_line(), "world" );
assert.strictEqual ( is.__is_empty(), false);
assert.strictEqual ( is2.__is_empty(), true);
assert.strictEqual( is.get_line(), "hello" );
assert.strictEqual ( is.__is_empty(), true);
assert.strictEqual ( is2.__is_empty(), true);


// Test InputStream with fill-input callback
var is3 = new Streams.InputStream();

var callback_count=4;
is3.fill_input_callback = function() {
	callback_count--;
	if (callback_count > 0)
		return [ "" + callback_count ];
	return [];
}
assert.strictEqual( is3.get_line(), "3" );
assert.strictEqual( is3.get_line(), "2" );
assert.strictEqual( is3.get_line(), "1" );
assert.strictEqual( is3.get_line(), null );
assert.strictEqual( is3.__is_empty(), true);


// Test two InputStreams with full-input callbacks
var is4 = new Streams.InputStream();
var is5 = new Streams.InputStream();
is4.fill_input_callback = function() { return ["foo"]; }
is5.fill_input_callback = function() { return ["bar"]; }
assert.strictEqual( is4.get_line(), "foo" );
assert.strictEqual( is5.get_line(), "bar" );


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
ob_utils.VerifyArray(tmp);
assert.strictEqual ( tmp[0], "hello" );
assert.strictEqual ( tmp[1], "world" );
assert.strictEqual ( tmp[2], "foo" );
assert.strictEqual ( tmp[3], "bar" );

//Test 'put_lines'
os.put_line("hello");
os.put_lines(["1","2","3"]);
var tmp = os.__get_lines();
ob_utils.VerifyArray(tmp);
assert.deepEqual(tmp, ["hello","1","2","3"]);


