---
title: Event Sourcing
description: Why and how LiveStore uses event sourcing for data flow, syncing and migrations.
sidebar:
  order: 8
---

- Similar to Redux but persisted and synced across devices
- Provides a more principled way to handle data instead of relying on mutable state
- Core idea: Separate read vs write model
  - Read model: App database (i.e. SQLite)
  - Write model: Ordered log of all mutation events
- Related topics
  - Domain driven design
- Benefits
  - Simple mental model
  - Preserves user intent
  - Scalable
  - Flexible
    - You can easily evolve the read model based on your query patterns as your app requirements change over time
  - Flexible merge conflicts resolution
	- Automatic migrations of the read model (i.e. app database)
    - Write model can also be evolved (e.g. via versioned mutations and optionally mapping old mutations to new ones)
  - History of all state changes is captured (e.g. for auditing and debugging)
	- Foundation for syncing
- Downsides
  - Slightly more boilerplate to manually define mutations
  - Need to be careful so eventlog doesn't grow too much

## LiveStore as an event-sourcing framework

While the benefits of event sourcing are compelling, building a robust system from scratch is complex and time-consuming. Developers often encounter pitfalls related to data consistency, schema migrations, and efficient state reconstruction.

LiveStore provides an off-the-shelf event sourcing solution designed for ease of use and correctness. It simplifies development by:

- Providing clear APIs for defining mutations (events).
- Automatically managing the event log persistence and ordering.
- Efficiently recomputing the state (e.g. SQLite database) from the eventlog via materializers.
- Handling complexities like automatic data migrations and offering strategies for conflict resolution during synchronization.

This allows you to leverage the power of event sourcing without needing to implement the underlying infrastructure and tackle common edge cases yourself.

## Further reading

- [The Log: What every software engineer should know about real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)