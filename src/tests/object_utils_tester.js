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
var obutils_wrapper = require("utils/object_utils");

_ = obutils_wrapper.ob_utils ;

/* Test IsObjectEmpty */
assert.ok( _.IsObjectEmpty( {} ) );
assert.ok( !_.IsObjectEmpty( {"hello" : "world"} ) );

/* Test IsBoolean */
assert.ok( _.IsBoolean( false ) );
assert.ok( _.IsBoolean( true ) );
assert.ok( !_.IsBoolean( 1 ) );
assert.ok( !_.IsBoolean( {} ) );
assert.ok( !_.IsBoolean( [] ) );
assert.ok( !_.IsBoolean( null ) );
assert.ok( !_.IsBoolean( "hello" ) );
assert.ok( _.IsBoolean( 1==1 ) );
assert.ok( _.IsBoolean( 1===1 ) );

/* Test VerifyBoolean */
assert.doesNotThrow( function() { _.VerifyBoolean( false ); } );
assert.throws(       function() { _.VerifyBoolean( "foo" ); } ) ;

/* Test IsString */
assert.ok( !_.IsString( false ) );
assert.ok( !_.IsString( true ) );
assert.ok( !_.IsString( 1 ) );
assert.ok( !_.IsString( {} ) );
assert.ok( !_.IsString( [] ) );
assert.ok( !_.IsString( null ) );
assert.ok( _.IsString( "hello" ) );
assert.ok( _.IsString( 'hello' ) );
assert.ok( _.IsString( "" ) );
assert.ok( !_.IsString( 1==1 ) );
assert.ok( !_.IsString( 1===1 ) );

/* Test VerifyString */
assert.doesNotThrow( function() { _.VerifyString( "foo" ); } );
assert.throws(       function() { _.VerifyString( false ); } ) ;

/* Test IsNumber */
assert.ok( !_.IsNumber( false ) );
assert.ok( !_.IsNumber( true ) );
assert.ok( _.IsNumber( 1 ) );
assert.ok( _.IsNumber( 1.43 ) );
assert.ok( _.IsNumber( -0.43e-9 ) );
assert.ok( !_.IsNumber( {} ) );
assert.ok( !_.IsNumber( [] ) );
assert.ok( !_.IsNumber( null ) );
assert.ok( !_.IsNumber( "hello" ) );
assert.ok( !_.IsNumber( 'hello' ) );
assert.ok( !_.IsNumber( "" ) );
assert.ok( !_.IsNumber( 1==1 ) );
assert.ok( !_.IsNumber( 1===1 ) );

/* Test VerifyNumber */
assert.doesNotThrow( function() { _.VerifyNumber( 32 ); } );
assert.doesNotThrow( function() { _.VerifyNumber( 32.4 ); } );
assert.throws(       function() { _.VerifyNumber( false ); } ) ;

/* Test IsInteger */
assert.ok( !_.IsInteger( false ) );
assert.ok( !_.IsInteger( true ) );
assert.ok( _.IsInteger( 1 ) );
assert.ok( _.IsInteger( 0123 ) );
assert.ok( _.IsInteger( 0x664 ) );
assert.ok( _.IsInteger( 1 ) );
assert.ok( _.IsInteger( 0 ) );
assert.ok( _.IsInteger( -43 ) );
assert.ok( !_.IsInteger( 1.43 ) );
assert.ok( !_.IsInteger( -0.43e-9 ) );
assert.ok( !_.IsInteger( {} ) );
assert.ok( !_.IsInteger( [] ) );
assert.ok( !_.IsInteger( null ) );
assert.ok( !_.IsInteger( "hello" ) );
assert.ok( !_.IsInteger( 'hello' ) );
assert.ok( !_.IsInteger( "" ) );
assert.ok( !_.IsInteger( 1==1 ) );
assert.ok( !_.IsInteger( 1===1 ) );

/* Test VerifyInteger */
assert.doesNotThrow( function() { _.VerifyInteger( 32 ); } );
assert.throws(       function() { _.VerifyInteger( "foo" ); } ) ;
assert.throws(       function() { _.VerifyInteger( 43.3 ); } ) ;

/* Test IsStrictDecimalIntegerValue */
assert.ok ( _.IsStrictDecimalIntegerValue(1) ) ;
assert.ok ( _.IsStrictDecimalIntegerValue("1") ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue(1.4) ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue("1.4") ) ;
assert.ok ( _.IsStrictDecimalIntegerValue(0) ) ;
assert.ok ( _.IsStrictDecimalIntegerValue("0") ) ;
assert.ok ( _.IsStrictDecimalIntegerValue("-32") ) ;
assert.ok ( _.IsStrictDecimalIntegerValue(-32) ) ;
assert.ok ( _.IsStrictDecimalIntegerValue("  32") ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue("  32  ") ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue("5 apples") ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue("5.5") ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue([]) ) ;
assert.ok ( ! _.IsStrictDecimalIntegerValue({}) ) ;
assert.ok ( _.IsStrictDecimalIntegerValue(0x10) ) ;
assert.ok ( !_.IsStrictDecimalIntegerValue("0x10") ) ;

/* Test IsStrictFloatNumber */
assert.ok ( _.IsStrictFloatValue(1) ) ;
assert.ok ( _.IsStrictFloatValue("1") ) ;
assert.ok ( _.IsStrictFloatValue(1.4) ) ;
assert.ok ( _.IsStrictFloatValue("1.4") ) ;
assert.ok ( _.IsStrictFloatValue(0) ) ;
assert.ok ( _.IsStrictFloatValue("0") ) ;
assert.ok ( _.IsStrictFloatValue("-32") ) ;
assert.ok ( _.IsStrictFloatValue(-32) ) ;
assert.ok ( _.IsStrictFloatValue("  32") ) ;
assert.ok ( ! _.IsStrictFloatValue("  32  ") ) ;
assert.ok ( ! _.IsStrictFloatValue("5 apples") ) ;
assert.ok ( ! _.IsStrictFloatValue("5.5 apples") ) ;
assert.ok ( _.IsStrictFloatValue("5.5") ) ;
assert.ok ( ! _.IsStrictFloatValue([]) ) ;
assert.ok ( ! _.IsStrictFloatValue({}) ) ;
assert.ok ( _.IsStrictFloatValue(0x10) ) ;
assert.ok ( !_.IsStrictFloatValue("0x10") ) ;
assert.ok ( _.IsStrictFloatValue(1.4e4) ) ;
assert.ok ( _.IsStrictFloatValue("1.4e4") ) ;


/* Test IsObject */
assert.ok( _.IsObject( {} ) );
assert.ok( _.IsObject( { "hello" : "world" } ) );
assert.ok( _.IsObject( { "hello" : "world", "foo" : "bar" } ) );

/* Test IsObject on non-objects */
assert.ok( ! _.IsObject( 4 ) );
assert.ok( ! _.IsObject( "Hello" ) );
assert.ok( ! _.IsObject( [1,2,3,4,5] ) );

/* Test VerifyObject */
assert.doesNotThrow( function() { _.VerifyObject( { "hello" : "world" } ) } );
assert.throws(       function() { _.VerifyObject( "hello" ); } ) ;

/* Test IsArray */
assert.ok( _.IsArray( [] ) );
assert.ok( _.IsArray( [1,2,3,4,5] ) );
assert.ok( _.IsArray( [ {"hello":"world"}, {"foo":"bar"} ] ) );

/* Test IsArray on non-arrays */
assert.ok( ! _.IsArray( 4 ) );
assert.ok( ! _.IsArray( "Hello" ) );
assert.ok( ! _.IsArray( {} ) ) ;
assert.ok( ! _.IsArray( {"hello":"world"} ) )  ;

/* Test VerifyArray */
assert.doesNotThrow( function() { _.VerifyArray( [ 1,2,3,5,6] ); } ) ;
assert.throws      ( function() { _.VerifyArray( "hello" ); } ) ;

/* Test VerifyAllowedKeys */
var data1 = { "hello":"world", "foo": [1,2,3,4,5], "bar": { "abc":"def" } } ;
var data2 = { } ;
var data3 = { "hello":"world" } ;
assert.doesNotThrow( function() { _.VerifyAllowedKeys( data1, ["hello","foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { _.VerifyAllowedKeys( data1, ["hello","foo","bar","baz","bee"] ) ; } ) ;
assert.throws      ( function() { _.VerifyAllowedKeys( data1, ["foo","bar"] ) ; } ) ;
assert.throws      ( function() { _.VerifyAllowedKeys( "hello", ["foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { _.VerifyAllowedKeys( data2, ["hello","foo","bar"] ) ; } ) ;
assert.doesNotThrow( function() { _.VerifyAllowedKeys( data3, ["hello","foo","bar"] ) ; } ) ;

/* Test VerifyOneKey */
assert.throws      ( function() { _.VerifyOneKey ( data1 ) ; } ) ;
assert.throws      ( function() { _.VerifyOneKey ( data2 ) ; } ) ;
assert.doesNotThrow( function() { _.VerifyOneKey ( data3 ) ; } ) ;
assert.throws      ( function() { _.VerifyOneKey ( "hello" ) ; } ) ;
assert.throws      ( function() { _.VerifyOneKey ( [1,2,3,4,5] ) ; } ) ;

/* Test GetOneKey */
assert.strictEqual(_.GetOneKey(data3), "hello") ;
assert.throws      ( function() { _.GetOneKey ( data1 ) ; } ) ;
assert.throws      ( function() { _.GetOneKey ( data2 ) ; } ) ;

console.log("Shell-Executor Helper Functions - OK");
