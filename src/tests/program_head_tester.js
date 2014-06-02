/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramHead Class Tester
 */

var head_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"h1",
},
{
	name:"h2",
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	name:"h3",
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n",
	stdout:"1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n"
},
{
	name:"h4",
	argv: ["-"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	name:"h5",
	argv: ["-v"],
	stdin: "1\n2\n3\n",
	stdout: "==> standard input <==\n1\n2\n3\n"
},
{
	name:"n1",
	argv:["-n", "1"],
	stdin: "1\n2\n3\n",
	stdout: "1\n"
},
{
	name:"n2",
	argv: ["-n1"],
	stdin: "1\n2\n3\n",
	stdout: "1\n"
},
{
	name:"n3",
	argv: ["-n", "-1"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n"
},
{
	// seq 3 | head -n -4       => empty output
	name:"n4",
	argv:["-n", "-4"],
	stdin: "1\n\n2\n3\n",
},
{
	//two files - turn on 'verbose'
	name:"v1",
	argv: ["-","-"],
	stdin: "1\n2\n3\n",
	stdout: "==> standard input <==\n1\n2\n3\n==> standard input <==\n"
},
{
	//two files, with "quiet" - should disable "verbose"
	name: "q1",
	argv:["-q", "-","-"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	//Test input file (NOTE: file exists in virtual filesystem, not on the host)
	name:"f1",
	argv: ["/tmp/foo.txt"],
	stdout: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\n"
},
{
	// non existing file
	name: "f2",
	argv: ["/tmp/non/existing.txt"],
	exit_code:1,
	//note: exact error wording depends on 'filesystem.js'
	stderr:"head: File/Directory does not exist (file: '/tmp/non/existing.txt')\n"
},
{
	//File, stdin, file - with quiet flag
	name:"f3",
	argv:["-q","-n1", "/tmp/foo.txt", "-", "/tmp/foo.txt"],
	stdin: "1\n2\n3\n",
	stdout: "a\n1\na\n"
},
{
	name: "f4",
	argv: ["-n1", "/tmp/foo.txt", "-", "/tmp/foo.txt"],
	stdin: "1\n2\n3\n",
	stdout: "==> /tmp/foo.txt <==\na\n==> standard input <==\n1\n==> /tmp/foo.txt <==\na\n"
}
];

require('utils/program_test_framework');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem.FileSystem();
fs.mkdir("/tmp");
var fl = fs.openfile("/tmp/foo.txt",true);
fl.write(["a","b","c","d","e","f","g","h","i","j"]);
fl=null;

var ProgramHead = require('programs/head');

// run tests
run_program_tests("head",ProgramHead.ProgramHead, head_tests,fs);
