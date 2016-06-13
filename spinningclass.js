// Create casper object
var casper = require('casper').create({
    pageSettings: {
        loadImages: true,
        loadPlugins: false
    },
    logLevel: "debug",
    verbose: true
});

// Set browser user agent
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36');

// Print out all the messages in the headless browser context
casper.on('remote.message', function(msg){
    this.echo('remote message cought: ' + msg);
});

// Print out all the sessages in the headless browser context
casper.on('page.error', function(msg, trace){
    this.echo("Page Error: " + msg, "ERROR");
});

// Open the login page of a certain website. I have to be cagey about the name, but you'll recognize it at a glance...
casper.start("https://i.tipness.co.jp/pc/auth/login", function(){
	// and loggin in.
  this.fill('form[action="https://i.tipness.co.jp/pc/auth/login"]',{
    login_id: "YOUR ID",
    login_pass: "YOUR PASSWORD"
  }, true);
});

// Then, click the text link to the page to look for the classes.
casper.then(function(){
  this.click('a[href="/pc/program"]');
});

// Click the button to search.
casper.then(function(){
  this.click('div.boxButton input');
  this.wait(1000);
});

// Click the button to the page for the results of searching.  
// Originally you choose some search criteria or filter conditions, but this time, leave them as default and search classes.
casper.then(function(){
  this.click('input[onClick="return preSubmit();"]');
  this.wait(1000);
});

// Check the name of class(es) listed on the table of search result(s) by extracting them as a text.
casper.then(function(){
  var classname = this.evaluate(function(){
    return __utils__.getElementByXPath('//table[@id="table"]/tbody/tr[2]/td[4]').innerHTML;
  });  
  this.echo(classname);
});

// Click the HTML link to book.
casper.then(function(){
  this.click('a[href^="/pc/program/rsv"]');
});

// Make sure the class name that you are booking by extrating it as a text. 
casper.then(function(){
  var validateclassname = this.evaluate(function(){
    return __utils__.getElementByXPath('//table[@class="search"]/tbody/tr[3]/td').innerHTML;
  });
  this.echo(validateclassname);
});

// Check the checkbox to send email to notify what the class you book is and fill password in the blank to confirm booking.
casper.then(function(){
  this.fillSelectors('form', {
    'input[name="email"]': true,
    'input[name="password"]': 'YOUR PASSWORD'
  }, true);
});

// In case of sellout.
//casper.then(function(){
//  this.echo('you are here now...expecting /program/rsv-update: ' + this.getCurrentUrl());
//});

//casper.then(function(){
//  var sellout = this.evaluate(function(){
//    return __utils__.getElementByXPath('//div[@class="important information"]').innerHTML;
//  });
//  this.echo(sellout);
//});

casper.run();
