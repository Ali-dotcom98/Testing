const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testLeaderboardNavigation() {
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
        console.log('1. Launching browser...');
        const options = new chrome.Options()
            .addArguments('--headless=new')
            .addArguments('--no-sandbox')
            .addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. Waiting for dashboard to load...');
        await driver.wait(until.urlContains('home'), 10000);

        console.log('4. Locating Leaderboard link...');
        const leaderboardLink = await driver.wait(
            until.elementLocated(By.xpath(`
                //a[contains(@href, '/Leaderboard')]
                //div[contains(@class, 'flex flex-row')]
                //p[contains(@class, 'capitalize') and text()='Leaderboard']
            `)),
            5000
        );

        console.log('5. Clicking Leaderboard link...');
        await leaderboardLink.click();

        console.log('6. Verifying leaderboard page...');
        await driver.wait(until.urlContains('Leaderboard'), 5000);
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('Leaderboard')) {
            console.log('✔ Successfully navigated to leaderboard page');

            try {
                const leaderboardHeader = await driver.wait(
                    until.elementLocated(By.xpath("//h1[contains(text(), 'Leaderboard')]")),
                    3000
                );
                console.log(`✔ Leaderboard header: ${await leaderboardHeader.getText()}`);
                process.exit(0);
            } catch {
                console.log('ℹ No specific leaderboard header found, but URL is correct');
                process.exit(0);
            }
        } else {
            console.log('✖ Failed to navigate to leaderboard page');
            console.log(`Current URL: ${currentUrl}`);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        if (driver) {
            console.log('7. Closing browser...');
            await driver.quit();
        }
    }
}

// Run the test
testLeaderboardNavigation();
