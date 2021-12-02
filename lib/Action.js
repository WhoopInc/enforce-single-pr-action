"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createAction = exports.Action = void 0;
const PullRequestsAPI_1 = require("./PullRequestsAPI");
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
class Action {
    constructor(api, userName) {
        this.api = api;
        this.userName = userName;
    }
    perform() {
        return __awaiter(this, void 0, void 0, function* () {
            let pullRequests = yield this.api.listPullRequests();
            let filtered = pullRequests.filter((pr) => { var _a; return ((_a = pr.user) === null || _a === void 0 ? void 0 : _a.login) == this.userName; });
            if (filtered.length > 1) {
                let newest = filtered[0].number;
                filtered.splice(0, 1);
                for (let i = 0; i < filtered.length; i++) {
                    try {
                        this.api.createComment(filtered[i].number, `Closing PR as it is superceeded by #${newest}`);
                        this.api.closePullRequest(filtered[i].number);
                        this.api.deletePullRequestBranch(filtered[i]);
                    }
                    catch (e) {
                        core.warning(`An error occurred closing PR # ${filtered[i].number}, moving on to the next PR.`);
                    }
                }
            }
        });
    }
}
exports.Action = Action;
function createAction() {
    let token = core.getInput("token");
    const git = github.getOctokit(token);
    let owner = github.context.repo.owner;
    let repo = github.context.repo.repo;
    let username = core.getInput("username");
    let api = (0, PullRequestsAPI_1.createPullRequestAPI)(git, owner, repo);
    return new Action(api, username);
}
exports.createAction = createAction;
