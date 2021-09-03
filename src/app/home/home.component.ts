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
          tap(() => console.log("http request executed")),
          map(res => Object.values(res["payload"])),
          shareReplay(),
          catchError(err => {
            // we are handling the error locally
            console.log("Error occurred", err);
            // check console in F12
            return throwError(err);
          }),
          /**
           * Let's now talk about clean up logic.
           * Let's say that, for example, we have here these observable causes
           * that might either fail or it might complete.
           * And we would like in both cases to do some sort of cleanup operation.
           * This could be to close a network.
           * Action release and memory resource or some other common cleanup
           * operation NREGS, we can implement that type of cleanup logic by
           * using the finalize operator, these operator is going to take a
           * function that is going to get invoked in one of two cases.
           * This function is going to get executed when these observable here
           * completes or when it arrives out.
           * Let's try these out.
           * We are going to add here a logging statement so that we can see
           * that finalized was indeed executed.
           * Let's try this out.
           * We are going to switch here to the screen and keep an eye here on the console.
           * So as you can see, we got here a first air that was frozen, finalized,
           * was executed. And we can see that because these observable is getting
           * subscribed twice, one in the beginning and the other on the advanced step.
           */
          finalize(() => {
            console.log('Finalize Executed ...');
          })

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
