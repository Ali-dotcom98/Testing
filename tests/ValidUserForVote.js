const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testVoteErrorMessage() {
    const options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--log-level=3')
        .addArguments('--disable-logging');

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
        console.log('1. 🚀 Launching Chrome browser...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        console.log('   ✔ Browser launched');

        console.log('2. 🔑 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        console.log('   ✔ Login successful');

        console.log('3. 🗳️ Navigating to Validate User page...');
        const voteLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Register']/ancestor::a")),
            5000
        );
        await voteLink.click();
        console.log('   ✔ Reached Validate User page');

        console.log('4. 🔍 Checking for Validate User error...');
        const errorDiv = await driver.wait(
            until.elementLocated(By.css('div.text-red-700#message')),
            3000
        );
        const errorText = await errorDiv.getText();
        console.log(`   ✖ Voting error: "${errorText}"`);

        if (/already (voted|have voted|registered)/i.test(errorText)) {
            console.log('5. ⚠️  Valid voting-related error detected');
            console.log('\n🏁 TEST SUCCESS: Correctly identified voting restriction');
        } else {
            console.log('❌ Unexpected error message. Failing test...');
            process.exit(1);
        }


    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log('   ✔ Closing browser...');
            await driver.quit().catch(() => { });
        }
    }
}

console.log('Starting voting test...\n');
testVoteErrorMessage()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));  
