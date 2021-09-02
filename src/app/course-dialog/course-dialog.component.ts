import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent, noop} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Store} from '../common/store.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private store:Store) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }


  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap(changes => this.saveCourse(changes))
      )
      .subscribe();
    }



  saveCourse(changes) {
    return fromPromise(fetch(`/api/courses/${this.course.id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  /**
   * ExhaustMap
   * So here we have the source observable that is emitting multiple values.
   * One.Three and five, as usual, each value is going to be transformed into
   * a separate observable using herethe mapping function that takes a value
   * and returns unobservable, these observable is going to emit multiple values
   * and then completes the values emitted by these observable are going to be
   * passed to the output of exhaust map and these observable will eventually
   * complete. The critical thing here is if meanwhile, while these observable is
   * still active, if we would have here other values emitted by the source
   * observable, those values would essentially be ignored.
   *
   * So the new values are being ignored as long as the ongoing observable is not yet completed.

So as we can see, the critical notion involved here is ignoring extra values while the current observable

is still ongoing, which is exactly what we would like to apply here in the stream of clicks.
   */

  ngAfterViewInit() {
    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        exhaustMap(() => this.saveCourse(this.form.value))
      )
      .subscribe();
    }

/**
 * We have here a save button. Now, whenever we click on the save button,
 * we want to trigger this save method that we have here on the back end.
 * One common feature that we want to implement in these cases is to prevent
 * the user from hitting the save button multiple times and trigger multiple
 * parallel calls to the back end.
 * Notice the Gleeks that we do here on the save, but this is also
 * stream of values.
 * Let's then implement this functionality in the following way.
 * As an example, let's subscribe here to this stream of Gleek values.
 * And whenever we get the click, we are going to map that click value
 * into unobservable using a mapping operation.
 */

  /**
   * So the new values are being ignored as long as the ongoing observable is
   * not yet completed. So as we can see, the critical notion involved here
   * is ignoring extra values while the current observable is still ongoing,
   * which is exactly what we would like to apply here in the stream of clicks.
   * We want to handle one click trigger back in request.
   * And then if multiple clicks are issued while the same request
   * is still ongoing, those clicks are going to be ignored.
   */
    save() {
        this.store.saveCourse(this.course.id, this.form.value)
            .subscribe(
                () => this.close(),
                err => console.log("Error saving course", err)
            );
    }




    close() {
        this.dialogRef.close();
    }


}
