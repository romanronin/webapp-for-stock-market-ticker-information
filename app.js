var express = require("express");
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
var axios = require("axios");
const puppeteer=require("puppeteer");
const { loadavg } = require("os");
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var data = fs.readFileSync("sl.txt", "utf-8");
var words = data.replace(/\r\n/g, " ");
words = words.split(" ");
var exchange = "NSE";
words.splice(0, 1);
var tickers = words;
console.log(tickers.length);
var info1 = [];
var info2 = [];
var display = {};
var count = 1;
var f = 0;
function scraper(t){
    return new Promise(async function(resolve,reject){
        try{
            const browser=await puppeteer.launch({
                headless:true,
                args: [
                
                '--no-sandbox',
                '--disable-setuid-sandbox',
                

              ]});
            const page=await browser.newPage();
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
              });
            await page.setUserAgent("Mozilla/5.0 (Linux; Ubuntu 15.04) AppleWebKit/537.36 Chromium/50.0.2661.102 Safari/537.36");
            // await page.setUserAgent('Mozilla/5.0 (X11; HasCodingOs 1.0; Linux x64) AppleWebKit/637.36 (KHTML, like Gecko) Chromium/70.0.3112.101 Safari/637.36 HasBrowser/5.0');
            await page.setViewport({height:800,width:1280});
            await page.goto("https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol="+t);
            await page.waitForSelector("#lastPrice");
            await page.waitForFunction(function(){
                return document.getElementById("lastPrice").textContent!="";
            });
            console.log("pass");
            var lp=await page.evaluate(function(){ 
                return document.getElementById("lastPrice").textContent;
            });
            await page.waitForSelector("#change");
            await page.waitForFunction(function(){
                return document.getElementById("change").textContent!="";
            });
            var change=await page.evaluate(function(){
                return document.getElementById("change").textContent;
            });
            await page.waitForSelector("#pChange");
            await page.waitForFunction(function(){
                return document.getElementById("pChange").textContent!="";
            });
            var pChange=await page.evaluate(function(){
                return document.getElementById("pChange").textContent;
            });
            await page.waitForSelector("#tradedVolume");
            await page.waitForFunction(function(){
                return document.getElementById("tradedVolume").textContent!="";
            });
            var volume=await page.evaluate(function(){
                return document.getElementById("tradedVolume").textContent;
            });
            
            var data={lp,change,pChange,volume};
            resolve(data);
            browser.close();
        }
    catch(error){
        console.log(error);
    }

    }
    


);
}

app.get("/", function (req, res) {
    res.render("hnew");
});
app.get("/show", function (req, res) {
    res.render("home",{display:display,ex:exchange});
});
app.get("/fetchr", function (req, res) {
    var t = (req.query.ticker).toUpperCase();
    scraper(t).then(val=>{
        display.lp=val.lp;
        display.change=val.change;
        display.pChange=val.pChange;
        display.volume=val.volume;
        console.log(display);
        res.redirect("/show");
    });
    axios.get("http://www.stockmarketsoft.com:58080/api/RSL/nse/" + t)
        .then(function (response) {
            response.data.Ticker = t;
            display.type="rs";
            display.Ticker = response.data.Ticker;
            display.PivotPoint = response.data.PivotPoint;
            display.Res1 = response.data.Res1;
            display.Res2 = response.data.Res2;
            display.Sup1 = response.data.Sup1;
            display.Sup2 = response.data.Sup2;
            display.exist=1;
           
        })
        .catch(function (error) {
            console.log(error);
            // display.exist=0;
            display.type="rs";
            res.redirect("/show");
        });
        
        
            
});
app.get("/fetchs", function (req, res) {
    var t = (req.query.ticker).toUpperCase();
    axios.get("http://www.stockmarketsoft.com:58080/api/scripstats/nse/" + t)
        .then(function (response) {
            
            var dh = response.data.Date52High;
            var dayh = dh % 100;
            dh = (dh - dayh) / 100;
            var monthh = dh % 100;
            dh = (dh - monthh) / 100;
            var yearh = dh;
            display.dateh = dayh.toString() + "-" + monthh.toString() + "-" + yearh.toString();
            var d = response.data.Date52Low;
            var day = d % 100;
            d = (d - day) / 100;
            var month = d % 100;
            d = (d - month) / 100;
            var year = d;
            display.date = day.toString() + "-" + month.toString() + "-" + year.toString();
            display.type = "scrip";
            display.High52Week = response.data.High52Week;
            display.Low52Week = response.data.Low52Week;
            display.AverageVol1Week = response.data.AverageVol1Week;
            display.AverageVol1Month = response.data.AverageVol1Month;
            display.Ticker = response.data.Ticker;
            display.Return1Year = response.data.Return1Year;
            display.ReturnYtd = response.data.ReturnYtd;
            display.exist=1;
            if(response.data.Date52Low==0){
                display.type="none";
                display.exist=0;
            }
            res.redirect("/show");
        })
        .catch(function(error){
            console.log(error);
            // display.exist=0;
            display.type="scrip";//change
            res.redirect("/show")
        });
});

//ok


app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});