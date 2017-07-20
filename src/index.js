const fs = require('fs');
const path = require('path');
const NodeGit = require('nodegit');
const NodeGitLfs = require('nodegit-lfs')(NodeGit);
const exec = require('./execHelper').exec;
const isAtleastGitVersion = require('./regex');

const Checkout = NodeGit.Checkout;
const Remote = NodeGit.Remote;
const Repository = NodeGit.Repository;

let repository;
let testRemote;
let nodegit;

const sshKeyPath = {
	public: path.join('/Users/mohseenm/.ssh', 'test.pub'),
	private: path.join('/Users/mohseenm/.ssh', 'test')
}

const pushOptions = {
	callbacks: {
		certificateCheck: () => 1,
		credentials: (url, username) =>
			NodeGit.Cred.sshKeyNew(username, sshKeyPath.public, sshKeyPath.private, '')
	}
}

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
			// TODO: this is the problem
			/* return Promise.all([
			NodeGit.Signature.create("Mohseen Mukaddam", "mohseenmukaddam6@gmail.com", 123456789, 60),
			NodeGit.Signature.create("Foo A Bar", "mohseenmukaddam6@gmail.com", 987654321, 90)
			]); */
			return NodeGit.Signature.default(repo);
		})
		.then(function(signatures) {
			/* let author = signatures[0];
			let committer = signatures[1];

			return repo.createCommit(
			"HEAD",
			author,
			committer,
			commitMessage,
			treeOid,
			[parent]); */
			return repo.createCommit(
			"HEAD",
			signatures,
			signatures,
			commitMessage,
			treeOid,
			[parent]);
		});
}

const testClean = () => {
	const NodeGitLFS = NodeGitLfs.then((ng) => {
		console.log('NodeGitLFS: ', ng.LFS);
		return ng;
	})
		.then((ng) => ng.LFS.initialize(process.cwd()))
		// .then(() => fs.appendFileSync(path.join(process.cwd(), '.gitattributes'), '*.txt filter=lfs\n'));
		.then(() => exec('base64 /dev/urandom | head -c 20 > big_file_test.txt'))
		.then((process, stdin, stdout) => console.log(`[DEBUG]{Process}: ${process}\n\n`))
		.then(()=> {
			return Repository.open(process.cwd())
		})
		.then((repo) => {
			return commitFile(repo, 'big_file_test.txt', 'LFS Clean Test')
		});
};

const testSmudge = () => {
	const NodeGitLFS = NodeGitLfs.then((ng) => {
		console.log('NodeGitLFS: ', ng.LFS);
		return ng;
	})
		.then((ng) => ng.LFS.initialize(process.cwd()))
		.then(() => exec('base64 /dev/urandom | head -c 20 > big_file_test.txt'))
		.then((process, stdin, stdout) => console.log(`[DEBUG]{Process}: ${process}\n\n`))
		.then(()=> {
			return Repository.open(process.cwd())
		})
		.then((repo) => {
			var opts = {
				checkoutStrategy: Checkout.STRATEGY.FORCE
			};
			return Checkout.head(repo, opts);
		});
};

const testAddAttribute = () => {
	return NodeGitLfs
		.then(ng => ng.LFS.addAttribute(path.join(process.cwd(), '.gitattributes'), '*.dmg'))
		.catch(error => console.log(error));
};

const testGitVersion = () => {
	return exec('git --version').catch(err => console.log('Error executing git --version'))
		.then((stdout, stderr) => {
			return console.log(isAtleastGitVersion(stdout, '2.18.2'));
		});
};

const testPush = () => {
	const NodeGitLFS = NodeGitLfs.then((ng) => {
		console.log('NodeGitLFS: ', ng.LFS);
		nodegit = ng;
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
			repository = repo;
			return repo;
		})
		.then((repo) => {
			return commitFile(repo, 'big_file_test.txt', 'LFS Clean Test PUSH')
		})
		.then(() => nodegit.LFS.commands.push('origin master --all'))
		.then(({process, stdout, stderr}) => {
			console.log('LFS PUSH STDOUT: ', stdout);
		})
		/* .then(() => Remote.lookup(repository, 'origin'))
		.then((remote) => {
			testRemote = remote;
			return remote.getRefspec(0);
		})
		.then(spec => testRemote.push(['refs/heads/master:refs/remotes/origin/master'], pushOptions)) */
		.catch(err => console.log('Error: ', err));
		// .then(() => console.log('Test repo: ', repository));
};
return testPush();