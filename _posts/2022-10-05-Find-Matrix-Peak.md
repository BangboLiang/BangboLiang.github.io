---
layout: post
title: FindMatrixPeak
subtitle: Just a code I programed
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [Code, Algorithm,Study]
comments: true
---

# FindMatrixPeak

A simple program that can find a peak(local max) value of a 2-d array(matrix).

The code is written by python3.

```python
# Find a Peak of a Matrix.
# Author: lbb lbb@hnu.edu.cn
# step: first we get the middle column of this matrix, and find the biggest element of this column.
#       then we compare this element between it, it's left element and it's right element.
#       if this element is big enough, this element is a peak.
#       else condition : Get the slice of the bigger direction(left or right),and do above steps again.
#       Time complexity of this algorithm: O(nlogn?) (I think so).
matrix = []


def get_column_max(i: int) -> (int, int):  # Function which get a max element of a column.
    value, position = matrix[0][i], 0
    for rows in range(1, NumOfRows):
        if matrix[rows][i] > value:
            value, position = matrix[rows][i], rows
    return value, position


def find_peak() ->(int,int):
    start, ends = 0, NumOfColumns-1
    while start < ends:
        middle = start + int((ends-start)/2)
        maxval, maxpos = get_column_max(middle)
        if middle ==0:
            if maxval > matrix[maxpos][1]:
                return maxpos, 0
            else:
                start = 1
        else:
            if matrix[maxpos][middle-1] < maxval and matrix[maxpos][middle+1] < maxval:
                return maxpos, middle
            elif matrix[maxpos][middle-1] < maxval < matrix[maxpos][middle+1]:
                start = middle+1
            else:
                ends = middle-1
    pos = get_column_max(start)
    return pos, start


if __name__ == '__main__':
    NumOfRows = eval(input('Please input the number of rows:'))
    NumOfColumns = eval(input('Please input the number of columns:'))
    print('Now input the matrix:(Do not input extra space at the end of each line.)')
    for ii in range(NumOfRows):
        row = list(input().split(" "))
        row = list(map(int, row))
        matrix.append(row)
    # print(matrix)
    result = find_peak()
    # print(result)
    print("The position of the peak from this matrix is: ")
    print("Row: "+str(int(result[0])+1))
    print("Column: "+str(int(result[1])+1))
    print("And it's vaule is: "+ str(matrix[result[0]][result[1]]))
```

