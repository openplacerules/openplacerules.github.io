// Tiny UDP DNS server answering TXT queries from a map. For local tests only.
const dgram = require('dgram');
function parseName(buf, off) {
  const labels = [];
  while (buf[off] !== 0) { const len = buf[off]; labels.push(buf.slice(off + 1, off + 1 + len).toString()); off += len + 1; }
  return { name: labels.join('.').toLowerCase(), end: off + 1 };
}
function start(records, port = 0) { // records: { "_place-rules.cafe.test": ["place-rules-verification=..."] }
  const sock = dgram.createSocket('udp4');
  sock.on('message', (msg, rinfo) => {
    const id = msg.readUInt16BE(0);
    const { name, end } = parseName(msg, 12);
    const qtype = msg.readUInt16BE(end);
    const question = msg.slice(12, end + 4);
    const txts = qtype === 16 ? records[name] || [] : [];
    const answers = txts.map((t) => {
      const data = Buffer.concat([Buffer.from([Buffer.byteLength(t)]), Buffer.from(t)]);
      const rr = Buffer.alloc(12);
      rr.writeUInt16BE(0xc00c, 0); rr.writeUInt16BE(16, 2); rr.writeUInt16BE(1, 4); rr.writeUInt32BE(60, 6); rr.writeUInt16BE(data.length, 10);
      return Buffer.concat([rr, data]);
    });
    const hdr = Buffer.alloc(12);
    hdr.writeUInt16BE(id, 0);
    hdr.writeUInt16BE(records[name] ? 0x8180 : 0x8183, 2); // NOERROR or NXDOMAIN
    hdr.writeUInt16BE(1, 4); hdr.writeUInt16BE(answers.length, 6);
    sock.send(Buffer.concat([hdr, question, ...answers]), rinfo.port, rinfo.address);
  });
  return new Promise((res) => sock.bind(port, '127.0.0.1', () => res({ port: sock.address().port, close: () => sock.close() })));
}
module.exports = { start };
