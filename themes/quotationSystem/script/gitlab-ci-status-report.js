/* eslint-disable @typescript-eslint/no-var-requires */
const http = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const argv = {};
process.argv.forEach(v => {
  const params = /^-(.*?)=(.*)$/.exec(v);
  if (params) {
    argv[params[1]] = params[2];
  }
});

const req = http.request(
  {
    hostname: 'gitlab.yanfa.xbrother.com',
    path: `/api/v4/projects/353/pipelines/${argv.pipeline_id}/jobs?scope[]=failed&scope[]=success`,
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': argv.token,
    },
  },
  res => {
    res.setEncoding('utf-8');
    res.on('data', jsonStr => {
      const result = JSON.parse(jsonStr);
      const failed = [];
      const twoNum = num => num.toFixed(0).padStart(2, 0);
      result.forEach(v => {
        console.log(
          [
            `\x1B[${v.status === 'failed' ? 31 : 32}m[${v.status}]\x1B[0m${v.name} => `,
            `duration: ${twoNum(v.duration / 60)}:${twoNum(v.duration % 60)}`,
          ].join('')
        );
        if (v.status === 'failed') {
          failed.push(v);
        }
      });
      if (failed.length) {
        throw Error(
          `构建失败\n${failed.map(v => `[${v.name.padEnd(10)}] => ${v.web_url}`).join('\n')}\n`
        );
      }
    });
  }
);

req.end();
