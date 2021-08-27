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


  }
}


