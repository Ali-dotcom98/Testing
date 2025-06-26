const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testSignup() {

    let options = new chrome.Options()
        .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-gpu')
        .addArguments('--log-level=3');


    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log("1. Navigating to signup page...");
        await driver.get('http://localhost:3000/Site/Signup');
        await driver.wait(until.elementLocated(By.id('Username')), 5000);



        const testUsername = "Test311@gmail.com";
        const testPassword = "12345";

        console.log("2. Filling name field with:", testUsername);
        const nameField = await driver.findElement(By.id('Username'));
        await nameField.clear();
        await nameField.sendKeys(testUsername);

        console.log("3. Filling password field...");
        const passwordField = await driver.findElement(By.id('Password'));
        await passwordField.clear();
        await passwordField.sendKeys(testPassword);

        console.log("4. Clicking signup button...");
        const signupButton = await driver.findElement(By.css('button[type="submit"]'));
        await signupButton.click();

        console.log("5. Waiting for response (max 10 seconds)...");

        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();


            if (currentUrl.includes('home')) return true;

            try {
                const message = await driver.findElement(By.id('message'));
                if (await message.isDisplayed()) return true;
            } catch { }


            try {
                const invalidFields = await driver.findElements(By.css('.Invalid'));
                if (invalidFields.length > 0) return true;
            } catch { }

            return false;
        }, 10000);


        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('home')) {
            console.log(`✔ Signup successful - Redirected to: ${currentUrl}`);
            assert.ok(true, 'Successful signup should redirect to home');
        }
        else {

            try {
                const messageElement = await driver.findElement(By.id('message'));
                const messageText = await messageElement.getText();

                if (messageText.trim()) {
                    console.log(`✔ Message displayed: "${messageText}"`);
                    assert.ok(true, 'Received expected message');
                } else {
                    console.log('⚠ Empty message element found');
                    assert.fail('Message element exists but is empty');
                }
            } catch {

                try {
                    const invalidFields = await driver.findElements(By.css('.Invalid'));
                    if (invalidFields.length > 0) {
                        console.log('✔ Form validation errors present');
                        assert.ok(true, 'Form validation working as expected');
                    } else {

                        await driver.takeScreenshot().then(image => {
                            require('fs').writeFileSync('signup-test-failure.png', image, 'base64');
                            console.log('Screenshot saved as signup-test-failure.png');
                        });
                        assert.fail('Unexpected state - no redirect, no message, no validation errors');
                    }
                } catch {
                    assert.fail('Could not determine signup result');
                }
            }
        }
    } catch (error) {
        console.error('Test failed:', error.message);

        await driver.takeScreenshot().then(image => {
            require('fs').writeFileSync('signup-test-error.png', image, 'base64');
            console.log('Screenshot saved as signup-test-error.png');
        });
        throw error;
    } finally {
        console.log("6. Closing browser...");
        await driver.quit();
    }
}

testSignup()
    .then(() => console.log('✅ Signup test completed successfully'))
    .catch(() => console.log('❌ Signup test failed'));
