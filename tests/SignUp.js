const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testSignup() {
    const testData = {
        username: 'Test90900@gmail.com',
        password: '12345'
    };

    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-gpu')
        .addArguments('--log-level=3')
        .addArguments('--disable-logging');

    let driver;

    try {
        console.log("1. 🚀 Navigating to signup page...");
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('http://localhost:3000/Site/Signup');
        await driver.wait(until.elementLocated(By.id('Username')), 5000);

        console.log(`2. 📝 Filling signup form with: ${testData.username}`);
        await driver.findElement(By.id('Username')).sendKeys(testData.username);
        await driver.findElement(By.id('Password')).sendKeys(testData.password);

        console.log("3. 🖱️ Submitting the signup form...");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("4. ⏳ Waiting for redirect, message or validation...");
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();

            if (url.includes('home')) return true;

            const message = await driver.findElements(By.id('message'));
            if (message.length > 0 && await message[0].isDisplayed()) return true;

            const invalids = await driver.findElements(By.css('.Invalid'));
            return invalids.length > 0;
        }, 10000);

        const finalUrl = await driver.getCurrentUrl();

        if (finalUrl.includes('home')) {
            console.log(`✅ Signup successful! Redirected to: ${finalUrl}`);
            process.exit(0);
        }

        const messageElements = await driver.findElements(By.id('message'));
        if (messageElements.length > 0) {
            const msg = await messageElements[0].getText();
            if (msg.trim()) {
                console.log(`⚠️ Message shown: "${msg}"`);
                if (msg.includes("Email Should be Unique")) {
                    console.error("❌ Test failed: Duplicate email detected.");
                    process.exit(1);
                }
                process.exit(0);
            }
        }

        const invalidFields = await driver.findElements(By.css('.Invalid'));
        if (invalidFields.length > 0) {
            console.log('⚠️ Form validation errors detected');
            process.exit(0);
        }

        console.log('❌ Unknown response. No success, message, or validation.');
        process.exit(1);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log("6. 🧹 Closing browser...");
            await driver.quit();
        }
    }
}

testSignup();
