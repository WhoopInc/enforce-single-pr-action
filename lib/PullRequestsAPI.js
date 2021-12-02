"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPullRequestAPI = void 0;
class GithubPullRequestAPI {
    constructor(git, owner, repo) {
        this.git = git;
        this.owner = owner;
        this.repo = repo;
    }
    listPullRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.git.rest.pulls.list({
                owner: this.owner,
                repo: this.repo
            });
            return response.data;
        });
    }
    closePullRequest(issue_number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.git.rest.issues.update({
                owner: this.owner,
                repo: this.repo,
                issue_number: issue_number,
                state: 'closed'
            });
        });
    }
    createComment(issue_number, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.git.rest.issues.createComment({
                owner: this.owner,
                repo: this.repo,
                issue_number: issue_number,
                body: body
            });
        });
    }
    deletePullRequestBranch(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.git.rest.git.deleteRef({
                owner: this.owner,
                repo: this.repo,
                ref: `heads/${pullRequest.head.ref}`
            });
        });
    }
}
function createPullRequestAPI(git, owner, repo) {
    return new GithubPullRequestAPI(git, owner, repo);
}
exports.createPullRequestAPI = createPullRequestAPI;
