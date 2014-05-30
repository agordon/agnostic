/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* FileSystem Tester
 */

var assert = require('assert');
require('utils/object_utils');
require('os/os_state');
var Storage = require('os/storage_object');
var FileSystem = require('os/filesystem');

/*********************************************************************
 * Test Generic Stream - Internal functions
*********************************************************************/
var fs = new FileSystem.FileSystem();

// Test1 - create a directory, a file, then write and read it
fs.mkdir("/tmp");
var f = fs.openfile("/tmp/foo.txt",true);
f.write(["hello","world"]);
f= null;
var k = fs.openfile("/tmp/foo.txt",false);
var t = k.read();
VerifyArray(t);
assert.strictEqual( t[0], "hello");
assert.strictEqual( t[1], "world");

// Test 2 - Create/Open some invalid files & directories
assert.throws( function(){ fs.mkdir("/tmp/"); } );
assert.throws( function(){ fs.mkdir("/tmp"); } );
assert.throws( function(){ fs.mkdir("/tmp/foo.txt"); } );
assert.throws( function(){ fs.openfile("/tmp",false); } );
assert.throws( function(){ fs.openfile("/tmp",true); } );
assert.throws( function(){ fs.openfile("/tmp/",true); } );
assert.throws( function(){ fs.openfile("/foo/bar.txt",true); } );
