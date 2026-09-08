import { mkdir, cp, copyFile } from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','about.html','portfolio.css','portfolio.js']) await copyFile(file,`dist/${file}`);
for(const dir of ['trails-skeleton','assets','nc-dollar-general']) await cp(dir,`dist/${dir}`,{recursive:true});
console.log('Static portfolio built with About page, portrait, and NC explorer.');
