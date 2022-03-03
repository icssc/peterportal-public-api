import { Meeting, SectionGQL } from "./websoc.types";

export interface Error {
    timestamp: string;
    status: string;
    error: string;
    message: string
}

export interface Course {
    id: string;
    department: string;
    number: string;
    school: string;
    title: string;
    course_level: string;
    department_alias: string[];
    units: number[];
    description: string;
    department_name: string;
    professor_history: string[];
    prerequisite_tree: string;
    prerequisite_list: string[];
    prerequisite_text: string;
    prerequisite_for: string[];
    repeatability: string;
    grading_option: string;
    concurrent: string;
    same_as: string;
    restriction: string;
    overlap: string;
    corequisite: string;
    ge_list: string[];
    ge_text: string;
    terms: string[];
    course_offering?: CourseOffering[];
}

export interface CourseOffering {
    year: string;
    quarter: string;
    instructors: string[];
    final_exam: string;
    max_capacity: number;
    meetings: Meeting[];
    num_section_enrolled: number;
    num_total_enrolled: number;
    num_new_only_reserved: number;
    num_on_waitlist: number;
    num_requested: number;
    restrictions: string;
    section: SectionGQL;
    status: string;
    units: number;
    course: Course;
}

export interface Instructor {
    name: string;
    shortened_name: string;
    ucinetid: string;
    title: string;
    department: string;
    schools: string[];
    related_departments: string[];
    course_history: string[]
}

export type GradeRawData = GradeData[];

export interface GradeCalculatedData {
    gradeDistribution: GradeDist;
    courseList: GradeCourse[]
}

export interface GradeCourse {
    year: string;
    quarter: string;
    department: string;
    department_name: string;
    title: string;
    number: string;
    code: number;
    section: string;
    instructor: string;
    type: string
}

export interface GradeDist {
    sum_grade_a_count: number;
    sum_grade_b_count: number;
    sum_grade_c_count: number;
    sum_grade_d_count: number;
    sum_grade_f_count: number;
    sum_grade_p_count: number;
    sum_grade_np_count: number;
    sum_grade_w_count: number;
    average_gpa: number;
    count: number
}

export interface GradeData {
    year: string;
    quarter: string;
    department: string;
    department_name: string;
    number: string;
    number_int: number;
    code: number;
    section: string;
    title: string;
    instructor: string;
    type: string;
    gradeACount: number;
    gradeBCount: number;
    gradeCCount: number;
    gradeDCount: number;
    gradeFCount: number;
    gradePCount: number;
    gradeNPCount: number;
    gradeWCount: number;
    averageGPA: number;
}
