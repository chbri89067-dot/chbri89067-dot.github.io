import { mkdir, cp, copyFile } from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','portfolio.css','portfolio.js']) await copyFile(file,`dist/${file}`);
await cp('trails-skeleton','dist/trails-skeleton',{recursive:true});
console.log('Static portfolio built in dist. Original coursework preserved.');
