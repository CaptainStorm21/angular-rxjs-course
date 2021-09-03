import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput') input: ElementRef;
    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {

      this.courseId = this.route.snapshot.params['id'];
      // this.course$ = this.store.selectCourseById(this.courseId);
      this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
      // this.lessons$ = this.loadLessons();
        // createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100`)
        // .pipe(
        //   map(res => res['payload'])
        // );

    }

  ngAfterViewInit() {

    //   const searchLessons$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
    //       .pipe(
    //           map(event => event.target.value),
    //           debounceTime(400),
    //           distinctUntilChanged(),
    //           switchMap(search => this.loadLessons(search))
    // );

    // this.lessons$ = this.loadLessons();
    // const initialLessons$ = this.loadLessons();
    // this.lessons$ = concat(initialLessons$, searchLessons$);

    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );
  }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }
}

/**
 * In this lesson, we are going to further simplify our course component.
 * We are going to refactor it so that it uses the start with operator.
 * Now let's switch over here to our course component and see here
 * these new logic in action.So as you can see, after refreshing the
 * application we get here, our initial results, and if we not
 * type here, let's say, for example, welcome, we are going to
 * see that our search results are still getting displayed as expected.
 * But we now have implemented the logic with a lot less code using
 * the start with operator.And with these, we have completed
 * the implementation of our course component.
 * What we are going to do next is we are going to learn how to build
 * our own custom.Our guest operator, we're going to build the
 * debugging facility operator.
 */










