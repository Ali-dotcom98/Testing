const fs = require('fs');
const os = require('os');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testProfileUpdate() {
    const config = {
        baseUrl: 'http://localhost:3000',
        loginPath: '/Site/Login',
        validCredentials: {
            email: 'Alishah1234584.as@gmail.com',
            password: '12345'
        }
    };

    const tempUserDataDir = path.join(os.tmpdir(), `selenium-profile-${Date.now()}`);
    fs.mkdirSync(tempUserDataDir, { recursive: true });
    console.log(`🗂 Using temp user-data-dir: ${tempUserDataDir}`);

    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-logging')
        .addArguments('--log-level=3')
        .addArguments(`--user-data-dir=${tempUserDataDir}`);

    let driver;
    try {
        console.log('1. 🚀 Launching browser...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. 🔑 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. 🏠 Navigating to dashboard...');
        await driver.wait(until.urlContains('home'), 10000);

        console.log('4. 👤 Clicking Profile link...');
        const profileLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Profile']/ancestor::a")),
            10000
        );
        await profileLink.click();

        console.log('5. 🔍 Verifying profile page loaded...');
        await driver.wait(until.urlContains('UserProfile'), 10000);

        console.log('6. ✏️ Clicking update (pencil) icon...');
        const updateButton = await driver.wait(
            until.elementLocated(By.id('Update')),
            10000
        );
        await updateButton.click();

        console.log('7. 📝 Verifying update form loaded...');
        await driver.wait(until.urlContains('Update'), 10000);
        const formHeader = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(@class, 'text-2xl') and contains(., 'Update Customer')]")),
            10000
        );

        assert.ok(await formHeader.isDisplayed(), 'Update form header should be visible');

        console.log('\n✅ TEST PASSED: Profile update page loaded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('   Reason:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log('🧹 Closing browser...');
            await driver.quit();
        }

        try {
            fs.rmSync(tempUserDataDir, { recursive: true, force: true });
            console.log(`🧹 Deleted temp user-data-dir: ${tempUserDataDir}`);
        } catch (cleanupErr) {
            console.warn(`⚠️ Failed to clean user data dir: ${cleanupErr.message}`);
        }
    }
}

console.log('\n🧪 Starting profile update test...\n');
testProfileUpdate();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testProfileUpdate() {
    const config = {
        baseUrl: 'http://localhost:3000',
        loginPath: '/Site/Login',
        validCredentials: {
            email: 'Alishah1234584.as@gmail.com',
            password: '12345'
        }
    };

    const tempUserDataDir = path.join(os.tmpdir(), `selenium-profile-${Date.now()}`);
    fs.mkdirSync(tempUserDataDir, { recursive: true });
    console.log(`🗂 Using temp user-data-dir: ${tempUserDataDir}`);

    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-logging')
        .addArguments('--log-level=3')
        .addArguments(`--user-data-dir=${tempUserDataDir}`);

    let driver;
    try {
        console.log('1. 🚀 Launching browser...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. 🔑 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. 🏠 Navigating to dashboard...');
        await driver.wait(until.urlContains('home'), 10000);

        console.log('4. 👤 Clicking Profile link...');
        const profileLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Profile']/ancestor::a")),
            10000
        );
        await profileLink.click();

        console.log('5. 🔍 Verifying profile page loaded...');
        await driver.wait(until.urlContains('UserProfile'), 10000);

        console.log('6. ✏️ Clicking update (pencil) icon...');
        const updateButton = await driver.wait(
            until.elementLocated(By.id('Update')),
            10000
        );
        await updateButton.click();

        console.log('7. 📝 Verifying update form loaded...');
        await driver.wait(until.urlContains('Update'), 10000);
        const formHeader = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(@class, 'text-2xl') and contains(., 'Update Customer')]")),
            10000
        );

        assert.ok(await formHeader.isDisplayed(), 'Update form header should be visible');

        console.log('\n✅ TEST PASSED: Profile update page loaded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('   Reason:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log('🧹 Closing browser...');
            await driver.quit();
        }

        try {
            fs.rmSync(tempUserDataDir, { recursive: true, force: true });
            console.log(`🧹 Deleted temp user-data-dir: ${tempUserDataDir}`);
        } catch (cleanupErr) {
            console.warn(`⚠️ Failed to clean user data dir: ${cleanupErr.message}`);
        }
    }
}

console.log('\n🧪 Starting profile update test...\n');
testProfileUpdate();
