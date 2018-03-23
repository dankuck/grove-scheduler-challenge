# grove-scheduler-challenge
A solution to the <a href="https://github.com/groveco/grove-scheduler-challenge
">Grove Scheduler Challenge</a> from Grove Collaborative.

# Running the Scheduler

You can run the scheduler by visiting <a href="https://dankuck.github.io/grove-scheduler-challenge/">https://dankuck.github.io/grove-scheduler-challenge/</a>.

# Installation

If you'd like to install this yourself instead of using the live version above, you can follow these steps:

* Checkout this repository
* `npm install`
* `gulp`
* Navigate a browser to the `index.html` file.

Depending on your browser, desktop notifications may not work when this is run locally.

# Notes

I used the `cron-parser` library available on npm. I felt it was well within the spirit of the challenge to use third-party libraries for tasks like parsing.

This application uses a copied version of the data at <a href="https://scheduler-challenge.herokuapp.com/schedule">this endpoint</a>. To use the endpoint, the application would need to reside on the herokuapp.com domain or else the endpoint would need to use CORS to allow connections from the app's domain.

This application was created in Vue.js utilizing Bootstrap 3 for style.

The interesting code is in the `src` directory.
