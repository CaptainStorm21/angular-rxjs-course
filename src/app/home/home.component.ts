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
          /**
           * Now, first, let's see how can we catch the error?
           * We can catch the EPA error by using here the catch error operator.
           * So the operator is going to take here as the first argument and error.
           * And this function here is supposed to return and observable.
           * That is going to be used to continue the observable that this
           * error out.
           * So as we know, according to the observable contract,
           * these observable here, it's going to emit values and then
           * it's either going to complete or error out because these
           * observable, which is highlighted here, has error throughout
           * with the error on the backend.
           * These observable will no longer emit any further values.
           * What will happen then is that catch error is going to catch
           * the error and it's going to trigger this function.
           * And the goal of this function is to provide an alternative
           * observable that the user of courses in this case, this component
           * can use in replacement of the observable that has just failed.
           *  So the output of this function here is an alternative error
           * observable that is only going to be consumed by the component
           * if the HTP observable errors out. So the output of this function
           * here is an alternative error observable that is only going to be
           * consumed by the component if the HTP observable errors out.
           * And the other alternative is that this function frozen error
           * again and then the course is observable,is then going to be error
           * out, just like happened to the HTP observable.
           */
          // catchError(err => of([
          //   {
          //     id: 0,
          //     description: "RxJs In Practice Course",
          //     iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
          //     courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
          //     longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
          //     category: 'BEGINNER',
          //     lessonsCount: 10
          // }
          // ]))
          /**
           * Strategy, which is going to be we are going to try to recover
           * from the error by providing some alternative value to the
           * component for that, we need to return unobservable here.
           * So let's use here the of operator to return and observable
           * that he meets a single value and this value needs to be an
           * array of courses. So let's make this here, an array and we
           * could already return here to the empty array, to the component.
           * This way we would get an empty list displayed in order to show
           * that this is working as expected.
           */

          // catchError(err => )

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
