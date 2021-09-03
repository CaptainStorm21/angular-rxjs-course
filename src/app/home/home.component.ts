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
          finalize(() => {
            console.log('Finalize Executed ...');
          }),
          tap(() => console.log("http request executed")),
          map(res => Object.values(res["payload"])),
          shareReplay(),

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
 * We are going to head over to the home component and we're going to see that
 * this time around, catch error was only invoked once and finalized was
 * only executed once as expected. This means that even though these
 * observable has two separate subscriptions, one made here by the Wegener's
 * tab and the other made here by the advanced tab, even though there are
 * two subscriptions we are sharing here, the execution of the HTTP observable
 * between those two subscriptions using sharereply(). So that is why we will
 * only have one EDP request that is either going to error out or complete.
 * And with these we have covered the catch and refroze strategy and the
 * finalized operator.
 */
