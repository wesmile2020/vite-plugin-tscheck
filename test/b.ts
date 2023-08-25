import * as fs from 'fs';
import * as child_process from 'node:child_process';

const a: string = '1';

const lngLat: LngLat = { lng: 1, lat: 1 };

child_process.spawn('ls', [], {})
