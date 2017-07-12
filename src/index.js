const NodeGit = require('nodegit');

const NodeGitLfs = require('nodegit-lfs')(NodeGit);

console.log('NodeGitLFS: ', NodeGitLfs);

const x = NodeGitLfs.then((i) => {
	console.log('Now? ', i);
	return i;
});

x.then( val => console.log('works?? ', val.LFS));