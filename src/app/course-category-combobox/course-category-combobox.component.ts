import { Component, contentChild, effect, ElementRef, input, model } from '@angular/core';
import { CourseCategory } from "../models/course-category.model";

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {

  label = input.required<string>();

  //Contrato bi-direcional entre o component filho e pai 
  value = model<CourseCategory>();

  title = contentChild<ElementRef>('title');

  constructor() {
    effect(() => {
      console.log(`title`, this.title());

    })
  }

  onChangeChanged(category: string) {
    this.value.set(category as CourseCategory);
  }

}
