const puppeteer = require('puppeteer');

module.exports = async url => {
  const browser = await puppeteer.launch({
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  const metas = await page.$$eval('meta[property^="og:"]', metas => metas.reduce((metas, meta) => { metas[meta.getAttribute('property')] = meta.getAttribute('content'); return metas; }, {}));

  const description = await page.$eval('meta[name="description"]', meta => meta.getAttribute('content')).catch(() => null);
  const title = await page.title().catch(() => null);
  const h1 = await page.$eval('h1', h1 => h1.textContent).catch(() => null);
  const image = await page.$eval('img', img => img.src).catch(() => null);
  const content = await page.$eval('body', body => body.textContent.replace(/[\r\n\t\s]/g, '').substring(0, 400)).catch(() => null);
  
  browser.close();
  
  const result = {
    title: metas['og:title'] || title || h1,
    image: metas['og:image'] || image,
    description: metas['og:description'] || description || content,
  };
  return result;
};
