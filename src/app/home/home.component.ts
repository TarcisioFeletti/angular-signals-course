import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, OnInit, signal, viewChild } from '@angular/core';
import { CoursesService } from "../services/courses.service";
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../messages/messages.service";
import { catchError, from, throwError } from "rxjs";
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService);

  dialog = inject(MatDialog);

  messageService = inject(MessagesService);

  beginnersList = viewChild('beginnersList', {
    read: ElementRef
  });

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === 'BEGINNER');
  })

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === 'ADVANCED');
  })

  loadingService = inject(LoadingService);

  constructor() {
    effect(() => {
      console.log(`beginnersList`, this.beginnersList());

    })

    effect(() => {
      console.log('Beginner Courses:', this.beginnerCourses());
      console.log('Advanced Courses:', this.advancedCourses());

    })

    this.loadCourses()
      .then(() => console.log('All courses loaded', this.#courses()));
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    }
    catch (err) {
      this.messageService.showMessage(`Error loading courses!`, "error");
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    this.#courses.update(courses => courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
  }

  async onCourseDeleted(id: string) {
    try {
      await this.coursesService.deleteCourse(id);
      this.#courses.update(courses => courses.filter(course => course.id !== id));
    } catch (err) {
      console.error(err);
      alert(`Error deleting course`);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, { mode: "create", title: "Create new course" });

    if (!newCourse) return;

    this.#courses.update(courses => [...courses, newCourse]);
  }


}
