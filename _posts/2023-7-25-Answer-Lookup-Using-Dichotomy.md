---
layout: post
title: Answer lookup using dichotomy
subtitle: Dichotomy can also help you finding correct answer.
tags: [Code,Cpp,Algorithm,Study]
cover-img: /assets/img/07_19/pic7.jpg
thumbnail-img: /assets/img/crepe.jpg
comments: true
---

# Using dichotomy to find the highest/lowest possible answer is a good way to solve problems.

You can find the example problem here:https://www.luogu.com.cn/problem/P2678

Here is the problem:
>The annual "Stone Jumping" competition is about to start again!
>The race will take place in a straight river with some huge rocks in it. The organizing committee has selected two rocks as the starting and ending points of the competition. Between the start and end, there are N rocks (not including the start and end rocks). During the competition, players will start from the starting point and jump to adjacent rocks at each step until they reach the finish line. In order to increase the difficulty of the competition, the organizing committee plans to remove some rocks to make the shortest jumping distance of the players as long as possible during the competition. Due to budget constraints, the organizing committee will remove at most M rocks between the start and finish points (the start and end point rocks cannot be removed).

# Analyze
If you want to use brute force search to solve this question directly, it will seriously time out. In fact, we can find that the so-called shortest jumping distance obviously cannot exceed a range, and this range has been given in the title. In other words, the answer has a certain range limit, we can consider another way to solve it - enumerate the answers and verify whether the answers are feasible.

In fact, enumeration answers sometimes time out as well. This is like saying that you want to look up a word from an English-Chinese dictionary. You look through the pages from the beginning to the end, so that you can guarantee that you will find it, but in the worst case, you have to look through the entire dictionary, which is troublesome.

Is there any way to improve it? Of course there is.

Consider separating the dictionary from the middle, look at the main words on the middle page, and then judge whether the word I am looking for should be in the left half or the right half, and then go to that part to think about how to find it. Similarly, the other part is also an operation to be divided and judged. If this continues, the answer can be found quickly, and there is no need to turn over the entire dictionary.

It can be proved that if you search page by page, you need to search at most n times, but with this method, you can find floor(log2n) times at most.

We call this method "Binary Answers". As the name suggests, it enumerates the answers in a dichotomous way, and judges whether the answer is feasible when enumerating. However, bisection is not available in all cases, and two conditions need to be met to use bisection. One is bounded and the other is monotonic.

The binary answer should be performed on a monotone closed interval. That is to say, the final answer of the binary answer should be a definite value, instead of multiple solutions like searching. Dichotomy is generally used to solve optimal solution problems. Just now we talked about monotonicity, so where should this monotonicity be reflected?

You can think of it this way, there are many numbers in an interval, and these numbers may be the solutions to our problems. In other words, there are many illegal solutions and many legal solutions. We only consider legal solutions and call them feasible solutions. Considering all feasible solutions, we must find the best one from these feasible solutions as our answer, which we call the optimal solution.

The optimal solution must be feasible, but the feasible solution is not necessarily optimal. We assume that the entire sequence is monotonic, and a number x is a feasible solution, then generally, all x\'(x\'<x) are feasible solutions. And, if there is a number y that is an illegal solution, then generally, all y\'(y\'>y) are illegal solutions.

So when do binary answers apply? Pay attention to the title: Make the shortest jumping distance of the players as long as possible during the competition. If the title stipulates something with "the smallest maximum value" or "the largest minimum value", then this thing should satisfy the boundedness (obviously) and monotonicity (it can be seen) of the binary answer.

That's easy. We divide the jumping distance into two, and then "consider" this jumping distance as the shortest jumping distance, and then move the stone based on this distance. Use a judge to judge whether this solution is a feasible solution. If this solution is a feasible solution, then there may be a better solution than this, then we will go to its right half. Why go to the right? The answer is that this interval is increasing, and what we are looking for is the maximum value of the shortest jumping distance. Obviously, the value on the right must be greater than that on the left, so we may find a better solution than this. Conversely, if the solution obtained by the dichotomy is an illegal solution, it is impossible for us to find it on the right. Because of the nature, the solutions on the right must all be illegal solutions. Then we should go to the left to find the solution. The whole process looks recursive. In fact, this process can be written recursively or non-recursively. Personally, I prefer to use the non-recursive form.

The next question, how to realize this judge? Each question of the judge function has a way of writing each question, but the general idea should be the same-find a way to detect whether the solution is legal. Taking this question as an example, let’s judge how many stones need to be removed if this distance is the shortest jumping distance. We don’t need to consider the limit on how many stones to remove. After all the stones are removed, we compare the number with the limit. If it exceeds the limit, then this is an illegal solution, otherwise it is a legal solution, which is easy to understand.

You can simulate the process of jumping stones. You are at position i (i=0) at the beginning, and I will judge my current jumping distance when I jump to the next step. If the jumping distance is smaller than the mid from the two points, **then this is an illegal stone and should be removed.**Why? What we divide is the shortest jumping distance, which is already the shortest. If the jumping distance is shorter than the shortest, wouldn’t it be obviously illegal, right? What to do after removal? First add 1 to the counter, and then consider jumping forward. Look at the next stone after the removal, and judge the jumping distance again. If the jumping distance this time is longer than the shortest one, then this jumping is completely possible. We will jump over and continue to judge. If the jumping distance is illegal, then take it away, and continue this operation until i = n+1, why is it n+1? There are n stones in the middle of the river, obviously the end point is at n+1. (Be careful not to consider n as the end point here. In fact, you have to jump one step from n to reach the end point).

After simulating this process, we check the value of the counter, which means the number of stones we need to remove with mid as the answer, and then judge whether the number is exceeded. If it exceeds, it returns false, and if it does not exceed, it returns true.

```cpp
#include <iostream>

using namespace std;

int tdistance;
int rocknum;
int move_num;
int rocks[50010];

bool judge(int curr_ans){
    int curr_move = 0;
    int i = 0;// next rock
    int now = 0; //current rock
    while (i < rocknum+1){
        i++;
        if(rocks[i] - rocks[now] >= curr_ans)
            now = i;
        else
            curr_move++;
    }
    if (curr_move > move_num)
        return false;
    else
        return true;
}

int main(int argc, char const *argv[]){
    cin >> tdistance >> rocknum >> move_num;
    for (int i = 1; i <= rocknum; i++){
        cin >> rocks[i];
    }
    rocks[0] = 0;
    rocks[rocknum+1] = tdistance;

    int mstart = 1;
    int mends = tdistance;
    int mid;
    int ans;
    while(mstart <= mends){
        mid = (mstart + mends) / 2;
        if(judge(mid)){
            ans = mid;
            mstart = mid + 1;
        }
        else{
            mends = mid - 1;
        }
    }
    cout << ans << '\n';
    return 0;
}

```