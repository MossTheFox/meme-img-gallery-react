SB Image (Meme Image Gallery)
----

A Web app built to browse random meme images. Personal practice project. For fun.

Live demo: [SB-Image (app.mxowl.com)](https://app.mxowl.com/service/sb-img/)


### Intro

This is a simple React single-page web app, functioned as an endless meme picture gallery. For personal practice only. Created with [create-react-app](https://create-react-app.dev/).

It may contain some bad practices. Be skeptical when browsing the code.

This repostry is the front-end part of the app. Since this app was built to function together with app.mxowl.com, there is a user system with it, as well as some code from that app, making it a bit messy.

### Fetures

This whole app was finished in like two days, with some additional fetures added later. Again, be skeptical when browsing the code.

By now, this app can do the following:

* PWA capable with static file cached.
    * Static file cache is provided with the service worker built with [Workbox](https://developer.chrome.com/docs/workbox/), which is not included in this repo since the app site (app.mxowl.com) holds one single service worker for multiple apps.

* Seamless sliding through endless pictures.
    * You know how TikTok blew up the world with these kind of video things. This is a poor replica of image-browsing version.

* One-cilck image download.

* Light & Dark theme.
    * Manually or go with system preference

* Loading indicator and error handler.
    * Basically it means you won't need to refresh the page when any network error occurred.

* Customizable User Interface.
    * Hide all useless icons and have a clean view for meme pictures!

* Automatically save the progress.
    * You'll continue from where you were when exit the app.

* Add picture to your collection.
    * Need to be achieved with an account system.

### Known Issues

* No i18n support.
    * All text are hard-coded inside the code, which is bad.

* Non-standard user system implementation.
    * The user system follows the app.mxowl.com site, which was built quite **long** ago when I bearly had any experience on designing APIs. This leads to some really bad practices on how these APIs end up to work.
    * For example: to get the not logged in status, front-end check the Error message to specify this state, which is bad.

* Loading indicator flashes when sliding through 1 in 10 images in a row on non-Safari browsers.
    * This is due to how the seamless browsing is implemented.

* Context structure is messy.
    * ...since it needs to work with the main app site. Also, many of the context was designed way too long ago where I haven't even finished any simple projects.

### Liscence

MIT

### Awesome Frameworks

React UI Framework: [MUI v5](https://mui.com/)

Swiper: [swiperjs.com](https://swiperjs.com/)