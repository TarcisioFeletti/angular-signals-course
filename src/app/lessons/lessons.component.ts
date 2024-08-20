import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { LessonsService } from "../services/lessons.service";
import { Lesson } from "../models/lesson.model";
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component";

@Component({
  selector: 'lessons',
  standalone: true,
  imports: [
    LessonDetailComponent
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent {

  mode = signal<'master' | 'detail'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  lessonService = inject(LessonsService);

  searchInput = viewChild.required<ElementRef>('search');

  async onSearch() {

    const query = this.searchInput()?.nativeElement.value;
    console.log(query);

    const results = await this.lessonService.loadLessons({ query });

    this.lessons.set(results);

  }

  onLessonSelected(lesson: Lesson) {
    this.selectedLesson.set(lesson);
    this.mode.set('detail');
  }

  onCancel() {
    this.mode.set('master');
    this.selectedLesson.set(null);
  }

  onLessonUpdated(lesson: Lesson) {
    this.lessons.update(lessons => lessons.map(l => l.id === lesson.id ? lesson : l));
    this.mode.set('master');
    this.selectedLesson.set(null);
  }

}
