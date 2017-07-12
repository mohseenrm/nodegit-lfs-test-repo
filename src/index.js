const NodeGit = require('nodegit');

const NodeGitLfs = require('nodegit-lfs')(NodeGit);

console.log('NodeGitLFS: ', NodeGitLfs);

const NodeGitLFS = NodeGitLfs.then((ng) => {
	console.log('NodeGitLFS: ', ng.LFS);
	return ng;
});