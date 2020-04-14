const puppeteer = require("puppeteer");

let browser;

const startScript = async (url = process.env.URL, username = process.env.EMAIL, password = process.env.PASSWORD, personName = process.env.NAME) => {
  const executablePath = `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`;
  browser = await puppeteer.launch({
    headless: false,
    executablePath,
  });
  const page = await browser.newPage();
  let loggedIn = false;

  // var userAgent = require('user-agents');
  // await page.setUserAgent(userAgent.toString())

  await page.goto(url);
  // await page.screenshot({ path: "bbb.png" });

  let errorEl;

  let keepVoting = true;

  while (keepVoting) {
    let redirected = await returnToMainPage(page);

    if (redirected) redirected = await returnToMainPage(page);

    await selectPerson(page, personName);

    if (!loggedIn) loggedIn = await login(page, username, password);

    console.log("Find image and select it");

    const imgString = await page.$("span.gc__2e8f-");

    const text = await (await imgString.getProperty("textContent")).jsonValue();

    console.log("text found", text);

    await page.waitFor(2000);

    console.log("Try to vote");
    const imageEl = await page.$("img.gc__3_EfD");
    if (imageEl) await clickOnElement(page, imageEl, null, null);
    await page.waitFor(5000);

    errorEl = await findByText(
      page,
      "Para confirmar seu voto, selecione:",
      "span"
    );

    while (errorEl) {
      console.log("Try to vote");
      const imageEl = await page.$("img.gc__3_EfD");
      if (imageEl) await clickOnElement(page, imageEl, null, null);
      await page.waitFor(5000);
      errorEl = await findByText(
        page,
        "Para confirmar seu voto, selecione:",
        "span"
      );
    }

    console.log("Vote success!");

    console.log("Vote again");

    page.waitFor(5000);

    await voteAgain(page);
  }
};

async function findByText(page, linkString, selector) {
  const getText = (linkText) => {
    linkText = linkText.replace(/\r\n|\r/g, "\n");
    linkText = linkText.replace(/\ +/g, " ");

    // Replace &nbsp; with a space
    var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    return linkText.replace(nbspPattern, " ");
  };

  const links = await page.$$(selector);
  for (var i = 0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty("innerText");
    let linkText = await valueHandle.jsonValue();
    const text = getText(linkText);
    if (linkString == text) {
      return links[i];
    }
  }
  return null;
}

async function clickOnElement(page, elem, x = null, y = null) {
  const rect = await page.evaluate((el) => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { top, left, width, height };
  }, elem);

  // Use given position or default to center
  const _x = x !== null ? x : rect.width / 2;
  const _y = y !== null ? y : rect.height / 2;

  await page.mouse.click(rect.left + _x, rect.top + _y);
}

const selectPerson = async (page, name) => {
  console.log('select', name);
  try {
    await page.waitFor(2000);
    await page.waitFor('div._21TgL80MNap3Ua4HvZTb4t');
    const person = await findByText(page, name, "div._21TgL80MNap3Ua4HvZTb4t");
    await page.waitFor(2000);
    console.log('person found', 'click it');
    person.click();
    await page.waitFor(5000);
  } catch (error) {
    console.log("error found");
    page.close();
    browser.close();
  }
};

const login = async (page, username, password) => {
  try {
    console.log("login");
    await page.waitFor("div.login-modal > iframe");
    const elementHandle = await page.$("div.login-modal > iframe");
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('[ng-model="credentials.email"]');
    const usernameEl = await frame.$('[ng-model="credentials.email"]');
    await usernameEl.type(username);
    const passwordEl = await frame.$('[ng-model="credentials.password"]');
    await passwordEl.type(password);
    const submitButton = await frame.$('button[type="submit"]');
    await submitButton.click();
    await page.waitFor(3000);
    console.log("login successfully");
    return true;
  } catch (error) {
    console.log("error login", error);
    return false;
  }
};

const voteAgain = async (page) => {
  await page.waitFor("button._2FQp0pTz1KSUdFKaO754EC");
  try {
    voteAgainButton = await findByText(page, "Votar Novamente", "button");
    voteAgainButton.click();
  } catch (error) {
    console.log("error found", error);
    browser.close();
  }
};

const returnToMainPage = async (page) => {
  await page.waitFor(2000);
  if (!page.url().includes("https://gshow.globo.com/")) {
    await page.close();
    return true;
  }
  return false;
};

module.exports = startScript;
