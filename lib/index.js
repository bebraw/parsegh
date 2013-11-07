var string = require('annostring');

var partition = string.partition;
var trim = string.trim;
var rtrim = string.rtrim;


function parseGh(url) {
    if(!url) return {};

    var partitions = partition('github.com', url);

    if(partitions.length < 2) partitions = partition('github.io', url);
    if(partitions.length < 2) return {};
    if(url.indexOf('git@') == 0) return parseGit(url);
    if(partitions[0].split('//').filter(id).length > 1) return parseGhPages(partitions);

    var parts = partitions[1].split('/').filter(id);
    var user = parts[0];
    var repo = parseRepo(parts[1]);

    if(!user || !repo) {
        console.warn('Missing gh data', url, parts, user, repo);

        return {};
    }

    return {
        user: user,
        repo: repo
    };
}

module.exports = parseGh;

function parseGit(url) {
    var parts = url.split(':').slice(1).join('').split('/');

    return {
        user: parts[0],
        repo: parseRepo(parts[1])
    };
}

function parseGhPages(parts) {
    return {
        user: rtrim('.', parts[0].split('//')[1]),
        repo: trim('/', parts[1])
    };
}

function parseRepo(str) {
    if(!str) return;

    var parts = str.split('.git');

    if(parts.length > 1) return parts.slice(0, -1).join('');

    return str;
}

function id(a) {return a;}
