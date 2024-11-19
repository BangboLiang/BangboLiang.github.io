---
layout: post
title: How large is infinity in C?
subtitle: Really important.
tags: [Study, Code]
cover-img: /assets/img/background.png
thumbnail-img: /assets/img/math.jpg
comments: true
---

# How large is the infinity in C language?

I found that while using [Goolge's OR-Tools](https://developers.google.com/optimization)

```C
// Create the mip solver with the SCIP backend.
  std::unique_ptr<MPSolver> solver(MPSolver::CreateSolver("SCIP"));
  if (!solver) {
    LOG(WARNING) << "SCIP solver unavailable.";
    return;
  }

  const double infinity = solver->infinity();
```

In here, I was curious about how large is `solver->infinity()`? So I found its clarify.

```C
static double infinity() { return std::numeric_limits<double>::infinity(); }
```

Now, we continue, go deeper:
```C
static _GLIBCXX_CONSTEXPR double
infinity() _GLIBCXX_USE_NOEXCEPT { return __builtin_huge_val(); }
```
this is in `/usr/include/c++/12/limits`

Now we Continue to see what is `__builtin_huge_val()`:
```C
#define __builtin_huge_val() __cowchild_cast<double>(0x7ff0000000000000)
```

I found this in `/usr/include/cuda/std/climits`, it's obvious that OR-Tools will not call cuda, but the number seems to be same.

So, infinity = 0x7ff0000000000000 in hex, and 9,218,868,437,227,405,312 in dec.

That's funny :).