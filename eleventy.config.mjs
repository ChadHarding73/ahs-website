export default function (cfg) {
  cfg.addPassthroughCopy('src/images');
  cfg.addPassthroughCopy('src/assets');
  cfg.addPassthroughCopy({ 'src/_redirects': '_redirects' });
  return { dir: { input: 'src', output: '_site' }, htmlTemplateEngine: 'njk' };
}
