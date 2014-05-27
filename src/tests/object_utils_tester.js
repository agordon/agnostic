/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Shell Executor Helper Function unit test.
 *
 * This script tests the Object Helper Functions.
 */

var assert = require('assert');
require("utils/object_utils");

/* Test IsObject */
assert.ok( IsObject( {} ) );
assert.ok( IsObject( { "hello" : "world" } ) );
assert.ok( IsObject( { "hello" : "world", "foo" : "bar" } ) );

/* Test IsObject on non-objects */
assert.ok( ! IsObject( 4 ) );
assert.ok( ! IsObject( "Hello" ) );
assert.ok( ! IsObject( [1,2,3,4,5] ) );

/* Test VerifyObject */
assert.doesNotThrow( function() { VerifyObject( { "hello" : "world" } ) } );
assert.throws(       function() { VerifyObject( "hello" ); } ) ;

/* Test IsArray */
assert.ok( IsArray( [] ) );
assert.ok( IsArray( [1,2,3,4,5] ) );
assert.ok( IsArray( [ {"hello":"world"}, {"foo":"bar"} ] ) );

/* Test IsArray on non-arrays */
assert.ok( ! IsArray( 4 ) );
assert.ok( ! IsArray( "Hello" ) );
assert.ok( ! IsArray( {} ) ) ;
assert.ok( ! IsArray( {"hello":"world"} ) )  ;

/* Test VerifyArray */
assert.doesNotThrow( function() { VerifyArray( [ 1,2,3,5,6] ); } ) ;
assert.throws      ( function() { VerifyArray( "hello" ); } ) ;

/* Test VerifyAllowedKeys */
var data1 = { "hello":"world", "foo": [1,2,3,4,5], "bar": { "abc":"def" } } ;
var data2 = { } ;
var data3 = { "hello":"world" } ;
assert.doesNotThrow( function() { VerifyAllowedKeys( data1, ["hello","foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { VerifyAllowedKeys( data1, ["hello","foo","bar","baz","bee"] ) ; } ) ;
assert.throws      ( function() { VerifyAllowedKeys( data1, ["foo","bar"] ) ; } ) ;
assert.throws      ( function() { VerifyAllowedKeys( "hello", ["foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { VerifyAllowedKeys( data2, ["hello","foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { VerifyAllowedKeys( data3, ["hello","foo","bar"] ) ; } ) ;

/* Test VerifyOneKey */
assert.throws      ( function() { VerifyOneKey ( data1 ) ; } ) ;
assert.throws      ( function() { VerifyOneKey ( data2 ) ; } ) ;
assert.doesNotThrow( function() { VerifyOneKey ( data3 ) ; } ) ;
assert.throws      ( function() { VerifyOneKey ( "hello" ) ; } ) ;
assert.throws      ( function() { VerifyOneKey ( [1,2,3,4,5] ) ; } ) ;

/* Test GetOneKey */
assert.strictEqual(GetOneKey(data3), "hello") ;
assert.throws      ( function() { GetOneKey ( data1 ) ; } ) ;
assert.throws      ( function() { GetOneKey ( data2 ) ; } ) ;

console.log("Shell-Executor Helper Functions - OK");
