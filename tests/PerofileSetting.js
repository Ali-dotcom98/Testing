const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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
        console.log('1. Launching browser...');
        const options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

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


        console.log('4. Locating Profile link...');
        const profileLink = await driver.wait(
            until.elementLocated(By.xpath(`
                //a[contains(@href, '/home/UserProfile')]
                //div[contains(@class, 'flex flex-row')]
                //p[text()='Profile']
            `)),
            5000
        );

        console.log('5. Clicking Profile link...');
        await profileLink.click();


        console.log('6. Verifying profile page...');
        await driver.wait(until.urlContains('UserProfile'), 5000);
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('UserProfile')) {
            console.log('✔ Successfully navigated to profile page');


        } else {
            console.log('✖ Failed to navigate to profile page');
            console.log(`Current URL: ${currentUrl}`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);


        if (driver) {
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('profile-test-failure.png', screenshot, 'base64');
            console.log('Screenshot saved as profile-test-failure.png');
        }
    } finally {
        if (driver) {
            console.log('7. Closing browser...');
            await driver.quit();
        }
    }
}

// Run the test
testProfileNavigation();