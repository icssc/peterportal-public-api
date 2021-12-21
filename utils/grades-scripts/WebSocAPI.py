import requests
from bs4 import BeautifulSoup

class WebSocException(Exception):
    pass

class WebSocAPI:
    def __init__(self, term, genEd = 'ANY', department = 'ALL', courseNum = '', courseLevel = 'ANY', courseCodes = '',
                    instructor = '', courseTitle = '', courseType = 'ALL', units = '', days = '',
                    startTime = '', endTime = '', maxCap = '', courseFull = 'ANY', cancelledCourses = 'EXCLUDE',
                    building = '', room = ''):
        # Search parameters for WebSoc
        data = {
            'YearTerm': term,
            'Breadth': genEd,
            'Dept': department,
            'CourseNum': courseNum,
            'Division': courseLevel,
            'CourseCodes': courseCodes,
            'InstrName': instructor,
            'CourseTitle': courseTitle,
            'ClassType': courseType,
            'Units': units,
            'Days': days,
            'StartTime': startTime,
            'EndTime': endTime,
            'MaxCap': maxCap,
            'FullCourses': courseFull,
            'CancelledCourses': cancelledCourses,
            'Bldg': building,
            'Room': room,
            'ShowFinals': 'on',
            'Submit': 'XML'
        }
        self.url = 'https://www.reg.uci.edu/perl/WebSoc'
        self.classList = self._websoc(data)

    def __iter__(self):
        for course in self.classList:
            yield course

    def __getitem__(self, item):
        return self.classList[item]

    def _soupXML(self, data:dict):
        """Returns soup object that has the relevant class data"""
        headers = {'User-Agent': 'Chrome/61.0.3163.91'}
        r = requests.post(self.url, data=data, headers=headers)
        soup = BeautifulSoup(r.text, "lxml")

        # Outputs error message that WebSoc gives if no classes appear
        if soup.find('error_msg') != None:
            raise WebSocException(soup.find('error_msg').getText())

        return soup

    def _websoc(self, data:dict) -> list:
        '''Returns a list of Course objects'''
        soup = self._soupXML(data)
        year = soup.find('term_year').getText()
        table = soup.find('course_list')
        departments = table.find_all('department')

        classList = []
        for dep in departments:
            for course in dep.find_all('course'):
                classList.append(Course(year, course, dep))

        return classList

class Course:
    def __init__(self, year, course, dept):
        self.department = dept['dept_name']
        self.department_code = dept['dept_code']
        self.year = year
        self.course_number = course.get('course_number')
        self.course_title = course.get('course_title')
        self.sections = [Sections(section) for section in course.find_all('section')]

class Sections:
    def __init__(self, section):
        self.section = section
        self.course_code = section.find('course_code').getText()
        self.type = section.find('sec_type').getText()
        self.section_number = section.find('sec_num').getText()
        self.units = section.find('sec_units').getText()
        self.instructors = self._intructors()
        self.meeting = [[f'{meet.sec_days.getText()} {meet.sec_time.getText()} {meet.sec_bldg.getText()} {meet.sec_room.getText()}'] for meet in section.find('sec_meetings').find_all('sec_meet')]
        self.max = section.find('sec_enrollment').find('sec_max_enroll').getText()
        self.enrolled = section.find('sec_enrollment').find('sec_enrolled').getText()

    def _intructors(self):
        if self.section.find('sec_instructors') is None:
            return None

        l = []
        for name in self.section.find('sec_instructors').find_all('instructor'):
            l.append(name.getText())
        return l