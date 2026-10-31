---
layout: post
title: "Introducing LACE: breaking the duplex barrier"
subtitle: Lane-granularity optical circuit scheduling for large language model training.
description: How LACE independently schedules transmit and receive lanes to match the directional communication demands of LLM training.
tags: [Research, Optical Networks, LLM Training]
research_key: lace
permalink: /research/lace/
thumbnail-img: /assets/img/lace/lane-scheduling.png
share-img: /assets/img/lace/lane-scheduling.png
---

Our new preprint, **[Breaking the Duplex Barrier: Lane-Granularity OCS Scheduling for LLM Training](https://arxiv.org/abs/2609.14253)**, explores a simple question: if optical paths are directional, why must we always schedule them in symmetric pairs?

We introduce **LACE (Lane-level Circuit Scheduling)**, an offline compiler that turns a training communication schedule into physical optical connections. It allocates transmit (TX) and receive (RX) lanes independently, while preserving the selected collective algorithms, operation order, and rank placement.

[Read the paper on arXiv](https://arxiv.org/abs/2609.14253) · [Download the PDF](https://arxiv.org/pdf/2609.14253)

## The opportunity: traffic has a direction

Optical circuit switches (OCSes) let a network change its physical connectivity to suit a workload. Conventional demand-aware schedulers allocate duplex port pairs: adding capacity from A to B also adds the same capacity from B to A.

LLM training does not always need that symmetry. A data-parallel ring may send data to one neighbor and receive from another. Pipeline stages send activations forward and gradients backward in different windows. Even when a server sends and receives equal total volumes, individual node pairs can have very different demands in opposite directions.

The result is a mismatch: capacity can sit idle in one direction while the other direction remains a bottleneck. LACE treats each port's TX and RX lanes as separate resources, allowing them to connect to different peers. Here, a *lane* means one direction of a port's optical fiber pair, rather than a SerDes or wavelength lane inside a transceiver.

<figure class="paper-figure">
  <a href="{{ '/assets/img/lace/lane-scheduling.png' | relative_url }}" aria-label="Open the duplex and lane-level scheduling comparison at full size">
    <img src="{{ '/assets/img/lace/lane-scheduling.png' | relative_url }}" alt="Duplex scheduling assigns two circuits in each direction. Lane-level scheduling assigns three along the forward cycle and one in reverse, using the same four TX and four RX lanes per node." width="2121" height="559" loading="lazy">
  </a>
  <figcaption><strong>Same lanes, different allocation.</strong> With four TX and four RX lanes per node, conventional duplex matching gives a 2:2 split. Lane-level matching can instead give a 3:1 split to follow directional demand. Original paper, Figure 1. Click any figure to view it at full size.</figcaption>
</figure>

## From a training schedule to optical connections

Directionality is only part of the problem. Every connection consumes a source TX lane and a destination RX lane, and every topology change costs time. LACE therefore decides both **how to allocate lanes** and **when consecutive operations should share a configuration**.

Its compiler has four stages:

1. **Demand Profiler.** Expand communication operations into directed transfers, map ranks to server or switch nodes, and aggregate bytes by ordered node pair. Include calibrated control traffic so feedback also has capacity.
2. **Segment Planner.** Group consecutive operations and estimate fractional lane allocations. Keep a shared configuration when avoiding reconfiguration saves more time than a better traffic match would recover.
3. **Circuit Realizer.** Convert fractional targets into integer simplex-circuit counts while respecting each node's TX/RX inventory and preserving demanded directions. Check the resulting communication time against the planning tolerance.
4. **Lane Binder.** Assign physical lanes and optical paths. Reuse existing connections where possible, account for multi-OCS path constraints, and repair allocations or request replanning when necessary.

<figure class="paper-figure">
  <a href="{{ '/assets/img/lace/compiler-overview.png' | relative_url }}" aria-label="Open the four-stage LACE compiler diagram at full size">
    <img src="{{ '/assets/img/lace/compiler-overview.png' | relative_url }}" alt="LACE pipeline: Demand Profiler, Segment Planner, Circuit Realizer, and Lane Binder turn an ordered communication schedule into directed physical connections." width="1963" height="659" loading="lazy">
  </a>
  <figcaption><strong>The LACE compiler.</strong> Demand profiling, segment planning, integer realization, and physical binding connect the workload to the optical fabric. Original paper, Figure 4.</figcaption>
</figure>

Execution also needs endpoint support. The paper prototypes software acknowledgments over independently provisioned return paths, and coordinated link configuration and recovery that verify a configuration before communication resumes. These mechanisms accompany scheduling; optical flexibility alone does not guarantee that a particular NIC, module, and firmware combination will support different TX/RX peers.

## What we measured

### Three-server hardware testbed

We connect three GPU servers to an 8 × 8 Polatis OCS, with two 100-Gb/s ports per server. LACE and the symmetric ACTINA baseline each use a **fixed topology throughout the replay or training run**, with matched per-port rate limits and the same TCP striping policy.

- **Communication replay:** 28.03 → 15.60 seconds, a **1.80× speedup**, for the mixed DP/PP schedule of a LLaMA-3.1 8B workload.
- **GPT-2 training:** 3.61 → 2.84 hours, a **1.27× speedup**, for one GPT-2 Small fine-tuning epoch on WikiText-103.

The replay measurement is the median of two runs; the training result is one epoch per topology. These experiments demonstrate the value of asymmetric connectivity on this setup. They do not constitute a dynamically reconfigured, multi-NIC software-ACK training deployment: software-ACK performance and configuration recovery are evaluated separately.

<figure class="paper-figure paper-figure-compact">
  <a href="{{ '/assets/img/lace/testbed-results.png' | relative_url }}" aria-label="Open hardware testbed performance charts at full size">
    <img src="{{ '/assets/img/lace/testbed-results.png' | relative_url }}" alt="Hardware results: ACTINA versus LACE communication replay time is 28.03 versus 15.60 seconds; GPT-2 epoch time is 3.61 versus 2.84 hours. Lower is better." width="979" height="425" loading="lazy">
  </a>
  <figcaption><strong>Hardware results.</strong> Fixed-topology communication replay and GPT-2 training, compared with ACTINA. Lower is better. Original paper, Figure 5.</figcaption>
</figure>

### Larger-scale scheduling simulations

For LLaMA-3.1 70B and 405B schedules on **32–512 eight-GPU servers**, the main simulated configuration gives each server sixteen 400-Gb/s ports: 6.4 Tb/s in each direction. With a default modeled reconfiguration delay of 20 ms, LACE delivers **1.21–2.04× communication speedup over ACTINA** across these workloads.

These are **communication completion time (CCT)** results. The model excludes computation, compute/communication overlap, packet dynamics, and host-side transport processing limits. The measured hardware prototype has second-scale recovery; the millisecond-delay simulations assume faster recovery. The simulated gains should therefore be read as scheduling results, rather than end-to-end training speedups on today's prototype.

<figure class="paper-figure paper-figure-compact">
  <a href="{{ '/assets/img/lace/simulation-results.png' | relative_url }}" aria-label="Open large-scale communication completion time charts at full size">
    <img src="{{ '/assets/img/lace/simulation-results.png' | relative_url }}" alt="Four plots compare LACE, Symmetric LACE, ACTINA, and an ideal bound for 70B and 405B schedules at 32 to 512 servers, with sixteen 400-Gb/s or eight 800-Gb/s ports per server." width="1012" height="796" loading="lazy">
  </a>
  <figcaption><strong>Scaling the schedule.</strong> Full-schedule CCT for two port configurations with equal aggregate bandwidth per server. Lower is better. Original paper, Figure 8.</figcaption>
</figure>

## Where this leads

LACE shows why the direction of communication should be part of optical resource scheduling. The opportunity depends on the workload, rank placement, port inventory, and the demand that remains after aggregation. Practical deployment also depends on endpoint compatibility, return-path support, and recovery cost.

The current compiler plans an ordered schedule offline. Extending it to overlapping operations, dynamic expert routing, and a complete multi-NIC runtime are directions for further work.

## Paper and citation

**Breaking the Duplex Barrier: Lane-Granularity OCS Scheduling for LLM Training**<br>
Bangbo Liang, Yupeng Chen, Sicheng Zhao, Peihao Huang, Di Yang, Bohua Xu, Bin Yang, Shizhen Zhao, and Guo Chen.<br>
*arXiv preprint, first submitted September 13, 2026.*

[arXiv abstract](https://arxiv.org/abs/2609.14253) · [Full paper (PDF)](https://arxiv.org/pdf/2609.14253) · [HTML version](https://arxiv.org/html/2609.14253v1)

All four figures are reproduced from our paper, arXiv:2609.14253v1. The source figure numbers are retained in their captions.
