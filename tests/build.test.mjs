import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root=resolve('dist');
const read=path=>readFileSync(join(root,path),'utf8');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
const htmlFiles=walk(root).filter(file=>file.endsWith('.html'));
test('Every note has a rendered page and a usable index link',()=>{
 const index=read('index.html');
 const folders=readdirSync(join(root,'notes'));
 assert.equal(folders.length,6);
 for(const slug of folders){
  assert.ok(index.includes(`/personal-notes/notes/${slug}/`));
  const article=read(`notes/${slug}/index.html`);
  assert.match(article,/id="reader-title"/);
  assert.match(article,/class="article-content"/);
  assert.match(article,/rel="canonical"/);
  assert.match(article,/End of note/);
 }
});
test('Local links and compiled assets resolve under the GitHub Pages base',()=>{
 for(const file of htmlFiles){
  const html=readFileSync(file,'utf8');
  for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
   const url=match[1].split('#')[0].split('?')[0];
   if(!url.startsWith('/'))continue;
   assert.ok(url.startsWith('/personal-notes/'),`${file}: incorrect base ${url}`);
   const relative=url.slice('/personal-notes/'.length);
   const target=join(root,relative);
   assert.ok(existsSync(target),`${file}: missing ${url}`);
  }
  assert.ok(!html.includes('fonts.googleapis.com'));
 }
});
test('Illustrations, reference tables, and long-form navigation survive Markdown rendering',()=>{
 const essay=read('notes/judging-my-code-and-ai-workflow/index.html');
 assert.equal((essay.match(/class="editorial-figure"/g)||[]).length,3);
 assert.equal((essay.match(/<table[ >]/g)||[]).length,3);
 assert.match(essay,/class="reader-outline"/);
 assert.match(essay,/PLATFORMLEAK/);
 const sample=read('notes/the-quiet-work-of-a-loading-state/index.html');
 assert.equal((sample.match(/class="editorial-figure"/g)||[]).length,5);
});
test('Discovery and fallback pages are generated',()=>{
 assert.match(read('rss.xml'),/<rss version="2.0">/);
 assert.equal((read('rss.xml').match(/<item>/g)||[]).length,6);
 assert.equal((read('sitemap.xml').match(/<url>/g)||[]).length,7);
 assert.match(read('404.html'),/This page isn’t here/);
});
