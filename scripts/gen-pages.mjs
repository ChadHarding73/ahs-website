// One-time: writes src/*.njk from baseline/content.json. Never re-run after edits; edit the .njk files directly.
import fs from 'fs';
const c = JSON.parse(fs.readFileSync('baseline/content.json', 'utf8'));
const slideshow = (imgs, auto) => `<div class="slideshow"${auto ? ' data-autoplay="1"' : ''}>\n` +
  imgs.map((s, i) => `  <div class="slide${i ? '' : ' on'}"><img src="${s}" alt="Angie Harding Style"${i ? ' loading="lazy"' : ''}></div>`).join('\n') +
  `\n  <button class="ss-btn prev" aria-label="Previous">&#8249;</button><button class="ss-btn next" aria-label="Next">&#8250;</button>\n</div>`;
const strip = (imgs) => `<div class="strip">\n  <div class="track">\n` + imgs.map(s => `    <img src="${s}" alt="Angie Harding Style" loading="lazy">`).join('\n') +
  `\n  </div>\n  <button class="ss-btn prev" aria-label="Previous">&#8249;</button><button class="ss-btn next" aria-label="Next">&#8250;</button>\n</div>`;
const body = (h) => h.replace(/^<div>\s*|\s*<\/div>$/g, '').replace(/<p> <\/p>/g, '').replace(/<\/(h\d|p)>/g, '</$1>\n').trim();
const fm = (o) => '---\n' + Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n';
const w = (f, s) => fs.writeFileSync('src/' + f, s);
const L = { layout: 'base.njk' };

w('index.njk', fm({ ...L, bodyClass: 'home', permalink: '/' }) + slideshow(c.home[0].imgs, true) + '\n');

const a = c.about;
w('about.njk', fm({ ...L, title: 'About', permalink: '/about/' }) +
  `<div class="cols">\n<div class="sticky">\n${slideshow(a[0].imgs, true)}\n</div>\n<div>\n${body(a[1].html)}\n</div>\n</div>\n${strip(a[2].imgs)}\n`);

const s = c.services; let out = `<div class="intro">\n${body(s[0].html)}\n</div>\n`;
for (let i = 1; i < s.length; i += 2) out += `<section class="cols svc">\n<div><img src="${s[i].imgs[0]}" alt="Angie Harding Style" loading="lazy"></div>\n<div>\n${body(s[i + 1].html)}\n</div>\n</section>\n`;
w('services.njk', fm({ ...L, title: 'Services', permalink: '/services/' }) + out);

const t = c.testimonials;
w('testimonials.njk', fm({ ...L, title: 'Testimonials', permalink: '/new-page/' }) +
  `<div class="cols">\n<div class="sticky">\n${slideshow(t[0].imgs, true)}\n</div>\n<div>\n${body(t[1].html)}\n</div>\n</div>\n`);

const k = c.contact;
const form = `<form name="contact" method="POST" action="/contact-thanks/" data-netlify="true" netlify-honeypot="bot-field">
  <p class="hidden"><label>Leave this empty <input name="bot-field"></label></p>
  <div class="field"><label>Name</label>
    <div class="row">
      <div><label class="sub" for="fname">First Name <span class="req">(required)</span></label><input type="text" id="fname" name="first_name" required></div>
      <div><label class="sub" for="lname">Last Name <span class="req">(required)</span></label><input type="text" id="lname" name="last_name" required></div>
    </div>
  </div>
  <div class="field"><label for="email">Email Address <span class="req">(required)</span></label><input type="email" id="email" name="email" required></div>
  <div class="field"><label for="phone">Phone</label><input type="tel" id="phone" name="phone"></div>
  <div class="field"><label for="subject">Subject <span class="req">(required)</span></label><input type="text" id="subject" name="subject" required></div>
  <div class="field"><label for="message">Message <span class="req">(required)</span></label><textarea id="message" name="message" required></textarea></div>
  <div class="field"><label for="heard">How did you hear about Angie Harding Style?</label><input type="text" id="heard" name="heard_about"></div>
  <div class="field"><label>Keep me updated!</label>
    <label class="check"><input type="checkbox" name="keep_updated" value="yes"> Please email me periodically with new services from Angie Harding Style</label></div>
  <div class="field"><label>Interested in (check all that apply):</label>
${['Closet Consultation', 'Shopping', 'Wardrobe Update', 'Travel', 'Events', 'Gift'].map(x => `    <label class="check"><input type="checkbox" name="interested_in[]" value="${x}"> ${x}</label>`).join('\n')}
  </div>
  <button type="submit">Submit</button>
</form>`;
w('contact.njk', fm({ ...L, title: 'Contact', permalink: '/contact/' }) +
  `<div class="cols">\n<div class="sticky"><img src="${k[1].imgs[0]}" alt="Angie Harding Style"></div>\n<div>\n${body(k[0].html)}\n${form}\n</div>\n</div>\n${strip(k[3].imgs)}\n`);

w('contact-thanks.njk', fm({ ...L, title: 'Thank you', permalink: '/contact-thanks/', eleventyExcludeFromCollections: true }) +
  `<div class="cols"><div></div><div>\n<h1>Thank you!</h1>\n<p>Thanks for reaching out. I'll be in touch soon.</p>\n<p><a href="/">Back to home</a></p>\n</div></div>\n`);
w('404.njk', fm({ ...L, title: 'Page not found', permalink: '/404.html' }) +
  `<div class="cols"><div></div><div>\n<h1>Page not found</h1>\n<p>Sorry, that page doesn't exist. <a href="/">Back to home</a></p>\n</div></div>\n`);
console.log('pages written');
