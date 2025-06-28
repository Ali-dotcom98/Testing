const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

const config = {
    baseUrl: 'http://localhost:3000',
    loginPath: '/Site/Login',
    validCredentials: {
        email: 'Alishah1234584.as@gmail.com',
        password: '12345'
    }
};

async function testDashboard() {
    let driver;
    try {
        console.log('1. 🚀 Launching browser...');
        const options = new chrome.Options();
        options.addArguments('--headless=new'); // Uncomment for headless mode
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. 🔐 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. ✅ Waiting for dashboard...');
        await driver.wait(until.urlContains('home'), 10000);

        const header = await driver.findElement(By.css('h1.text-2xl.font-bold.text-gray-900'));
        const headerText = await header.getText();
        assert.ok(headerText.includes("Dashboard") || headerText.length > 0, 'Dashboard header missing');
        console.log(`   ✔ Dashboard header: "${headerText}"`);

        const navLinks = await driver.findElements(By.css('.grid.grid-cols-2 a'));
        assert.ok(navLinks.length > 0, 'No navigation links found');
        console.log(`   ✔ Found ${navLinks.length} navigation links`);

        const parties = ['PTI', 'PMLN', 'MQM', 'PPP', 'JI'];
        for (const party of parties) {
            const card = await driver.findElement(By.id(party));
            assert.ok(await card.isDisplayed(), `${party} card not visible`);
            console.log(`   ✔ ${party} card is displayed`);
        }

        console.log('4. 🧪 Testing PTI modal...');
        const ptiCard = await driver.findElement(By.id('PTI'));
        await ptiCard.click();

        const modal = await driver.wait(until.elementLocated(By.id('Content1')), 5000);
        assert.ok(await modal.isDisplayed(), 'PTI modal did not appear');
        console.log('   ✔ PTI modal appeared');

        const closeBtn = await driver.findElement(By.id('close1'));
        await closeBtn.click();
        await driver.wait(until.elementIsNotVisible(modal), 3000);
        console.log('   ✔ PTI modal closed');

        console.log('\n🏁 TEST SUCCESS: Dashboard test passed');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        if (driver) {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('dashboard-test-failure.png', screenshot, 'base64');
            console.log('📸 Screenshot saved as dashboard-test-failure.png');
        }
        process.exit(1);
    } finally {
        if (driver) {
            console.log('5. 🧹 Closing browser...');
            await driver.quit();
        }
    }
}

console.log('\n🔍 Starting dashboard test...');
testDashboard();
