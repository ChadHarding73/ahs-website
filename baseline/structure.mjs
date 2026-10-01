import * as cheerio from 'cheerio'; import fs from 'fs';
for (const p of ['home','about','services','new-page','contact']) {
  const $ = cheerio.load(fs.readFileSync(`baseline/${p}.html`,'utf8'));
  console.log('=====',p);
  const walk=(el,d)=>{ $(el).children().each((_,c)=>{ const cls=$(c).attr('class')||'';
    if(/\brow\b|sqs-row/.test(cls)) {console.log(' '.repeat(d)+'ROW'); walk(c,d+1);}
    else if(/\bcol sqs-col-(\d+)/.test(cls)) {console.log(' '.repeat(d)+'COL '+cls.match(/sqs-col-(\d+)/)[1]); walk(c,d+1);}
    else if(/sqs-block /.test(cls)) { const t=cls.match(/(\w+)-block/)?.[1]; const imgs=$(c).find('[data-src]').length; const txt=$(c).text().replace(/\s+/g,' ').trim().slice(0,60); console.log(' '.repeat(d)+`BLOCK ${t} imgs=${imgs} ${txt}`); }
    else walk(c,d); }); };
  walk($('.sqs-layout').first(),1);
  const g=$('.sqs-gallery, #slideshow, .gallery').length; if(p==='home') console.log('home gallery imgs', $('[data-src]').map((_,e)=>$(e).attr('data-src')).get().slice(0,10));
}
