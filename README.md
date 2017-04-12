# MAM+

The MAM+ userscript, converted to CoffeeScript and published in a more official manner.

## Installation

Simply install with [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox) or [Tampermonkey](https://tampermonkey.net/) (all other browsers). MAM+ only officially supports the most recent versions of Chrome & Firefox, but other modern browsers should theoretically work.

## Modification & Contribution

In case you want to modify the script and/or contribute to it, follow the below instructions. You'll need to be using Firefox for the ideal workflow.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)

### Instructions

- Make sure the prerequisites are installed on your system
- Clone this project to your computer
- Make sure your terminal window is open to this project folder, and run `npm install`
- Create a new file called `user-settings.json`
- Find the path to your Greasemonkey scripts folder, and use it to create a new object in the User Settings, like this:
```json
{ "userDir": "C:/Users/YOUR-USERNAME/AppData/Roaming/Mozilla/Firefox/Profiles/YOUR-CODE.default/gm_scripts" }
```
- Open Firefox and create a new userscript
    - Set the name exactly to `MAM Plus Dev`
    - Set the includes to `https://myanonamouse.net/*` & `https://www.myanonamouse.net/*`
- If you didn't set the local Greasemonkey location, the script will redundantly output to the project directory
- Make sure your terminal window is open to this project folder, and run `gulp`. (A minified file of the release-ready script can be created by running `gulp release`)
