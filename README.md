# Contribution Service Frontend
This repository contains code for the [Contribution service App](https://contribution.olas.network/) frontend. Find the backend repository [here](https://github.com/valory-xyz/contribution-service).

## Tech Stack
- web3.js
- ReactJS
- NextJS
- Styled-components

## Installation and Setup Instructions

Clone down this repository. You will need `node` version ">=14" and `yarn` version ">=1" installed globally on your machine.

Installation:

`yarn`

To Start Server:

`yarn dev`

To Visit App:

`localhost:3000`

# Add to Calendar and Roadmap

## Calendar

To add an event to [the calendar](https://contribute.olas.network/calendar):

- add your event to [`events.json`](https://github.com/valory-xyz/autonolas-contribution-service-frontend/edit/main/components/Calendar/events.json)
- make a PR
- inform the community in [Discord](https://discord.com/channels/899649805582737479/1121019872839729152) for review

The event structure is as follows (all fields are required):

```
{
  "id": uuid – identifier – e.g. "1b7327b5-7b3b-4b90-93d0-b137b9713496",
  "title": string – event name –  e.g. "OLAS Token Deployed",
  "timestamp": string – unix timestamp – "1656584807",
  "location": string – URL or physical location – "https://etherscan.io/token/0x0001A500A6B18995B03f44bb040A5fFc28E45CB0#readContract",
  "description": string – more information about the event – "OLAS token has been deployed on the Ethereum mainnet."
}
```

## Roadmap

To add an item to [the roadmap](https://contribute.olas.network/roadmap):

- add your item to [`roadmapItems.json`](https://github.com/valory-xyz/autonolas-contribution-service-frontend/edit/main/components/Roadmap/roadmapItems.json)
- make a PR
- inform the community in [Discord](https://discord.com/channels/899649805582737479/1121019872839729152) for review

The roadmap item structure is as follows (all fields are required):

```
{
    "title": string – item name – e.g. "Build-A-PoSe",
    "tag": "WIP" || "Proposed" || "Approved" || "Implemented" || "Rejected",
    "description": string – what this item is about – "This workstream implements Build-A-PoSe, a structured programme operated by the DAO to consistently deliver new Olas-owned services.",
    "imageUrl": url – path to image – "https://github.com/valory-xyz/autonolas-aip/blob/aip-2/content/imgs/Build-A-PoSe.png?raw=true",
    "link": url – path to learn more about this item – "https://github.com/valory-xyz/autonolas-aip/blob/aip-2/content/aips/core-build-a-pose.md",
    "date": string - "2023-10-13"
  }
```