# King's Cross Booking Process
*To build, simply use ```gulp``` without any args. Version used for production: 3.9.1*
*To build, for production (to scrap the code for AEM) use ```gulp production``` without any args. Version used for production: 3.9.1*

## **Brief project breakdown:**

### **JS**
Javascript is split into module exports, which are then imported in ```main.js```

There, at at ~```main:336``` is a switch statement deciding which modules to execute based on which page the user is on.

### **SCSS & HTML**
SCSS is split into components, and HTML pages are split into handlebar templates.

### **Client-side Handlebar**
In the partials handlebars folder, there's a 'templateScripts' folder where we store the handlebar templates which will be populated dynamically by JS. For those, we use square brackets, and in the JavaScript files, we use the following function:
```javascript
handleTemplate("NameOfTemplate", { data })
```
Which generates html code that we can append to the page using ```$("#id").append(html)```

*Note: because of this functionality, please ensure you're using the 2019 Scrapper or above, as any older versions do not support dynamic handlebars*

<details>
<summary>
Bookmarklet for Scrapper 2019:
</summary>
<code>
javascript:void((function(){var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','https://s3-eu-west-1.amazonaws.com/aem-scraper/aem-source-scraper-2019.js?r='+Math.random()*99999999);document.body.appendChild(e)})());
</code>
</details>

## **AEM:**


| Page                                   | Path                                                          |
|----------------------------------------|---------------------------------------------------------------|
| Home Page                              | https://www.samsung.com/uk/explore/kings-cross/               |
| Discover Page                          | https://www.samsung.com/uk/explore/kings-cross/discover       |
| What's On / All Events Page            | https://www.samsung.com/uk/explore/kings-cross/whats-on/      |
| Event Page / (Populated Dynamically)   | https://www.samsung.com/uk/explore/kings-cross/whats-on/event |
| Support Page / Appointment Booking     | https://www.samsung.com/uk/explore/kings-cross/support/       |
| My Bookings / Booking Fetcher          | https://www.samsung.com/uk/explore/kings-cross/bookings/      |
| Experience Page / Post-Visit Downloads | https://www.samsung.com/uk/explore/kings-cross/experience     |


### Assets:
https://aem-eu-shop.samsung.com/assets.html/content/dam/samsung/uk/explore/kings-cross


# Qudini FAQ:


Qudini Structure:



## **Qudini API Documentation:**
https://bookings.qudini.com/docs2/index.html#!/

### Control Panel: https://app.qudini.com/

## **Series:**


### **Event Series**:

### QAWeb and Local events:
[TEST] KX Test Events 
https://bookings.qudini.com/booking-widget/events/W3DMW9HUAYM

Series ID: *W3DMW9HUAYM*

### **Live events**: 
[LIVE] KX EVENTS
https://bookings.qudini.com/booking-widget/events/U3OWDF3I0JF

Series ID: *U3OWDF3I0JF*

--------------------

When events are created, they start of in [TEST] series, and if they show up on QAWeb and function as intended, then they are copied into the [LIVE] event series.

--------------------

### Contact at Qudini:
**Ben Abbitt** (Customer Success Manager)
ben@qudini.com


### Login:
cheil-dev
Cheil321

# ***NB***
Common Bug:
Sometimes when you use the scrapper tool, the JS scrapped might come out looking like this:
![Alt text](./readme/common-bug.png?raw=true "Bug Demo: the first non-comment line var kxConfig=... is inline when it shouldn't be")

The error originates in [the script handlebar file](../src/templates/partials/scripts.hbs).
If you open the file, save it again, and run gulp, it should fix itself, but if not, you can manually edit the scrapped version, and make it look like:

![Alt text](./readme/bug-correction.png?raw=true "Inline separated into multi-lines")
<details>
  <summary>Fixed Code</summary>
   
    var kxConfig = {};

	kxConfig.seriesId = "W3DMW9HUAYM";

	kxConfig.LIVE___seriesId = "U3OWDF3I0JF";

	if (window.location.hostname == 'www.samsung.com' ||
	    window.location.hostname == 'kings-cross-live.samsung.com') {
	    kxConfig.seriesId = kxConfig.LIVE___seriesId;
	}

	kxConfig.passions = [];

	kxConfig.passions.push({"code":"artdesign","name":"Art & Design","color":"#FF4337"});

	kxConfig.passions.push({"code":"entertainment","name":"Entertainment","color":"#F37321"});

	kxConfig.passions.push({"code":"fashionbeauty","name":"Fashion & Beauty","color":"#FFDA00"});

	kxConfig.passions.push({"code":"fitnesswellbeing","name":"Fitness & Wellbeing","color":"#003DFF"});

	kxConfig.passions.push({"code":"fooddrink","name":"Food & Drink","color":"#00B3E2"});

	kxConfig.passions.push({"code":"gaming","name":"Gaming","color":"#E24C9B"});

	kxConfig.passions.push({"code":"photography","name":"Photography","color":"#97D653"});

	kxConfig.passions.push({"code":"sciencetechnology","name":"Science & Tech","color":"#724C9E"});

	kxConfig.suitables = [];

	kxConfig.suitables.push({"code":"childfriendly","name":"Child Friendly"});

	kxConfig.suitables.push({"code":"community","name":"Community"});

	kxConfig.suitables.push({"code":"productclass","name":"Product Class"});

	kxConfig.suitables.push({"code":"talklecture","name":"Talk / Lecture"});

</details>

Notes:

- Events can be cancelled using API calls, appointments can't as of September 2019
- Qudini isn't very flexible, so when creating events, we attach a json format text at the end of the description of the event (i.e. [desc] || {...}), which we then process when passing data to the event handlebar template
- To imitate live events load on local, set your vhost path as kings-cross-live.samsung.com