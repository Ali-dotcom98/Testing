const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

async function testLogin() {
    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('1. 🌐 Navigating to login page...');
        await driver.get('http://localhost:3000/LoginAdmin');
        await driver.wait(until.elementLocated(By.id('Email')), 5000);

        console.log('2. 🧑‍💼 Filling credentials...');
        await driver.findElement(By.id('Email')).sendKeys('test@example.com');
        await driver.findElement(By.id('Password')).sendKeys('wrongpassword');

        console.log('3. 🔐 Submitting form...');
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('4. ⏳ Waiting for response...');
        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();
            const errorElements = await driver.findElements(By.id('error'));
            return currentUrl !== 'http://localhost:3000/LoginAdmin' || errorElements.length > 0;
        }, 5000);

        const errorElements = await driver.findElements(By.id('error'));
        if (errorElements.length > 0) {
            const errorText = await errorElements[0].getText();
            console.log(`✔ Test passed - Error message displayed: "${errorText}"`);
            assert.ok(errorText.length > 0, 'Error message should not be empty');
            process.exit(0); // ✅
        } else {
            const currentUrl = await driver.getCurrentUrl();
            console.log(`✖ Test failed - Unexpected redirect to: ${currentUrl}`);
            assert.fail('Login should have failed with an error message');
        }

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        if (driver) {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('login-test-failure.png', screenshot, 'base64');
            console.log('📸 Screenshot saved as login-test-failure.png');
        }
        process.exit(1); // ❌
    } finally {
        console.log('5. 🧹 Closing browser...');
        await driver.quit();
    }
}

console.log('\n🔍 Starting login test...');
testLogin();
