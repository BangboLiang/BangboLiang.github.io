---
layout: post
title: A lightweight, extremely short-interval RDMA performance testing tool!
subtitle: Lightweight, easy to use, and accurate.
tags: [Code,Cpp,Perftest,Study]
cover-img: /assets/img/road_light.jpg
thumbnail-img: /assets/img/AIcomments2.png
comments: true
---

# An RDMA perftest tool is open source now.

A lightweight, extremely short-interval RDMA performance testing tool.

## What you need before using this tool
1. You may need an RDMA Network interface card, with two different virtual machines, or you can use two different physical machines, each one has an RDMA NIC.
2. We used standard IB verbs, you can use OFED driver to enable your RDMA NIC.
3. If you don't have any RDMA physical devices, you can also try Soft-RDMA.

## Brief introduction
This test tool provides performance tests for various RDMA operations. Users can customize the use of any port and gid of any device, and can specify precise test cycles (**microsecond level**). Users can also specify the batch size and message size of the test.


## How to use
You can find my RDMA perftest tool in my github repo:
[RDMAperf](https://github.com/BangboLiang/RDMA-perftest "Very useful tool")


### 1. Use git tool to download source code to you local machine:
```bash
git clone https://github.com/BangboLiang/RDMA-perftest.git
```

### 2. Compile the source code, take version 8 as an example: (library: ibverbs and pthread is needed.)
```bash
gcc -O2 -o MyPerfv8 MyPerfv8.c -libverbs -lpthread
```
### 3. For client, type:
```bash
./MyPerfv8 [options] [server ip address]
```
Such as:
```bash
./MyPerfv8 -d mlx5_2 -i 1 -g 3 -t 100 -o 0 -m 65536 -p 9923 192.20.21.6
```
### 4. For server, type:
```bash
./MyPerfv8 [options]
```
Such as:
```bash
./MyPerfv8 -d mlx5_2 -i 1 -g 3 -t 100 -o 0 -m 65536 -p 9923
```

