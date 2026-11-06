import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('./build/',import.meta.url);
const allowed=new Set(['index.html','SOURCE_NOTES.md','RULES_FREEZE.md','RULES_PRE_RUN_REVISION.md','RULES_V2.md','RULES_V3.md']);
const mobile='<!doctype html><html lang="en"><meta charset="utf-8"><title>Breakwater 390px QA viewport</title><style>body{margin:0;background:#e5e5e5;color:#152a32;font:16px system-ui}h1,p{margin:12px}iframe{display:block;width:390px;height:1600px;border:0;margin:0 20px}</style><h1>390px game viewport</h1><p>QA only: the unchanged offline game in a narrow iframe. This is not mobile-device emulation.</p><iframe src="/index.html" title="Breakwater Market, 390 pixel viewport"></iframe></html>';
const shortMobile=mobile.replace('height:1600px','height:780px').replace('390px game viewport','390 x 780 CSS-pixel game viewport');
const smallMobile=shortMobile.replaceAll('390','320').replaceAll('780','640');
const server=http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://127.0.0.1').pathname;
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'");
 if(pathname==='/qa-mobile.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(mobile);return;}
 if(pathname==='/qa-short.html'||pathname==='/qa-small.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(pathname==='/qa-short.html'?shortMobile:smallMobile);return;}
 const name=pathname==='/'?'index.html':pathname.slice(1);
 if(!allowed.has(name)){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}
 try{const data=await readFile(new URL(name,root));res.writeHead(200,{'Content-Type':name.endsWith('.html')?'text/html; charset=utf-8':'text/plain; charset=utf-8'});res.end(data);}catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Build missing. Run python3 build.py first.');}
});
const port=Number(process.env.PORT||39841);
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({address:server.address(),node:process.version,root:fileURLToPath(root)})));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
