# Distributed ML guide validation

## Delivered scope

The approved curriculum is implemented at /mldomain/distributed: six Parts and 28
lessons, with 229 numbered internal sections and approximately 18,200 source words.
The parser recognizes 44 display equations, 23 comparison tables, 27 execution
diagrams, and 10 Python examples of at most five lines.

The guide introduces its neural, optimizer, accelerator, process, and network
prerequisites before applying them. Curriculum metadata records ordered dependencies;
lesson pages provide links to those prerequisites and previous/next lessons.
The domain selector, sitemap, canonical metadata, search, filters, chapter expansion,
mobile navigation, and independent distributed-topic progress are connected.

The study-guide variant of the shared hero omits the interview explanation.
Lesson pages use a technical overview without interview probes. There are no
quiz routes, advertised quizzes, interview-practice chapters, final review chapters,
or appended reading lists.

## Technical review decisions

- Collective costs state whether bytes are logical, per-rank sent, or aggregate;
  ring formulas assume compatible chunking and effective simultaneous-link bandwidth.
- Gradient aggregation and accumulation count valid samples/tokens, including unequal
  local counts and the division already performed by a data-parallel wrapper.
- State-sharding budgets distinguish persistent state from transient gathered
  parameters, gradients, activations, and communication buffers.
- Mixed-precision examples specify their actual state ledger rather than claiming
  every optimizer implementation uses the same bytes per parameter.
- Tensor partitioning includes backward communication; context partitioning includes
  the stable combination of separately normalized attention blocks.
- Pipeline schedules preserve a shared parameter version across an update;
  the bubble formula states balanced-stage and timing assumptions.
- Hybrid batch-size accounting multiplies independent data replicas, not workers
  collaborating on the same examples.
- Checkpoints include optimizer, randomness, scheduler/scaler, and consumed data
  state; publication requires all necessary shards to be durable.
- Inference formulas use key/value head count rather than assuming query head count;
  paging overhead, cache compatibility, and request recovery are explicit.

## Reproducible validation

Run npm run check:distributed for source and numerical validation.
Run npm run build, then npm run check:distributed -- --export for exported pages.
Run npm run lint for the repository lint checks.

The guide check verifies the exact approved titles and numbering, unique IDs,
prerequisite order, lesson presence, sequential internal sections, bounded lesson
and paragraph sizes, no duplicated long paragraphs, balanced fences, valid KaTeX
equations, rectangular tables, diagram classification, and Python syntax.

Independent calculations include scalar and matrix finite-difference gradients,
unequal-batch aggregation under a rank-averaging wrapper, simulated ring
Reduce-Scatter/All-Gather for 2/4/8 workers, row/column tensor partitions,
stable blockwise attention, state memory, pipeline utilization, expert capacity,
Amdahl scaling, overlap, global clipping, checkpoint frequency, queue concurrency,
paged allocation, and cache-transfer sizing.

Export checks cover the hub, all 28 lesson pages, prerequisite and sequential
links, canonical URLs, sitemap entries, math errors, and the existing domain switch.

Browser checks covered curriculum search with original lesson numbering, empty
results, completed-only filtering, progress persistence after reload, shared
hub/lesson completion state, previous/next navigation, prerequisite links, and
rendered narrow-screen equations and content. Temporary test completion was
restored to its original state.

Python syntax and mathematical checks do not execute distributed PyTorch jobs.
No multi-GPU, transport, checkpoint-storage, or serving-runtime benchmark is claimed.
Account synchronization uses the existing progress implementation; signed-out local
persistence was exercised in the browser.

## Editorial evidence

These are implementation-audit anchors, not an added reading-list section in the
learner-facing guide:

- PyTorch distributed data-parallel semantics:
  https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html
- PyTorch composable state sharding and mixed-precision policy:
  https://docs.pytorch.org/docs/stable/distributed.fsdp.fully_shard.html
- PyTorch accumulation and loss scaling:
  https://docs.pytorch.org/docs/stable/notes/amp_examples.html
- PyTorch pipeline schedules:
  https://docs.pytorch.org/docs/stable/distributed.pipelining.html
- PyTorch activation checkpointing:
  https://docs.pytorch.org/docs/main/utils/checkpoint.html
- PyTorch numerical accuracy:
  https://docs.pytorch.org/docs/main/notes/numerical_accuracy.html
- PyTorch distributed checkpointing and load-time resharding:
  https://docs.pytorch.org/docs/main/distributed.checkpoint.html
- Original ZeRO state-sharding work:
  https://arxiv.org/abs/1910.02054
- Sequence parallelism and selective activation recomputation:
  https://arxiv.org/abs/2205.05198
- FlashAttention and memory traffic:
  https://arxiv.org/abs/2205.14135
- Switch Transformers and routed expert computation:
  https://arxiv.org/abs/2101.03961
- PagedAttention and KV-cache allocation:
  https://arxiv.org/abs/2309.06180
- DistServe and disaggregated prefill/decode:
  https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin
