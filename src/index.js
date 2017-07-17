const fs = require('fs');
const path = require('path');
const NodeGit = require('nodegit');
const NodeGitLfs = require('nodegit-lfs')(NodeGit);
const exec = require('./execHelper');
const Repository = NodeGit.Repository;

console.log('NodeGitLFS: ', NodeGitLfs);
function commitFile(repo, fileName, commitMessage) {
	let index;
	let treeOid;
	let parent;

	return repo.refreshIndex()
		.then(function(indexResult) {
			index = indexResult;
		})
		.then(function() {
			return index.addByPath(fileName);
		})
		.then(function() {
			return index.write();
		})
		.then(function() {
			return index.writeTree();
		})
		.then(function(oidResult) {
			treeOid = oidResult;
			return NodeGit.Reference.nameToId(repo, "HEAD");
		})
		.then(function(head) {
			return repo.getCommit(head);
		})
		.then(function(parentResult) {
			parent = parentResult;
			return Promise.all([
			NodeGit.Signature.create("Foo Bar", "foo@bar.com", 123456789, 60),
			NodeGit.Signature.create("Foo A Bar", "foo@bar.com", 987654321, 90)
			]);
		})
		.then(function(signatures) {
			let author = signatures[0];
			let committer = signatures[1];

			return repo.createCommit(
			"HEAD",
			author,
			committer,
			commitMessage,
			treeOid,
			[parent]);
		});
}

const NodeGitLFS = NodeGitLfs.then((ng) => {
	console.log('NodeGitLFS: ', ng.LFS);
	return ng;
})
	.then((ng) => ng.LFS.initialize(process.cwd()))
	// .then(() => fs.appendFileSync(path.join(process.cwd(), '.gitattributes'), '*.txt filter=lfs\n'));
	.then(() => exec('base64 /dev/urandom | head -c 20 > big_file_test.txt'))
	.then(({process, stdin, stdout}) => console.log(`[DEBUG]{Process}: ${process}\n\n`))
	.then(()=> {
		return Repository.open(process.cwd())
	})
	.then((repo) => {
		return commitFile(repo, 'big_file_test.txt', 'LFS Clean Test')
	});
