import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;
    constructor(private store: Store) {
    }

    ngOnInit() {

        // const courses$ = this.store.courses$;

        this.beginnerCourses$ = this.store.selectBeginnerCourses();
        this.advancedCourses$ = this.store.selectAdvancedCourses();
        // const http$ = createHttpObservable('/api/courses');
        const http$ = createHttpObservable('/api/courses');

      const courses$: Observable<any> = http$
        .pipe(
          catchError(err => {
            // we are handling the error locally
            console.log("Error occurred", err);
            // check console in F12
            return throwError(err);
          }),
          // if we want only one HTTP request
          // finalize(() => {
          //   console.log('Finalize Executed ...');
          // }),
          tap(() => console.log("http request executed")),
          map(res => Object.values(res["payload"])),
          shareReplay(),
          retryWhen(errors => errors.pipe(
            delayWhen(() => timer(3000))
          ) )
      );

      this.beginnerCourses$ = courses$
        .pipe(
          map(courses => courses
            .filter(course => course.category === 'BEGINNER')
          )
      );

      this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === 'ADVANCED')
        )
      );
    }

}

/**
 * We are going to cover retry.
 * So let's remove here the previous air strategy that we have just cover,
 * which was to refer to the Aher. Now, what we want to do here is
 * whenever we attempt a weekend request, that request might sometimes
 * fail due to, let's say, excessive load on the server.
 * But sometimes it might succeed if we retry after, let's say,
 * a couple of seconds. So let's simulate the situation first by
 * heading over here to the GED courses route. And we are going to
 * change a little bit here.
 * Our logic, instead of failing the request each time,
 * what we're going to do is we are going to end
 * this code that we have here and we are going to modify our logic so
 * that we are going to sometimes feel an error, which is true if the
 * error flag is set to true or sometimes we are going to return the
 * correct result. As we can see, there will be a 50 percent chance that
 * this flag is either true or false.So sometimes the request is
 * going to go through and sometimes it's going to fail.
 * Let's apply here this new logic in our terminal.
 * We are going to stop here, our APA server, and we're going to
 * restart it once we have the server up and running again.
 * We can't switch over here to the home component and start
 * implementing the retries strategy.
 * What we are going to do here is we are going to retry
 * the request two seconds after the failure.
 * So if the request fails once, we're going to wait for two seconds,
 * try again.
 * If it fails again, we are going to then wait two more seconds
 * and try again, etc. We can implement
 * these retrain logic by using the arrogates retry when operator,
 * this operator receives here as the first argument and errors observable.
 * So this is an observable that is going to emit an error each time that the stream that we are trying
 * froze and therefore whenever the HTP stream frozen there, the stream will finish.
 * So it will not complete successfully.
 * It will error out what retry when it's going to do is to create a brand new stream,
 * a brand new HTP stream, and it's going to subscribe to that new stream and it will do that
 * successfully until the stream does not occur out.
 * So this is the errors observable that emits Vali's each time that one of these streams, the targeting
 * retrade errors out and these function here needs to return unobservable.
 * So retry when expects D to be here unobservable.
 * These observable is going to fail to retry when when to retry so we can do an immediate retry whenever
 * we get the failure.
 * So if that's the case, we can simply return here to retry when the errors observable itself.
 * So the result here would be whenever there is an error, immediately try again.
 * However, in practice we usually don't want to retry immediately after a failure because many of these
 * HTP requests failures are due to intermittent problems.
 * So we want to wait, let's say, for example, two seconds before trying to perform the EDP request
 * again.
 * So in order to implement that, we just need to modify here the observable that we are returning to
 * retry when so we are going to apply here pipe and we are going to use the delay when operator to say
 * that we want to delay the values emitted by these observable by, let's say, two seconds and we can
 * do that using the timer function.
 * So we are going to say that whenever the errors observable emits a value, we are going to return here
 * and observable that we are going to build using the timer operator that is going to emit a value after
 * two seconds.
 * So this way, each time that there is an error, we are going to wait for two seconds before emitting
 * a value back to retry. When this logic is what we are looking for two seconds after the
 * occurrence of each error, if we would
 */
