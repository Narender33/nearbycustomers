# nearbycustomers
To locate the nearby locations from bunch of locations using the longitude - latitude and using the distance between them. 

>## Installation
___
```bash
npm install nearbycustomers
```
There  are no additional dependencies required to use this package.

>## Features
* Faster Response.
* provide the result in array format.
* can use customized distance as per requirement.

>## Prerequisites
* Reference to a file of collection of geolocation.
* File should contain individual data record on seperate line.
* Every individual data record should be formatted in JSON.
* Every individual data record should contain keys and values :
    * latitude : Number
    * longitude : Number
    * user_id : Number
    * name : String
* The response will be array of all the nearby locations sorted by **user_id** in the format of :
    * user_id
    * name

>## Quick Start
Install the executable.
```bash
npm install nearbycustomers
```

Require the package

```javascript
const nearbygeo = require('nearbycustomers');
```

Use 'new' keyword to call the class. It accepts two parameters: 
* path to file (String) : required
* distance in km (Number): optional
```javascript
const geo = new nearbygeo('path-to-file');
```

Call the function findCustomers() on reference. findCustomers() Function returns a promise, use **.then()** and **.catch()** to handle the response.

```javascript
    geo.findCustomers()
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

