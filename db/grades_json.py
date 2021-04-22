import pandas as pd
import numpy as np


"""
 year: '2014-15',
  quarter: 'Fall',
  department: 'Mathematics',
  number: '1',
  code: '44030',
  section: 'B',
  title: 'PRE-CALCULUS',
  type: 'LEC',
  instructor: 'PHAM, K.',
  A: '14',
  B: '56',
  C: '45',
  D: '21',
  F: '26',
  P: '1',
  NP: '8',
  W: '1',
  avg: '2.06',
  realNum: '1B',
  dept: 'Mathematics',
  deptCode: 'MATH',
  actualYear: '2014'
"""

if __name__ == "__main__":
    grades = pd.read_csv("grades.csv")

    