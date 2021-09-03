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
    concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';
import { RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { debug } from '../common/debug';


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
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
        // tap (course => console.log(course))
        debug (RxJsLoggingLevel.INFO, "course value")
    );
    setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);
    setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);

  }

  /**
   *  we are going to be writing is a debug operator
   * that is going to help us a lot to debug our RXJS program
   *
   * So sometimes in order to better understand the program
   * and especially to troubleshoot a problem, we often use the
   * tap operator for producing debugging logging statements.
   * For example, in the case of these observable, we would like
   * to log here through the console, the search value that
   * we are receiving here in the top operator.
   * So this corresponds to the search string that you type
   * here in the type ahead. In the case of the course observable,
   * we might want to log to the console what we are receiving from
   * the backend.
   */

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debug(RxJsLoggingLevel.TRACE, 'search'),
        debounceTime(400),
        // tap(search => console.log('search', search)),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.DEBUG, 'lesson value '),
      );
  }


    loadLessons(search = ''): Observable < Lesson[] > {
      return createHttpObservable(
        `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res["payload"])
        );
    }
  }






