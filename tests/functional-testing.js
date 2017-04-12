/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var chai = require('chai');
var expect = require('chai').expect;

// testing the sign in procedure
var driver = new webdriver.Builder().forBrowser('firefox').build();
driver.get('http://geogate.sp7.irea.cnr.it/client/');
driver.wait(until.elementLocated(By.id('user-press-login')), 5000);
driver.sleep(250);
driver.findElement(By.css("#user-login > svg > image")).getAttribute("xlink:href").then(function(value) {
	expect(value).not.to.be.empty;
	console.log("tested if the user login image was obtained successfully from the triple store");
});
driver.findElement(By.id('user-press-login')).click();
driver.sleep(250);
//driver.switchTo().activeElement();
driver.wait(until.elementLocated(By.css('button#connect-orcid-button')), 5000);
driver.findElement(By.className('ui-dialog-title')).getText().then(function(text) {
	expect(text).to.equal('ORCID login');
	console.log("tested if the ORCID dialog title is correct");
});
driver.findElement(By.css('button#connect-orcid-button')).click();
driver.sleep(250);
driver.wait(until.elementLocated(By.id('login-authorize-button')), 5000);
driver.getTitle().then(function(title) {
	expect(title).to.match(/^ORCID$/);
	console.log("tested if the login page title is correct");
});
driver.findElement(By.css('input[name=userId]')).sendKeys(process.env.ORCIDUSER);
driver.findElement(By.css('input[name=password]')).sendKeys(process.env.ORCIDPASS);
driver.findElement(By.id('login-authorize-button')).click();
driver.sleep(2000);
driver.wait(until.titleIs('Ritmare'), 5000);
driver.getCurrentUrl().then(function(url) {
	expect(url).to.match(/client\/\?code=/);
	console.log("tested if the session code was added to the url");
});
driver.findElement(By.id("menulist")).getAttribute("style").then(function(value) {
	expect(value).to.match(/visible/);
	console.log("tested if the buttons in the sliding sidebar panel are visible");
});
driver.quit();

// adding, dragging, removing widgets - test 1
var driver = new webdriver.Builder().forBrowser('firefox').build();
driver.get('http://geogate.sp7.irea.cnr.it/client/');
driver.wait(until.elementLocated(By.className('close-f1')), 5000);
driver.wait(until.elementLocated(By.className('imgopen')), 5000);
driver.sleep(250);
driver.findElement(By.id("draggable1")).getAttribute("style").then(function(value) {
	expect(value).to.match(/visible/);
	console.log("tested if the widget 1 is visible after the page loading");
});
driver.findElement(By.id("draggable2")).getAttribute("style").then(function(value) {
	expect(value).to.match(/visible/);
	console.log("tested if the widget 2 is visible after the page loading");
});
driver.findElement(By.id("draggable3")).getAttribute("style").then(function(value) {
	expect(value).to.match(/visible/);
	console.log("tested if the widget 3 is visible after the page loading");
});
driver.findElement(By.id("draggable4")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 4 is not visible after the page loading");
});
driver.findElement(By.id("draggable5")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 5 is not visible after the page loading");
});
driver.actions().click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('imgopen'))).perform();
driver.sleep(250);
driver.actions().click(driver.findElement(By.css('span#Discovery'))).click(driver.findElement(By.css('span#Metadata'))).click(driver.findElement(By.css('span#Feeds'))).click(driver.findElement(By.css('span#Map'))).click(driver.findElement(By.className('imgclose'))).perform();
driver.sleep(250);
driver.executeScript("arguments[0].setAttribute('style', 'display:block')", driver.findElement(By.css("#draggable2 div.content div.widget-overlay")));
driver.findElement(By.css('#draggable2 span')).click();
driver.sleep(250);
driver.executeScript("arguments[0].setAttribute('style', 'display:block')", driver.findElement(By.css("#draggable3 div.content div.widget-overlay")));
driver.findElement(By.css('#draggable3 span')).click();
driver.findElement(By.css(".widget-attivi a:nth-child(2) span:nth-child(1)")).getAttribute("class").then(function(value) {
	expect(value).to.match(/fa-file-text/);
	console.log("tested if the icon 1 in the sidebar panel is the Metadata icon");
});
driver.findElement(By.css(".widget-attivi a:nth-child(3) span:nth-child(1)")).getAttribute("class").then(function(value) {
	expect(value).to.match(/fa-map/);
	console.log("tested if the icon 2 in the sidebar panel is the Map icon");
});
driver.findElement(By.css(".widget-attivi a:nth-child(4) span:nth-child(1)")).getAttribute("class").then(function(value) {
	expect(value).to.match(/fa-rss-square/);
	console.log("tested if the icon 3 in the sidebar panel is the Feeds icon");
});
driver.findElement(By.css(".widget-attivi a:nth-child(5) span:nth-child(1)")).getAttribute("class").then(function(value) {
	expect(value).to.match(/fa-search/);
	console.log("tested if the icon 4 in the sidebar panel is the Discovery icon");
});
driver.executeScript("arguments[0].click();", driver.findElement(By.className('imgopen')));
driver.sleep(250);
driver.findElement(By.css('span#Discovery')).click();
driver.findElement(By.xpath("//span[@id='Discovery']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.equal('2x');
	console.log("tested if the number of Discovery widgets in the sliding sidebar panel is 2");
});
driver.findElement(By.xpath("//span[@id='Map']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.equal('1x');
	console.log("tested if the number of Map widgets in the sliding sidebar panel is 1");
});
driver.findElement(By.xpath("//span[@id='My data']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.be.null;
	console.log("tested if the number of My Data widgets in the sliding sidebar panel is 0");
});
driver.findElement(By.xpath("//span[@id='Feeds']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.equal('1x');
	console.log("tested if the number of Feeds widgets in the sliding sidebar panel is 1");
});
driver.findElement(By.xpath("//span[@id='Metadata']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.equal('1x');
	console.log("tested if the number of Metadata widgets in the sliding sidebar panel is 1");
});
driver.findElement(By.xpath("//span[@id='About']/preceding-sibling::span[@class='badge2']")).getAttribute("data-badge2").then(function(value) {
	expect(value).to.be.null;
	console.log("tested if the number of About widgets in the sliding sidebar panel is 0");
});
driver.actions().click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('close-f1'))).click(driver.findElement(By.className('close-f1'))).perform();
driver.findElement(By.id("draggable1")).getAttribute("style").then(function(value) {
	expect(value).to.match(/visible/);
	console.log("tested if the widget 1 is visible after some operations");
});
driver.findElement(By.id("draggable2")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 2 is not visible after some operations");
});
driver.findElement(By.id("draggable3")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 3 is not visible after some operations");
});
driver.findElement(By.id("draggable4")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 4 is not visible after some operations");
});
driver.findElement(By.id("draggable5")).getAttribute("style").then(function(value) {
	expect(value).to.match(/hidden/);
	console.log("tested if the widget 5 is not visible after some operations");
});
driver.findElement(By.id("draggable1")).getAttribute("name").then(function(value) {
	expect(value).to.equal('Discovery');
	console.log("tested if the widget 1 is the Discovery widget");
});
driver.findElement(By.css(".widget-attivi a:nth-child(2) span:nth-child(1)")).getAttribute("class").then(function(value) {
	expect(value).to.match(/fa-search/);
	console.log("tested if the icon in the sidebar panel is the Discovery icon");
});
driver.quit();