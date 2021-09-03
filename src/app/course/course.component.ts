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


    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        // throttle(() => interval(400))
        throttleTime(500)
      ).subscribe(console.log);
    }

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

    // this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map(event => event.target.value),
    //     startWith(),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     switchMap(search => this.loadLessons(search))
    //   );
  // }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }
}

/**
 * In these lessons, we are going to talk about throttling in our next guests.
 * We're going to introduce the frontal function and we're going to introduce
 * the frontal time operated. Let's first talk about the notion of throttling
 * in general and discuss how it compares to debunking that we have used here
 * in our type ahead. These are two closely related notions that are often
 * mixed up. Let's review first the bounce operation.We're going to create
 * here a simple example that instead of doing a request to the backend
 * we'll simply the balance here, the input in this search box, and
 * we're going to print that out to the screen by using the subscribe method.

We are going to log out the input text here to the console.

If we now try this out and we start typing, we are going to see that we only get the value in the console

once the input that the user is typing is stable.

So we are only going to get something once we have here a value that has been stable for at least four

hundred milliseconds.

So this means that if the user keeps typing relatively quickly, there will never be an output here

in the console because the value that we are balancing is not yet stable.

So the balancing is about waiting for a value to become stable.

This is very different than the notion of throttling.

Throttling is somewhat similar to the balancing in the sense that we are also trying to reduce here

the number of values in our stream.

But the way that we are doing it is very different.

Let's have a look here at the throttle model diagram.

We can see here that we have an input stream that is emitting a lot of values.

Sometimes there is here a period of silence, but in certain occasions the stream is really emitting

values in fast succession.

The values are very close to each other here and also here.

This could be, for example, a WebSocket connection that is continuously sending values to the front

end, for example, containing the exchange rate of a given currency.

This is an example of a stream for which we would like to limit the output rate.

So it's not really useful for a front end to receive this information.

Updated more than, let's say, once a minute throttle is used for limiting the output by limiting the

number of values that can be emitted in a certain interval.

The throttle operator allows us to implement that and for that it uses a lock Celia timer observable

that is going to be used to determine when should we meet a value from the input stream.

So we have here an input stream which contains the values that we want to rate limit.

And we have here a second auxillary timer observable that is going to emit values at certain points

in time.

Whenever the auxiliary timer observable emits a value, then we should also emit a value in the output.

Let's have a look at these examples.

So here our input stream emitted the first value and we have outputted here also the same value a then

we are throttling here this input stream.

So we are going to wait, let's say, for example, for one second to elapse before emitting a second

value.

So one second will end, for example, here, let's say, at this point.

So what will happen now is that we are waiting for the next value to show up before putting it in the

output.

Then once we output here, the value B, we are going to start counting again.

One second.

One second is going to end about here.

So we have filtered out here, the X value, and once this second interval of one second finishes,

then we are going to emit the next value, see, and we are going to start counting again one second.

These three occurrences of the value X all occurred inside the one second fettling interval.

So all these values have been omitted from the output.

Notice that the use of these auxillary observable makes the frontal mechanism very flexible.

We can have these observable increases, the throttling rate or decrease it according to some external

conditions.

What determines the frontline rate is the values that are emitted by these observable but these observable

could have any logic that we want.

It does not have to be a periodic interval.

Let's see what happens if we now use throttling instead of the bouncing in our example.

So we are going to remove here debunked time and we are going to add here the throttle operator.

So this operator receives here a function and.

Dysfunction needs to return unobservable, let's do the simple case where we are throttling and limiting

the rate of these observable to a maximum of one value per half second.

So for that, we are going to periodically emit here a new value.

We are going to see that this value is emitted once each half second.

Let's have a look here at the output.

If we now start typing, we are going to see that in the console.

We end up having here one value each have second maximum with throttling.

We have the guarantee that we have our output rate limited in time, but we don't have the guarantee

that our output is the latest value of the stream.

So if we start typing here, hello, have a look.

I started typing.

The first value was emitted immediately.

We have here the output H containing only the first letter.

But then I stopped typing here while the modeling interval was still ongoing.

So this value here hell was throttled out and after that I did not continue typing.

So the value that I have here, which is the last value of the type, I have never made it here to the

output.

If I now type the letter O, we are going to see that the output is now emitted.

So as you can see in the case of a type of head that we really want to use the balancing instead of

throttling so that we are sure that we are using the latest search that was typed.

Now let's have a look here at an easier way to implement these logic we have used here the generic fractal

operator and we have created here the observable that is triggering the throttling manually by using

here the interval function, an alternative way that achieves the same result.

And it's a bit easier to release to use the throttle time operator.

So this will create internally our interval.

Let's have a look at throttle time in action.

So if we start typing here, we are going to see that we have the same rate limiting behavior as before.
 */








