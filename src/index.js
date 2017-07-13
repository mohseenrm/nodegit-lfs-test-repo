const fs = require('fs');
const path = require('path');
const NodeGit = require('nodegit');

const NodeGitLfs = require('nodegit-lfs')(NodeGit);

console.log('NodeGitLFS: ', NodeGitLfs);

const NodeGitLFS = NodeGitLfs.then((ng) => {
	console.log('NodeGitLFS: ', ng.LFS);
	return ng;
})
	.then((ng) => ng.LFS.initialize(process.cwd()))
	.then(() => fs.appendFileSync(path.join(process.cwd(), '.gitattributes'), '*.txt filter=lfs\n'));