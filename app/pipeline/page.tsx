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
                <span key={j} className="text-purple-400">
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
      highlighted = <span className="text-purple-400">{line}</span>;
    }

    return (
      <div key={i} className="table-row group">
        <span className="table-cell pr-4 text-right text-slate-600 select-none group-hover:text-slate-500 transition-colors">
          {i + 1}
        </span>
        <span className="table-cell">{highlighted}</span>
      </div>
    );
  });
}

const pipelineSteps = [
  { id: "infra", label: "Terraform", icon: "⚙️", color: "purple" },
  { id: "git", label: "Git Clone", icon: "📥", color: "sky" },
  { id: "build", label: "Build", icon: "🔨", color: "amber" },
  { id: "upload", label: "S3 Upload", icon: "☁️", color: "emerald" },
  { id: "meta", label: "Meta", icon: "📝", color: "sky" },
  { id: "invalidate", label: "CDN Invalidate", icon: "🚀", color: "purple" },
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
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl animate-pulse" />
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
                <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300 transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to home
          </Link>

          <div className="mb-12 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-sky-500 via-purple-500 to-transparent" />

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 mb-5 shadow-lg shadow-sky-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Live deployment config
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-slate-100">
              Deployment Pipeline
            </h1>

            <p className="mt-5 text-lg text-slate-400 max-w-2xl leading-relaxed">
              The actual <span className="text-sky-300 font-medium">Flume</span> pipeline that builds and deploys this website to AWS. Infrastructure provisioning, static build, S3 sync, and CDN invalidation in one declarative workflow.
            </p>
          </div>
        </div>

                <div
          className={`mb-8 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Pipeline Flow
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-6 py-4">
              {pipelineSteps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="relative flex flex-col items-center">
                    {activeStep === i && (
                      <div className="absolute -inset-4 rounded-2xl bg-sky-500/20 blur-xl animate-pulse" />
                    )}
                    <div
                      className={`relative z-10 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border text-lg md:text-xl transition-all duration-500 ${
                        activeStep === i
                          ? "border-sky-400/50 bg-sky-500/20 shadow-lg shadow-sky-500/30 scale-110"
                          : activeStep > i
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-slate-700 bg-slate-800/50"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`mt-2 text-[9px] md:text-[10px] font-medium whitespace-nowrap transition-colors ${
                        activeStep === i
                          ? "text-sky-300"
                          : activeStep > i
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex items-center ml-4 md:ml-6 -mt-5">
                      <div
                        className={`h-0.5 w-4 md:w-6 transition-all duration-500 ${
                          activeStep > i
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : "bg-slate-700"
                        }`}
                      />
                      <div
                        className={`h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent transition-colors ${
                          activeStep > i ? "border-l-emerald-400" : "border-l-slate-700"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

                <div
          className={`transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 shadow-2xl shadow-sky-500/10 backdrop-blur-xl overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/90 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-200">
                  portfolio-website.yaml
                </span>
              </div>
              <a
                href="https://github.com/AlexSTJO/flume"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1 text-xs text-slate-400 hover:text-sky-300 hover:border-sky-500/30 transition-all"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Powered by Flume
              </a>
            </div>

                        <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none z-10" />
              <pre className="overflow-x-auto p-6 text-sm leading-relaxed font-mono">
                <code className="table">{highlightYaml(pipelineYaml)}</code>
              </pre>
            </div>
          </div>
        </div>

                <div
          className={`mt-8 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-purple-400" />
              How it works
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  step: "1",
                  title: "Infrastructure",
                  desc: "Terraform provisions the S3 bucket and CloudFront distribution",
                  color: "purple",
                },
                {
                  step: "2",
                  title: "Git Pull",
                  desc: "Clones the portfolio-website repo using GitHub App auth",
                  color: "sky",
                },
                {
                  step: "3",
                  title: "Build",
                  desc: "Runs npm install and npm run build for static export",
                  color: "amber",
                },
                {
                  step: "4",
                  title: "Upload",
                  desc: "Syncs the build output to S3 with the correct prefix",
                  color: "emerald",
                },
                {
                  step: "5",
                  title: "Meta",
                  desc: "Writes deployment status to meta.json for live status display",
                  color: "sky",
                },
                {
                  step: "6",
                  title: "Invalidate",
                  desc: "Clears the CloudFront cache so changes go live instantly",
                  color: "purple",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        item.color === "purple"
                          ? "bg-purple-500/20 text-purple-300"
                          : item.color === "sky"
                          ? "bg-sky-500/20 text-sky-300"
                          : item.color === "amber"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {item.step}
                    </span>
                    <div>
                      <h4 className="font-medium text-slate-200">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                    </div>
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
