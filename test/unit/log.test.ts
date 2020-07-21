import { Writable } from 'stream';

describe('log', () => {
  it('sanitizes log data', () => {
    const brokerTk = (process.env.BROKER_TOKEN = 'BROKER_123');
    const githubTk = (process.env.GITHUB_TOKEN = 'GITHUB_123');
    const gitlabTk = (process.env.GITLAB_TOKEN = 'GITLAB_123');
    const bbUser = (process.env.BITBUCKET_USERNAME = 'BB_USER');
    const bbPass = (process.env.BITBUCKET_PASSWORD = 'BB_PASS');
    const jiraUser = (process.env.JIRA_USERNAME = 'JRA_USER');
    const jiraPass = (process.env.JIRA_PASSWORD = 'JRA_PASS');

    const log = require('../../lib/log');

    const sensitiveInfo = [
      brokerTk,
      githubTk,
      gitlabTk,
      bbUser,
      bbPass,
      jiraUser,
      jiraPass,
    ].join();
    const sanitizedTokens = '${BROKER_TOKEN},${GITHUB_TOKEN},${GITLAB_TOKEN}';
    const sanitizedBitBucket = '${BITBUCKET_USERNAME},${BITBUCKET_PASSWORD}';
    const sanitizedJira = '${JIRA_USERNAME},${JIRA_PASSWORD}';

    // setup logger output capturing
    const logs: string[] = [];
    const testStream = new Writable();
    testStream._write = function (chunk, encoding, done) {
      logs.push(chunk.toString());
      done();
    };
    log.addStream({ stream: testStream });

    // try to log sensitive information
    log.info({
      token: sensitiveInfo,
      result: sensitiveInfo,
      origin: sensitiveInfo,
      url: sensitiveInfo,
      httpUrl: sensitiveInfo,
      ioUrl: sensitiveInfo,
    });

    const logged = logs[0];
    expect(logs).toHaveLength(1);

    // assert no sensitive data is logged
    expect(logged).not.toMatch(brokerTk);
    expect(logged).not.toMatch(githubTk);
    expect(logged).not.toMatch(gitlabTk);
    expect(logged).not.toMatch(bbUser);
    expect(logged).not.toMatch(bbPass);
    expect(logged).not.toMatch(jiraUser);
    expect(logged).not.toMatch(jiraPass);

    // assert sensitive data is masked
    expect(logged).toMatch(sanitizedBitBucket);
    expect(logged).toMatch(sanitizedTokens);
    expect(logged).toMatch(sanitizedJira);
  });
});
