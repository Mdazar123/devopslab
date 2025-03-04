const webdriver = require('selenium-webdriver');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments('--start-maximized');

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

async function clickButton(text) {
    const button = await driver.findElement(By.xpath(`//button[text()='${text}']`));
    await button.click();
    await driver.sleep(500);  // Small delay after clicking
}

async function getDisplayValue() {
    const display = await driver.findElement(By.id('display'));
    return await display.getText();
}

async function waitForTextToUpdate(expectedText) {
    const display = await driver.findElement(By.id('display'));
    await driver.wait(until.elementTextIs(display, expectedText), 7000);
}

async function runTest() {
    try {
        await driver.get('file://' + __dirname + '/index.html');

        // Test addition
        await clickButton('5');
        await clickButton('+');
        await clickButton('3');
        await clickButton('=');
        
        await waitForTextToUpdate('8');
        assert.strictEqual(await getDisplayValue(), '8', 'Addition failed');
        console.log('Addition test passed');

        // Test multiplication
        await clickButton('C');
        await clickButton('6');
        await clickButton('*');
        await clickButton('7');
        await clickButton('=');
        
        await waitForTextToUpdate('42');
        assert.strictEqual(await getDisplayValue(), '42', 'Multiplication failed');
        console.log('Multiplication test passed');

        // Test division
        await clickButton('C');
        await clickButton('1');
        await clickButton('5');
        await clickButton('/');
        await clickButton('3');
        await clickButton('=');
        
        await waitForTextToUpdate('5');
        assert.strictEqual(await getDisplayValue(), '5', 'Division failed');
        console.log('Division test passed');

        // Test subtraction
        await clickButton('C');
        await clickButton('1');
        await clickButton('0');
        await clickButton('-');
        await clickButton('7');
        await clickButton('=');
        
        await waitForTextToUpdate('3');
        assert.strictEqual(await getDisplayValue(), '3', 'Subtraction failed');
        console.log('Subtraction test passed');

        console.log('All tests passed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await driver.quit();
    }
}

runTest();
