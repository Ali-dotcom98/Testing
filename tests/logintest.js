const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testLogin() {
    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('1. 🌐 Navigating to login page...');
        await driver.get('http://localhost:3000/Site/Login');
        await driver.wait(until.elementLocated(By.id('Email')), 5000);

        console.log('2. ✍️ Filling correct credentials...');
        await driver.findElement(By.id('Email')).sendKeys('Alishah1234584.as@gmail.com');
        await driver.findElement(By.id('Password')).sendKeys('12345');

        console.log('3. 🔐 Clicking login...');
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('4. ⏳ Waiting for redirect to home...');
        await driver.wait(until.urlContains('home'), 10000);

        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('/home')) {
            console.log(`✅ Test passed - Successfully logged in! Redirected to: ${currentUrl}`);
            process.exit(0);
        } else {
            console.log(`❌ Test failed - Not redirected to home. Current URL: ${currentUrl}`);
            assert.fail('Did not redirect to home page after login');
        }

    } catch (error) {
        console.error('❌ Test encountered an error:', error.message);
        process.exit(1);
    } finally {
        console.log('5. 🧹 Closing browser...');
        await driver.quit();
    }
}

console.log('\n🚀 Starting login success test...');
testLogin();
