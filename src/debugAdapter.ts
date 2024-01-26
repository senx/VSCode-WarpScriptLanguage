/*
 *  Copyright 2024  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { promises as fs } from 'fs';
import Net from 'net';
import { FileAccessor } from './debug/warp10DebugRuntime';
import { Warp10DebugSession } from './debug/warp10Debug';

/*
 * debugAdapter.js is the entrypoint of the debug adapter when it runs as a separate process.
 */

/*
 * Since here we run the debug adapter as a separate ("external") process, it has no access to VS Code API.
 * So we can only use node.js API for accessing files.
 */
const fsAccessor: FileAccessor = {
  isWindows: process.platform === 'win32',
  readFile(path: string): Promise<Uint8Array> {
    return fs.readFile(path);
  },
  writeFile(path: string, contents: Uint8Array): Promise<void> {
    return fs.writeFile(path, contents);
  }
};

// first parse command line arguments to see whether the debug adapter should run as a server
let port = 0;
const args = process.argv.slice(2);
args.forEach(val => {
  const portMatch = /^--server=(\d{4,5})$/.exec(val);
  if (portMatch) {
    port = parseInt(portMatch[1], 10);
  }
});

if (port > 0) {

  // start a server that creates a new session for every connection request
  console.error(`waiting for debug protocol on port ${port}`);
  Net.createServer((socket) => {
    console.error('>> accepted connection from client');
    socket.on('end', () => console.error('>> client connection closed\n'));
    const session = new Warp10DebugSession(fsAccessor);
    session.setRunAsServer(true);
    session.start(socket, socket);
  }).listen(port);
} else {
  // start a single session that communicates via stdin/stdout
  const session = new Warp10DebugSession(fsAccessor);
  process.on('SIGTERM', () => session.shutdown());
  session.start(process.stdin, process.stdout);
}
