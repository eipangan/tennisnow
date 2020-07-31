# Change Log

## 2020.06

* Now using server-side state management using AWS Amplify DataStore
* Added event type to event settings form

## 2020.06

### Highlights

* Added AWS Amplify DataStore to handle events, match, and player data
* Data has been moved from local to the cloud, and can be accesssed from any device
* Events now start with empty matches, with users adding new matches on demand
* Matches list now show names instead of just numbers

## 2020.05

### Highlights

* Added Authentication to allow users to signin
* Added Homepage, as an introduction to potential new users
* Added separate tabs for upcoming events and for finished events
* Fixed issue preventing users from scrolling down list of events
* Cleaned up theme to use gradient backgrounds

### Other Changes

* Switched from css to jss (css-in-js)
* Switched fro momentjs to days to improve download speed
* Added indicator to show start and end of list of matches
* Lazy load Event and EventSettings panels to speed up initial loading of web app

## 2020.04

### Highlights

* Support for multiple events
* Homepage now shows list of events, sorted by time

### Other Changes

* Ability to update event settings from both the homepage, or from an event
* Ability to delete an event from both the hopepage, or from an event
* Enabled Progressive Web App (PWA) technologies for non mobile iOS devices

## 2020.03

* Initial release