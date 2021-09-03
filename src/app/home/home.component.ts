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
          /**
           * We're going to get here two errors getting executed and
           * we are going to get here.The finalized method, getting twice
           * executive as expected.
           * If this is not the behavior that you are looking for,
           * if you want the error handler to get executed only once instead,
           * then what we need to do is to move the catch error block up the
           * observable chain.
           * So instead of doing the catch error here, the output of share
           * replay that we are going to have this shared between the two
           * subscriptions, we can instead take here the catch error block
           * and move this here immediately after invoking the HTP observable.
           *
           * So this way, the whole observable chain is going to be bypassed
           * and we will not get here to this mapping operation and we will
           * not get here to the share replay.
           * Operator, let's try this new logic we are going to have over
           * here to the home component and we are going to see that indeed
           * here this time around. The error handling block of catch
           * error was only executed once, but we still have here finalize being
           * executed twice.
           *
           * This is as expected because we got here two subscriptions to these
           * observable here. So two times the observable was finished because
           * both subscriptions were terminated.
           * If we want finalized to be handled only once per HTP request,
           * then we will move the finalized block here and place it before
           * the share a replay operator.
           * And this is one thing that is general to the catch error and
           * to the finalize operators.
           *
           * home component -
           * const courses$: Observable<Course[]>
           */
          // if we want 2 finanze statements
          // finalize(() => {
          //   console.log('Finalize Executed ...');
          // })

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
