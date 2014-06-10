/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* Storage Object Tester
 *
 */
"use strict";

var assert = require('assert');
var obj_utils_wrapper = require("utils/object_utils");
var ob_utils = obj_utils_wrapper.ob_utils;
var OS = require('os/os_state');
var Storage = require('os/storage_object');

/*********************************************************************
 * Test Generic Stream - Internal functions
*********************************************************************/
var so = new Storage.StorageObject();

so.chmod(438);
so.chown(123,456);
so.utime(1000000,1100000);

var st = so.stat();
assert.strictEqual( st["atime"], 1000000 );
assert.strictEqual( st["mtime"], 1100000 );
assert.strictEqual( st["uid"], 123 );
assert.strictEqual( st["gid"], 456 );

//Check CTime update, with busy-wait loop
//Busy wait for 2 seconds, because the "OS" time() resolution is 1 second
//(not Javascript's 1 milisecond)
if (0) {
	var old_ctime = st["ctime"];
	var start = new Date().getTime();
	while(new Date().getTime() < start + 2000) { ; }
	//Changing file mode should update the Ctime as well
	so.chmod(438);
	st = so.stat();
	var new_ctime = st["ctime"];
	assert.notEqual ( old_ctime, new_ctime );
}


/*********************************************************************
 * Test File Object
*********************************************************************/
var f = new Storage.File();

// Test simple write
f.write(["hello","world"]);
var st = f.stat();
assert.strictEqual( st["object_type"], "file" );
assert.strictEqual( st["size"], 12 ); // "hello" + "world" + 2 newlines

// Test truncate
f.truncate();
var st = f.stat();
assert.strictEqual( st["size"], 0 );

// Test Read empty file
var lines = f.get_all_lines();
ob_utils.VerifyArray(lines);
assert.strictEqual( lines.length, 0);

// Test write + append
f.write(["hello","world"]);
f.append(["foo","bar"]);
var st = f.stat();
assert.strictEqual( st["size"], 20 );
lines = f.get_all_lines();
ob_utils.VerifyArray(lines);
assert.strictEqual ( lines[0], "hello" );
assert.strictEqual ( lines[1], "world" );
assert.strictEqual ( lines[2], "foo" );
assert.strictEqual ( lines[3], "bar" );





/*********************************************************************
Test Directory Object

*********************************************************************/
var d = new Storage.Directory();

var st = d.stat();
assert.strictEqual( st["object_type"], "directory" );
assert.strictEqual( st["size"], 0 );

