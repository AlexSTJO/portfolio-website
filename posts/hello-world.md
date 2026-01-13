---
title: "Building Flume: An Infra-Aware Workflow Engine"
date: "2025-01-13"
description: "Why I built a workflow orchestrator that actually knows about your infrastructure, and what I learned along the way."
---

This is my first blog post. I'll be writing about cloud engineering, automation, and the tools I build.

## Why Flume?

After working with various CI/CD and workflow tools, I kept running into the same problem: none of them really understood infrastructure. You either run Terraform separately and pray the outputs end up where you need them, or you write a bunch of shell scripts to glue everything together.

Flume started because I wanted a workflow engine that just **gets** infrastructure.

## How It Works

When you define a Terraform deployment in your pipeline, Flume handles it like any other step:

1. Runs `terraform plan` and `apply`
2. Grabs all the outputs
3. Lets downstream tasks reference them with `${infra:terraform.<output>}`

So your build tasks can pull S3 bucket names, CloudFront distribution IDs, or whatever else Terraform spits out—no manual wiring required.

## What's Next

I'm still adding to Flume: retry logic, better error messages, more integrations. I'll write more about the technical decisions as I go.
