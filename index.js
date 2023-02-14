import puppeteer from "puppeteer"


// First, I launch Chrome with --remote-debugging-port=9222 and then get this link
// to open in existing chrome with all my user settings, otherwise I get {"error": "Bad request"}
// Also tried UserAgent but It didn't work.
const wsChromeEndpointUrl = 'ws://127.0.0.1:9222/devtools/browser/0a07a0a8-0894-4e9c-af74-d2ad11b13c17';
const url = "http://dev.amidstyle.com/";
const data = async () => {
    const browser = await puppeteer.connect({browserWSEndpoint: wsChromeEndpointUrl});

    const page = await browser.newPage();
 
    await page.goto(url);
    const selector = '#data';

    await page.waitForFunction(
        selector => document.querySelector(selector).innerText.includes("result"),
        {},
        selector
    )

    await page.screenshot({path :"response.png", fullPage: true})
    const element = await page.waitForSelector(selector);
    const text = await element.evaluate(el => el.textContent);
    try {
        const json = JSON.parse(text);
        return json;
    } catch (error) {
        console.log(error)
    }
}
let result = await data();
console.log(result);
