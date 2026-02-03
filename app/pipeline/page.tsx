"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const pipelineYaml = `name: "portfolio-website"
trigger:
  type: "api"
log_path: ""

infrastructure:
  tfdeploy:
    service: terraform
    action: sync
    repo: "git@github.com:AlexSTJO/portfolio-website-architecture.git"
    var-file: "terraform.tfvars"

tasks:
  git_pull:
    version: 1
    service: git
    dependencies: []
    parameters:
      repo_url: "git@github.com:AlexSTJO/portfolio-website"

  build:
    version: 1
    service: shell
    dependencies: ["git_pull"]
    parameters:
      command: |
        cd \${context:git_pull.repo_folder}
        npm install
        npm run build

  upload:
    version: 1
    service: s3_upload
    dependencies: ["build"]
    parameters:
      bucket: \${infra:terraform.site_bucket_name}
      source: \${context:git_pull.repo_folder}/out
      prefix: "build/"

  meta:
    version: 1
    service: json_writer
    dependencies: ["upload"]
    parameters:
      file_name: "meta.json"
      data:
        infra_status: \${infra:terraform.deploy_success}
        pull_status: \${context:git_pull.success}
        build_status: \${context:build.success}
        upload_status: \${context:upload.success}

  meta_upload:
    version: 1
    service: s3_upload
    dependencies: ["meta"]
    parameters:
      bucket: \${infra:terraform.site_bucket_name}
      source: \${context:meta.json_path}
      prefix: "build/meta/"

  cf_invalidate:
    version: 1
    service: cloudfront_invalidate
    dependencies: ["meta_upload"]
    parameters:
      dist_id: \${infra:terraform.dist_id}
      paths: ["/*"]

  end_message:
    version: 1
    service: shell
    dependencies: ["cf_invalidate"]
    parameters:
      command: "echo \${infra:terraform.deploy_success} with url of \${infra:terraform.portfolio_url}"`;

function highlightYaml(yaml: string): React.ReactNode[] {
  return yaml.split("\n").map((line, i) => {
    let highlighted: React.ReactNode = line;

    // Comments
    if (line.trim().startsWith("#")) {
      highlighted = <span className="text-slate-500 italic">{line}</span>;
    }
    // Key-value pairs
    else if (line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const key = line.slice(0, colonIndex);
      const rest = line.slice(colonIndex);

      // Check if value is a string in quotes
      const valueMatch = rest.match(/^(:\s*)(".*"|'.*')(.*)$/);
      if (valueMatch) {
        highlighted = (
          <>
            <span className="text-sky-400">{key}</span>
            <span className="text-slate-500">{valueMatch[1]}</span>
            <span className="text-emerald-400">{valueMatch[2]}</span>
            <span className="text-slate-300">{valueMatch[3]}</span>
          </>
        );
      }
      // Check for ${...} interpolations
      else if (rest.includes("${")) {
        const parts = rest.split(/(\$\{[^}]+\})/g);
        highlighted = (
          <>
            <span className="text-sky-400">{key}</span>
            {parts.map((part, j) =>
              part.startsWith("${") ? (
                <span key={j} className="text-amber-400">
                  {part}
                </span>
              ) : (
                <span key={j} className="text-slate-300">
                  {part}
                </span>
              )
            )}
          </>
        );
      }
      // Check for array values like ["/*"]
      else if (rest.includes("[")) {
        const bracketMatch = rest.match(/^(:\s*)(\[.*\])(.*)$/);
        if (bracketMatch) {
          highlighted = (
            <>
              <span className="text-sky-400">{key}</span>
              <span className="text-slate-500">{bracketMatch[1]}</span>
              <span className="text-amber-400">{bracketMatch[2]}</span>
              <span className="text-slate-300">{bracketMatch[3]}</span>
            </>
          );
        } else {
          highlighted = (
            <>
              <span className="text-sky-400">{key}</span>
              <span className="text-slate-300">{rest}</span>
            </>
          );
        }
      }
      // Numbers
      else if (rest.match(/^:\s*\d+\s*$/)) {
        const numMatch = rest.match(/^(:\s*)(\d+)(\s*)$/);
        if (numMatch) {
          highlighted = (
            <>
              <span className="text-sky-400">{key}</span>
              <span className="text-slate-500">{numMatch[1]}</span>
              <span className="text-amber-300">{numMatch[2]}</span>
            </>
          );
        }
      }
      // Just a key with no value or object start
      else {
        highlighted = (
          <>
            <span className="text-sky-400">{key}</span>
            <span className="text-slate-300">{rest}</span>
          </>
        );
      }
    }
    // Lines starting with - (array items)
    else if (line.trim().startsWith("-")) {
      highlighted = <span className="text-slate-300">{line}</span>;
    }
    // Pipe for multiline
    else if (line.trim() === "|") {
      highlighted = <span className="text-amber-400">{line}</span>;
    }

    return (
      <div key={i} className="table-row group">
        <span className="table-cell pr-4 text-right text-slate-600 select-none group-hover:text-slate-500 transition-colors w-8">
          {i + 1}
        </span>
        <span className="table-cell">{highlighted}</span>
      </div>
    );
  });
}

const pipelineSteps = [
  { id: "infra", label: "terraform", icon: "1" },
  { id: "git", label: "git", icon: "2" },
  { id: "build", label: "build", icon: "3" },
  { id: "upload", label: "s3", icon: "4" },
  { id: "meta", label: "meta", icon: "5" },
  { id: "invalidate", label: "cdn", icon: "6" },
];

export default function PipelinePage() {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Subtle dot grid background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,_rgb(51_65_85_/_0.3)_1px,_transparent_0)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        {/* Header */}
        <div
          className={`transition-opacity duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-sky-400 transition-colors mb-8"
          >
            ← back
          </Link>

          <div className="mb-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-slate-100">
              Deployment Pipeline
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              The Flume pipeline that builds and deploys this site to AWS.
            </p>
          </div>
        </div>

        {/* Pipeline flow visualization */}
        <div
          className={`mb-6 transition-opacity duration-500 delay-100 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-sm border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-center gap-2">
              {pipelineSteps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-sm border font-mono text-xs transition-colors ${
                        activeStep === i
                          ? "border-sky-500 text-sky-400 bg-sky-500/10"
                          : activeStep > i
                          ? "border-emerald-500/50 text-emerald-400"
                          : "border-slate-700 text-slate-500"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className="mt-1.5 font-mono text-[10px] text-slate-600">
                      {step.label}
                    </span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div
                      className={`w-8 h-px mx-2 -mt-5 transition-colors ${
                        activeStep > i ? "bg-emerald-500/50" : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YAML viewer */}
        <div
          className={`transition-opacity duration-500 delay-200 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-sm border border-slate-800 bg-slate-900/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
              <span className="font-mono text-sm text-slate-300">
                portfolio-website.yaml
              </span>
              <a
                href="https://github.com/AlexSTJO/flume"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-slate-500 hover:text-sky-400 transition-colors"
              >
                flume ↗
              </a>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono">
              <code className="table">{highlightYaml(pipelineYaml)}</code>
            </pre>
          </div>
        </div>

        {/* Steps explanation */}
        <div
          className={`mt-6 transition-opacity duration-500 delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-sm border border-slate-800 bg-slate-900/50 p-4">
            <p className="font-mono text-xs text-slate-500 mb-4">steps</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { n: "1", title: "terraform", desc: "Provision S3 bucket and CloudFront" },
                { n: "2", title: "git", desc: "Clone portfolio-website repo" },
                { n: "3", title: "build", desc: "npm install && npm run build" },
                { n: "4", title: "s3", desc: "Sync build output to S3" },
                { n: "5", title: "meta", desc: "Write deployment status to meta.json" },
                { n: "6", title: "cdn", desc: "Invalidate CloudFront cache" },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <span className="font-mono text-xs text-slate-600 w-4">{item.n}.</span>
                  <div>
                    <p className="font-mono text-xs text-slate-300">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
