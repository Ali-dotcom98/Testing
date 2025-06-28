const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testProfileNavigation() {
    const config = {
        baseUrl: 'http://localhost:3000',
        loginPath: '/Site/Login',
        validCredentials: {
            email: 'Alishah1234584.as@gmail.com',
            password: '12345'
        }
    };

    let driver;
    try {
        console.log('1. 🚀 Launching browser...');
        const options = new chrome.Options()
            .addArguments('--headless=new')
            .addArguments('--no-sandbox')
            .addArguments('--disable-dev-shm-usage')
            .addArguments('--disable-logging');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. 🔐 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. 🏠 Waiting for dashboard to load...');
        await driver.wait(until.urlContains('home'), 10000);

        console.log('4. 👤 Locating Profile link...');
        const profileLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Profile']/ancestor::a[contains(@href, '/home/UserProfile')]")),
            5000
        );

        console.log('5. 🖱️ Clicking Profile link...');
        await profileLink.click();

        console.log('6. ✅ Verifying profile page...');
        await driver.wait(until.urlContains('UserProfile'), 5000);
        const currentUrl = await driver.getCurrentUrl();

        assert.ok(currentUrl.includes('UserProfile'), 'Should navigate to UserProfile page');
        console.log(`✔ Success! Navigated to: ${currentUrl}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log('7. 🧹 Closing browser...');
            await driver.quit();
        }
    }
}

console.log('\n🧪 Starting profile navigation test...\n');
testProfileNavigation();
