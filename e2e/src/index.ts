import puppeteer from "puppeteer";
const headless = process.env.HEADFUL !== "true";
const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0;

if (!isFinite(slowMo)) {
  throw new Error("SLOW_MO must be a number");
}
function wait(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  await page.goto("https://shibanovp.github.io/nrail-challenge/");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.click('a[href="#/about"]');
  let element = await page.$(".site-layout-content p");
  if (element) {
    let text = await element.evaluate((el) => el.textContent);
    console.log(text);
  } else {
    throw new Error("Element not found");
  }

  await browser.close();
})();
