import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import {
    concat,
    fromEvent,
    interval,
    noop,
    observable,
    Observable,
    of,
    timer,
    merge,
    Subject,
    BehaviorSubject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    // go to http://localhost:9000/api/courses
    // make sure you install chrome json formatter
    // start an app with npm start

    /*
    Let's now go back to our application and see how we are going to
    fetch this data under the form of an observable that is going to
    emit one value containing this complete payload and then
    it's going to complete.
    Let's first see how we are going to be making this call to
    the backend.

    So if we call fetch and we pass it a URL,
    so we are going to pass the URL, slash API /courses
    and this is going to get us back a promise.
    This promise is going to be evaluated successfully
    if the request succeeds and it's going to fail if
    the request fails due to some fatal error, such as,
    for example, the network is down, notice that
    the promise is very different from unobservable.
    */

    // fetch('/api/courses');

    /**
     * A promise will get immediately executed once we define it.
     * This is unlike the observable that when it gets defined,
     * it does not trigger any request.
     * It will only trigger the request in response to
     * a subscription.
     * So let's see how we're going to turn this call
     * to the backend into another stream.
     * Let's see how we are going to create an observable
     * that represents these HTTP requests.
     * We're going to be creating a custom observable for that.
    */

    // Observable.create();
    /**
     * This method will allow you to create an observable
     * from scratch.
     *
     *
    */

    //  Now we are going to take the output of this call
    //  and we're going to assign it to a variable.
    const http$ = new Observable(observer => {
        fetch('api/courses')
          .then(response => {
            return response.json();
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      });

    // there will be no output until we subscribe to it

    http$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );

<<<<<<< Updated upstream
  /*
    every click that you do in the app that will be a stream
    of values containing the click event
  */

      document.addEventListener('click', evt => {
        console.log(evt)
      })

      /*
        F12
        so what we see here is whnever we click on the mouse is
        an example of a stream of values that are being emitted
        over time
      */

      // emitting a value each second
      // we will define a variable,
      // then we will ini to 0 and
      // we are going to emit a new value over time
      // and increment the counter each time that we emit our value
      let counter = 0;
      setInterval(() => {
        console.log(counter);
        counter++;
      }, 1000);


  /* now we have 2 independent streams of values
  clicks and interval.
  Let's add another type of stream: setTimeout
  */

  // this is async operation
  // this stream emits only one value and then completes it
  // setTimeout emits a value and completes
  // the other 2 emit multiple values and never complete

  setTimeout(() => {
    console.log('finished ... ')
  }, 3000)

  }
}

/*
setInterval continuesly emits the values
click streams only when clicked on
setTimeout finishes exectuting after 3 seconds

click and setInterval are multi value streams
they continuesly emit and they never compelte
*/



/*
Video 6 - what is Rxjs and what problem it solves

1. combine all 3 streams together
2. after a user clicks on the certain part of the screen
3. we might want to wait for 3 seconds and only then emit the interval

*/

/* ----- callback hell ---- */
/*
      document.addEventListener('click', evt => {
        console.log(evt);

        setTimeout(() => {
          console.log('finished ... ');


          let counter = 0;
          setInterval( ()=> {
              console.log(counter);
              counter++;
          }, 1000)
        }, 3000)
      })

      this block of code will not work until you click
      somewhere on the screen

      you will see a duplicate execution
      if you click on the screen multiple times
*/
=======

  }
}
>>>>>>> Stashed changes
