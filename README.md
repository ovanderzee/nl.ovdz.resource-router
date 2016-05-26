# nl.ovdz.resource-router

Resource-Router is a chrome-browser extension to route files to website in production.
Resource-Router also provides tools to serve and lint the routed files in a local editing environment.


## Install

### Use the local extension in Google Chrome
    
* Surf to chrome://extensions/
* Checkbox "Developer mode" has to checked
* Click button "Load unpacked extension..." 
* In the dialog, browse to the extension root directory (the directory "source")
* The plugin icon will appear right of the address field

### Build local editing environment

Download the repository to for instance your homedirectory:

    cd ~/nl.ovdz.resource-router 

Install the dependencies:  

    npm install

To setup the local https environment:  

    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

Add to trusted sites (Mac OSX)

    open cert.pem

### Run local server for editing resources

Run the default gulp task

    cd ~/nl.ovdz.resource-router && gulp


## toDo, toWant

### csslint chockes or is chocked

    events.js:141
          throw er; // Unhandled 'error' event
          ^
    Error: CSSLint failed for cromhouthuis/css/main.css

### build the sources

    in the task runner, with a zip command


### livereload

    the extension should reload a routed site 

