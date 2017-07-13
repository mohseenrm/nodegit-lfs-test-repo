const fs = require('fs');
const path = require('path');
const NodeGit = require('nodegit');
const NodeGitLfs = require('nodegit-lfs')(NodeGit);
const exec = require('./execHelper');

console.log('NodeGitLFS: ', NodeGitLfs);

const NodeGitLFS = NodeGitLfs.then((ng) => {
	console.log('NodeGitLFS: ', ng.LFS);
	return ng;
})
	.then((ng) => ng.LFS.initialize(process.cwd()))
	// .then(() => fs.appendFileSync(path.join(process.cwd(), '.gitattributes'), '*.txt filter=lfs\n'));
	.then(() => exec('base64 /dev/urandom | head -c 200000000 > big_file_test.txt'))
	.then((process, stdin, stdout) => console.log(`[DEBUG]{Process}: ${process}\n\n{stdin}: ${stdin}\n\n{stdout}: ${stdout}`));
