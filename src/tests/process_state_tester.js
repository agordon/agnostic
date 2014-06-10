/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProcessState encapsulation Tester */

var assert = require('assert');
var ob_utils = require("utils/object_utils");
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var ProcessState = require('os/process_state');

var os = new OperatingSystem();
var fs = new FileSystem();

var ps = new ProcessState(os,fs);

var pid  = ps.getpid();
var ppid = ps.getppid();


/* Test chdir/getcwd() */
var dir = "/foo/bar" ;
ps.chdir("/foo/bar");
assert ( ps.getcwd() === dir ) ;
ps.chdir("..");
assert ( ps.getcwd() === "/foo" ) ;
ps.chdir(".");
assert ( ps.getcwd() === "/foo" ) ;
ps.chdir("../foo/");
assert ( ps.getcwd() === "/foo" ) ;
ps.chdir("/tmp/bar/");
assert ( ps.getcwd() === "/tmp/bar" ) ;


/* Test Environment Variables */
ps.clearenv();
assert( ! ps.existsenv("foo") ) ;
assert.equal( ps.getenv("foo","baz"), "baz" ) ;
ps.setenv("foo","bar",false);
assert.equal( ps.getenv("foo","bar"), "bar" ) ;
ps.setenv("foo","bee",false); //setenv w/ overwrite=false, should not change value
assert.equal( ps.getenv("foo","bar"), "bar" ) ;
ps.setenv("foo","bee",true); //setenv w/ overwrite=true, should change value
assert.equal( ps.getenv("foo","bee"), "bee" ) ;
assert( ps.existsenv("foo") ) ;

// Remove ENV, then test again
ps.unsetenv("foo");
assert( ! ps.existsenv("foo") ) ;
ps.setenv("foo","bar",true);
assert.equal( ps.getenv("foo","bar"), "bar" ) ;

// Get all variables
ps.unsetenv("foo");
ps.setenv("hello","world",false);
ps.setenv("orange","black",false);
var env = ps.environ();
ob_utils.VerifyAllowedKeys(env, ["hello", "orange"]);
assert.equal( env["orange"], "black");
assert.equal( env["hello"], "world");
// Ensure Processes can't change environment directly
env["foo"] = "test";
assert( ! ps.existsenv("foo") ) ;
env["orange"] = "green";
assert.equal( ps.getenv("orange","*"), "black");

//Test ProcessState creation with invalid parameters
assert.throws(
	function() {
		var ps1 = new ProcessState.ProcessState({},fs);
	});
assert.throws(
	function() {
		var ps2 = new ProcessState.ProcessState(os,{});
	});
assert.throws(
	function() {
		//(reversed parameter order, wrong instance type)
		var ps3 = new ProcessState.ProcessState(fs,os);
	});
