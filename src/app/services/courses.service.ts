import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { firstValueFrom } from "rxjs";
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";
import { SkipLoading } from "../loading/skip-loading.component";


@Injectable({
  providedIn: "root"
})
export class CoursesService {

  http = inject(HttpClient);

  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);

    const response = await firstValueFrom(courses$);

    return response.courses;
  }

  async getCourseById(courseId: string): Promise<Course> {
    const courses$ = this.http.get<Course>(`${this.env.apiRoot}/courses/${courseId}`);

    return firstValueFrom(courses$);
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const courses$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course);

    return await firstValueFrom(courses$);
  }

  async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
    const courses$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes);

    return await firstValueFrom(courses$);
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courses$ = this.http.delete<void>(`${this.env.apiRoot}/courses/${courseId}`, {
      context: new HttpContext().set(SkipLoading, true)
    });

    return await firstValueFrom(courses$);
  }

}
