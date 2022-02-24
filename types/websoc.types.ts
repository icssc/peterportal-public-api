
export interface WebsocResponse {
    schools: School[]
} 

export interface School {
    schoolName: string;
    schoolComment: string;
    departments: Department[];
}

export interface Department {
    deptName: string;
    deptCode: string;
    deptComment: string;
    courses: Course[];
    sectionCodeRangeComments: string[];
    courseNumberRangeComments: string[];
}

export interface Course {
    courseNumber: string;
    courseTitle: string;
    courseComment: string;
    prerequisiteLink: string;
    sections: Section[];
}

export interface Section {
    sectionCode: string;
    sectionType: string;
    sectionNum: string;
    units: string;
    instructors: string[];
    meetings: Meeting[];
    finalExam: string;
    maxCapacity: string;
    numCurrentlyEnrolled: EnrollmentCount;
    numOnWaitlist: string;
    numRequested: string;
    numNewOnlyReserved: string;
    restrictions: string;
    status: string;
    sectionComment: string;
}

export interface Meeting {
    days: string;
    time: string;
    bldg: string;
}

export interface EnrollmentCount {
    totalEnrolled: string;
    sectionEnrolled: string;
}

export interface CourseGQL {
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
    concurrent: string;
    same_as: string;
    restriction: string;
    overlap: string;
    corequisite: string;
    ge_list: string[];
    ge_text: string;
    terms: string[];
    offerings: CourseOffering[];
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
    course: CourseGQL;
}

export interface SectionGQL {
    code: string;
    comment: string;
    number: string;
    type: string;
}
