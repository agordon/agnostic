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
assert.throws( function(){ fs.opendir("/tmp/bar"); } );
assert.throws( function(){ fs.opendir("/tmp/foo.txt"); } );
assert.throws( function(){ fs.openfile("/tmp",false); } );
assert.throws( function(){ fs.openfile("/tmp",true); } );
assert.throws( function(){ fs.openfile("/tmp/",true); } );
assert.throws( function(){ fs.openfile("/foo/bar.txt",true); } );


// Test 3 - Read-Directory
fs.mkdir("/usr");
fs.mkdir("/usr/bin");
fs.openfile("/usr/bin/sort",true);
fs.openfile("/usr/bin/cut",true);
fs.mkdir("/usr/bin/test1");
fs.openfile("/usr/bin/less",true);
fs.openfile("/usr/bin/sh",true);
fs.openfile("/usr/bin/cat",true);
fs.mkdir("/usr/bin/test2");
var o = fs.readdir("/usr/bin/");
VerifyArray(t);
//order should be the same as creation order
assert.strictEqual( o[0], "/usr/bin/sort");
assert.strictEqual( o[1], "/usr/bin/cut");
assert.strictEqual( o[2], "/usr/bin/test1");
assert.strictEqual( o[3], "/usr/bin/less");
assert.strictEqual( o[4], "/usr/bin/sh");
assert.strictEqual( o[5], "/usr/bin/cat");
assert.strictEqual( o[6], "/usr/bin/test2");

//Test 4 - opendir
var dd = fs.opendir("/usr/bin");
var st = dd.stat();
assert.strictEqual ( st["object_type"], "directory" );


//Test 5 - remove
fs.remove("/usr/bin/cut");
assert.throws( function(){ fs.remove("/tmp"); } );
assert.throws( function(){ fs.remove("/usr/bin/foobar"); } );
assert.throws( function(){ fs.remove("/usr"); } );
assert.throws( function(){ fs.remove("/bin"); } );
fs.remove("/usr/bin/sort");
fs.remove("/usr/bin/sh");
fs.remove("/usr/bin/test1");
fs.remove("/usr/bin/test2");
fs.remove("/usr/bin/less");
fs.remove("/usr/bin/cat");
fs.remove("/usr/bin"); // directory empty - can be removed



