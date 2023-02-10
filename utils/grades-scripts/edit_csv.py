from numpy import NaN
import pandas
import time
import requests
import os
from dotenv import load_dotenv
load_dotenv()  # take environment variables from .env.



port = os.getenv("PORT") or "8080"

def scrape(term, code):
    time.sleep(0.4)

    # send request to peterportal api locally
    url = "http://localhost:" + port +"/rest/v0/schedule/soc"
    res = requests.get(url, params={"term": term, "sectionCodes": code})

    data = res.json()
    course = data["schools"][0]["departments"][0]["courses"][0]
    department = data["schools"][0]["departments"][0]

    # get the data from response
    dept = department["deptName"].replace('&amp;', 'and').strip()
    deptCode = department["deptCode"]
    prof = course["sections"][0]["instructors"][0]
    num = course["courseNumber"]
    year = term[0:4]

    return dept, deptCode, prof, num, year

def saveData(df, tup, num):
    df.at[num, 'dept'] = tup[0]
    df.at[num, 'dept_code'] = tup[1]
    df.at[num, 'prof'] = tup[2]
    df.at[num, 'number'] = tup[3]
    df.at[num, 'exact_year'] = tup[4]


# for some reason summer 10wk classes cannot be found
def scrapeAndSave(num, code, year, quarter):
    if quarter == 'Summer':
        # check for each summer session and when we find one, save it
        summertypes = ["Summer1", "Summer2", "Summer10wk"]
        found = False
        for j in summertypes:
            try:
                tup = scrape(f'{year} {j}', code)
                saveData(df, tup, num)
                found = True
                break
            except Exception as e:
                pass
        
        if not found:
            print("no class found for ", code)
            

    elif quarter == 'Fall':
        tup = scrape(f'{year} {quarter}', code)
        saveData(df, tup, num)

    elif quarter == 'Winter':
        tup = scrape(f'{str(int(year) + 1)} {quarter}', code)
        saveData(df, tup, num)

    elif quarter == 'Spring':
        tup = scrape(f'{str(int(year) + 1)} {quarter}', code)
        saveData(df, tup, num)


if __name__ == '__main__':
    NEW_FILE_INPUT = './utils/grades-scripts/small.xlsx'
    OLD_FILE_INPUT = './db/grades.csv'
    df = pandas.read_excel(NEW_FILE_INPUT, index_col=None, thousands=',')

    cols = df.columns
    df = df.rename(columns={
        cols[0]: 'year',
        cols[1]: 'quarter',
        cols[2]: 'department',
        cols[3]: 'base_number',
        cols[4]: 'code',
        cols[5]: 'section',
        cols[6]: 'title',
        cols[7]: 'type',
        cols[8]: 'professor',
        cols[10]: 'A',
        cols[11]: 'B',
        cols[12]: 'C',
        cols[13]: 'D',
        cols[14]: 'F',
        cols[15]: 'P',
        cols[16]: 'NP',
        cols[17]: 'W',
        cols[18]: 'avg_gpa'
    })

    df['number'] = [0]*len(df.index)
    df['dept'] = [0]*len(df.index)
    df['prof'] = [0]*len(df.index)
    df['dept_code'] = [0]*len(df.index)
    df['exact_year'] = [0] * len(df.index)

    df['professor'] = df['professor'].str.upper()
    df = df.astype(str)

    print('Started...')
    for i in range(0, len(df.index)):
        code = df.at[i, 'code']
        year = df.at[i, 'year'].split('-')[0]
        quarter = df.at[i, 'quarter']

        try:
            print(f"Scraping {code}")
            scrapeAndSave(i, code, year, quarter)
            # print(i, code, year, quarter)
            time.sleep(1)

        except Exception as ex:
            print('Error Occurred:\n', ex)
            print("Class Code:", code)
            print(f"Count so far: {i}")
            time.sleep(45)
            print('Continuing...')

    print("Finished scraping")

    df['base_number'] = df['base_number'].str.replace(r'[^0-9]+', '', regex=True)  # removes letters from number (45C -> 45)
    df['base_number'] = pandas.to_numeric(df['base_number'])
    df['avg_gpa'] = pandas.to_numeric(df['avg_gpa'], errors='coerce')

    # Format Instructors
    df['prof'] = df['prof'].str.replace(',', '')
    df['professor'] = df['professor'].str.replace(',', '')

    # Replacing given writing instructors from CSV with the ones scraped on WebSoc
    df['instructor'] = df.apply(lambda x: x['prof'] if x['department'] == 'Writing' else x['professor'], axis=1)

    # Reverse each instructor name to add comma at the first empty space, but when reversed again
    # to make it back to the original, the comma is at the last empty space
    df['instructor'] = df.loc[:, 'instructor'].apply(lambda x: x[::-1])
    df['instructor'] = df['instructor'].str.replace(' ', ' ,', 1)
    df['instructor'] = df.loc[:, 'instructor'].apply(lambda x: x[::-1])

    df.drop(columns=['professor', 'prof', 'department'])  # no longer needed
    df = df[['year', 'exact_year', 'quarter', 'dept', 'dept_code', 'number', 'base_number', 'code', 'section', 'title',
             'type', 'instructor', 'A', 'B', 'C', 'D', 'F', 'P', 'NP', 'W', 'avg_gpa']]



    df2 = pandas.read_csv(OLD_FILE_INPUT, index_col=None)
    df2 = df2.append(df, ignore_index=True)

    df.to_csv('./utils/grades-scripts/last_quarter.csv', index=False)  # csv for only the new data
    df2.to_csv('./db/updated_grades.csv', index=False)  # csv for combined old and new data
