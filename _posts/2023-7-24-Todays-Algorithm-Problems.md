---
layout: post
title: Today's Algorithm Problems I solved
subtitle: Greedy algorithm, dynamic programming, memory search, etc.
tags: [Code,Cpp,Algorithm,Study]
cover-img: /assets/img/07_19/pic6.jpg
thumbnail-img: /assets/img/avatar-icon.png
comments: true
---

# P1 partial knapsack problem
You can find the problem on oj :https://www.luogu.com.cn/problem/P2240
> AliBaba walked into the treasure cave full of treasures. There are N (less than or equal 100) piles of gold coins in the treasure cave. The total weight and total value of the i-th pile of gold coins are respectively mi, vi (mi more than or equal1 and vi less than or equal100). Alibaba has a backpack with a load capacity of T (less than or equal 1000), but there is not necessarily a way to put all the gold coins in it. He wanted to feign as much gold coin value as possible. All gold coins can be divided at will, and the weight-to-value ratio (that is, the unit price) of the divided gold coins remains unchanged. May I ask how much value of gold coins Alibaba can take away at most?



It's easy to found that we can solve this problem by greedy algorithom.

```cpp
#include <iostream>
#include <algorithm>
#include <iomanip>

using namespace std;

struct coin{
    double height;
    double value;
    double valperh;
};

bool mycmp(coin x, coin y)
{
    return x.valperh > y.valperh;
}

int main(int argc, char const *argv[])
{
    int N,T;
    cin >> N >> T;
    coin c[N];
    double height1, value1;
    for (int  i = 0; i < N; i++)
    {
        cin >> height1 >> value1;
        c[i].height = height1;
        c[i].value = value1;
        c[i].valperh = c[i].value / c[i].height;
        //cout << c[i].height << ' ' << c[i].valperh << '\n';
    }
    sort(c,c+N,mycmp);
    double restroom = T;
    double result = 0;
    for (int i = 0; i <= N; i++)
    {
        if (restroom > 0)
        {
            if(c[i].height <= restroom)
            {
                result += c[i].value;
                restroom -= c[i].height;
            }
            else
            {
                result += c[i].valperh * restroom;
                restroom = 0;
            }
        }
    }
    cout << fixed << setprecision(2) << result << '\n';
    return 0;
}
```





# P2 

You can found the problem in:  https://www.luogu.com.cn/problem/P2196

> There are (*N*≤20) cellars on a map, and a certain number of mines are buried in each cellar. At the same time, the connecting paths between the cellars are given. When the data of the cellar and its connection is given, someone can start digging mines from any place, and then dig down along the indicated connection (only one path can be selected), and the work of digging mines ends when there is no connection. Design a mine-digging scheme so that someone can dig the most mines.

Not hard to see that this is a classical Dynamic Programming task. Note that there are some wrong description in the problem is that the worker can only dig more deeper, no higher.



```cpp
#include <iostream>

using namespace std;

void trace(int N, int* follows, int pos)
{
    if(follows[pos] == -1)
    {
        cout << pos + 1 <<' ';
        return;
    }
    trace(N, follows, follows[pos]);
    cout << pos + 1 << ' ';
    return;
}

int main(int argc, char const *argv[])
{
    int N;
    cin >> N;
    int bomb[N];
    int connected[N][N];
    for (int i = 0;i < N; i++)
    {
        for (int j = 0;j < N; j++)
        {
            connected[i][j] = 0;
        }
    }
    for (int i = 0;i < N; i++)
    {
        cin >> bomb[i];
    }
    for (int i = 0; i < N-1; i++)
    {
        connected[i][i] = 1;
        for (int j = i+1; j < N; j++)
        {
            cin >> connected[i][j];
            connected[j][i] = connected[i][j];
        }
    }
    connected[N-1][N-1] = 1;

    int dp[N];
    int follows[N];
    for (int i = 0; i < N; i++)
    {
        follows[i] = -1;
    }
    for (int i = 0; i < N; i++)
    {
        dp[i] = bomb[i];
    }
    int curr_max;
    for (int i = 1; i < N; i++)
    {
        curr_max = 0;
        for (int j = 0; j < i; j++)
        {
            if(connected[i][j] == 1)
            {
                if(dp[j] + bomb[i] > dp[i])
                {
                    dp[i] = dp[j] + bomb[i];
                    follows[i] = j;
                }
            }
        }
    }
    int ans = 0;
    int maxpos = 0;
    for(int i = 0; i < N; i++)
    {
        if(dp[i] > ans){
            ans = dp[i];
            maxpos = i;
        }
    }
    trace(N, follows,maxpos);
    cout << '\n';
    cout << ans << '\n';
    return 0;
}
```





# 3

You can found the problem in: https://www.luogu.com.cn/problem/P1434

> Michael likes skiing. This is not surprising, because skiing is indeed exciting. But in order to gain speed, the slippery area has to slope down, and when you slide to the bottom of the slope, you have to go up the slope again or wait for the elevator to pick you up. Michael wants to know the longest landslide in an area. Regions are given by a two-dimensional array. Each number of the array represents the height of the point.

If you use DFS to solve this problem, your running time will be exceed.

So we use memory DFS:

```cpp
#include <iostream>

using namespace std;

int height[205][205];
int saveboard[205][205];
int dx[4]={1,0,-1,0};
int dy[4]={0,1,0,-1};   //right, down, left, up

int mymax(int a, int b)
{
    if(a > b)
        return a;
    return b;
}

int DFsearch(int x,int y, int row, int col){
    if (saveboard[x][y] != 0)
        return saveboard[x][y];
    saveboard[x][y] = 1;
    int xx,yy;
    for(int i = 0; i < 4; ++i)  //four directions
    {
        xx = x + dx[i];
        yy = y + dy[i];
        if (xx >= 0 && xx <row && yy >= 0 && yy< col)
        {
            if(height[xx][yy] < height[x][y]){
                DFsearch(xx,yy,row,col);
                saveboard[x][y] = mymax(saveboard[xx][yy]+1, saveboard[x][y]);
            }
        }
    }
    return saveboard[x][y];
}

int main(int argc, char const *argv[])
{
    int row, col;
    cin >> row >> col;
    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++){
            cin >> height[i][j];
            saveboard[i][j] = 0;}
    int ans = 0;
    for (int i = 0; i < row; i++)
    {
        for (int j = 0; j < col; j++)
        {
            ans = mymax(ans, DFsearch(i, j, row, col));
        }
    }
    cout << ans << '\n';
    return 0;
}
```

