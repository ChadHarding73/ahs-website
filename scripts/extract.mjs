// One-time migration: pull content + images from the Squarespace baseline. Never re-run after edits.
import { load } from 'cheerio'; import fs from 'fs'; import path from 'path';
const pages = { home:'home', about:'about', services:'services', testimonials:'new-page', contact:'contact' };
const seen = new Map(); const out = {};
const local = (u) => { const base = u.split('?')[0]; if (seen.has(base)) return seen.get(base);
  let name = decodeURIComponent(path.basename(base)).toLowerCase().replace(/[^a-z0-9.]+/g,'-');
  if (name === 'image-asset.jpeg' || [...seen.values()].includes('/images/'+name)) name = base.split('/').slice(-2,-1)[0].split('-')[0] + '-' + name;
  seen.set(base, '/images/' + name); return '/images/' + name; };
const clean = ($, el) => { const c = $(el).clone(); c.find('script,style,noscript').remove();
  c.find('*').each((_, e) => { const keep = ['href']; for (const a of Object.keys(e.attribs||{})) if (!keep.includes(a)) $(e).removeAttr(a); });
  c.find('span').each((_, e) => $(e).replaceWith($(e).html()));
  return c.html().replace(/&nbsp;/g,' ').replace(/\s+\n/g,'\n').trim(); };
for (const [key, file] of Object.entries(pages)) {
  const $ = load(fs.readFileSync(`baseline/${file}.html`, 'utf8'));
  const blocks = [];
  $('.sqs-layout .sqs-block').each((_, b) => {
    const imgs = $(b).find('[data-src]').map((_, e) => local($(e).attr('data-src'))).get();
    const alts = $(b).find('[data-src]').map((_, e) => $(e).attr('alt') || '').get();
    const kind = $(b).find('.sqs-gallery-block-slider').length ? 'slider' : $(b).find('.sqs-gallery-block-slideshow').length ? 'slideshow' : imgs.length ? 'image' : $(b).find('form').length || $(b).attr('class').includes('form-block') ? 'form' : 'html';
    const html = kind === 'html' ? clean($, $(b).find('.sqs-block-content')) : '';
    if (kind === 'html' && !$(b).text().trim()) return;
    blocks.push({ kind, imgs, alts, html });
  });
  if (key === 'home') blocks.unshift({ kind:'slideshow', imgs: $('[data-src]').map((_, e) => local($(e).attr('data-src'))).get(), alts: [] });
  out[key] = blocks.filter(b => !(b.kind==='html' && /Copyright Angie/.test(b.html)));
}
const logo = 'https://images.squarespace-cdn.com/content/v1/57df71fe9f7456ee883fd9b4/1474266797879-X9QYX3B1L6P8KNS1QPTY/AH-script-websize.jpg';
out.logo = local(logo);
fs.writeFileSync('baseline/content.json', JSON.stringify(out, null, 1));
for (const [u, l] of seen) { const f = 'src' + l; if (fs.existsSync(f)) continue;
  const r = await fetch(u + '?format=1500w'); if (!r.ok) throw new Error(r.status + ' ' + u);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); }
console.log(seen.size, 'images'); for (const [k,v] of Object.entries(out)) if (Array.isArray(v)) console.log(k, v.map(b=>b.kind+(b.imgs.length?'('+b.imgs.length+')':'')).join(' '));
