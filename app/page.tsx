"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MetaStatus = {
  build_status: string;
  infra_status: string;
  pull_status: string;
  upload_status: string;
};

function useMetaStatus() {
  const [meta, setMeta] = useState<MetaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/meta/meta.json", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as MetaStatus;
        setMeta(data);
      } catch {
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, []);

  return { meta, loading };
}

const projects = [
  {
    name: "Flume",
    label: "Flagship · Infra-aware workflow engine",
    description:
      "Go-based orchestration engine that runs cloud-native workflows as DAGs. Integrates with AWS and Terraform to plan, apply, and coordinate infrastructure-aware pipelines. This website's deployment is orchestrated via flume.",
    stack: ["Go", "AWS SDK v2", "Terraform", "YAML", "CRON", "REST APIs"],
    link: "https://github.com/AlexSTJO/flume", 
    featured: true,
  },
  {
    name: "Orca",
    label: "Cloud script runner",
    description:
      "Flask + Vue platform for uploading Python scripts, chaining them into pipelines, and executing workloads in the cloud on EC2 with S3-backed storage. This was my capstone project for Bachelor's degree. It was awarded a perfect score.",
    stack: ["Python", "Flask", "Boto3",  "Vue", "EC2", "S3", "SSM"],
    link: "https://github.com/AlexSTJO/orca-pipeline",
  },
  {
    name: "EC2 Scheduler",
    label: "Cost-optimization tool for Hilton",
    description:
      "Lambda and S3 based scheduler that starts and stops EC2 instances based on user-defined windows to reduce non-prod compute costs.",
    stack: ["Python", "AWS", "Lambda", "S3",  "Internal ALB Configuration", "Scheduling", "Cost Optimization"],
  },
  {
    name: "PEP Versioning Tool",
    label: "Internal automation for Hilton",
    description:
      "Automation powered by Bamboo that pulls observability data from Datadog APIs and publishes human-friendly status reports into Confluence.",
    stack: ["Python", "Datadog API", "Boto3", "Bamboo", "Confluence"],
  },
];

const experience = [
  {
    company: "Hilton",
    role: "Cloud Engineering Intern",
    period: "Jun 2024 — Jun 2025",
    description:
      "Built internal automation tooling for AWS environments, including EC2 cost-optimization, observability integrations, and infra-as-code workflows.",
    points: [
      "Utilized Boto3 to develop an API that provided temporary AWS credentials via Ping Federate and a SAML assertion",
      "Built a Python-based automation tool that tracks and versions project releases across environments, integrating with Datadog and Confluence for end-to-end visibility",
      "Created a Terraform-managed EC2 scheduler with Lambda and S3 to automate instance uptime to cut EC2 costs",
      "Developed and managed diverse range of services utilizing terraform, while keeping IaC clean and modular"
    ],
  },
  {
    company: "Tufts University",
    role: "Research Assistant",
    period: "Summer 2023",
    description:
      "Supported research projects with data processing and scripting abilities",
    points: [
      "Created an image analysis application that could perform operations on two images to create a redoxed output",
      "Manipulated data through NumPy, normalized and correlated large matrices of data",
      "Created a GUI using PyQT6 that allowed .TIF rendering within frame" 
    ],
  },
  {
  company: "Hackathons",
  role: "HackHarvard, HackBrown & SBUHack Winner",
  period: "2022 — 2023",
  description:
    "Built award-winning full-stack systems across AI, hardware, IoT, and backend automation—delivering production-style prototypes under 24–36 hour deadlines.",
  points: [
    "Developed Steno (HackBrown Winner), an AI-powered meeting assistant using Whisper + GPT-3 for real-time transcription, multi-session summarization, and a Python/Flask API integrated with a live Discord voice listener.",
    "Built Xeri (SBUHack Winner), a custom therapeutic input glove using ESP32, analog sensors, and gyroscope data to translate fine-motor hand movements into computer commands—focused on accessibility and low-cost rehabilitation.",
    "Created HomeNet (HackHarvard Winner), a modular IoT home-automation system with facial recognition, voice command detection, an optimized Python hub server, and a device SDK enabling new IoT devices in ~10 lines of code.",
    "Worked on backend architecture, hardware integration, and API development across all projects, rapidly learning new frameworks (OpenCV, hardware libraries, AngularJS, Whisper) under tight time constraints.",
  ],
  devpost: "https://devpost.com/AlexSTJO",
}];

const skills = [
  "AWS (EC2, S3, IAM, CloudFront)",
  "Terraform & IaC",
  "Go & Python",
  "Next.js & TypeScript",
  "Automation & Orchestration",
  "Observability & Dashboards",
  "Flask & REST APIs"
];

export default function Home() {

  const { meta, loading: metaLoading } = useMetaStatus();
  const health =
  !meta
    ? "unknown"
    : meta.build_status === "true" && meta.upload_status === "true"
    ? "healthy"
    : meta.build_status === "true"
    ? "degraded"
    : "failing";

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Subtle dot grid background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,_rgb(51_65_85_/_0.3)_1px,_transparent_0)] bg-[size:24px_24px]" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <header className="mb-8 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-700 bg-slate-900 text-sm font-mono font-semibold text-sky-400">
                AS
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-slate-100">
                  Alexandros St. John
                </p>
                <p className="text-xs text-slate-400">
                  Cloud Engineer & Automation Developer
                </p>
              </div>
            </div>

            <nav className="hidden gap-6 text-sm font-mono text-slate-400 md:flex">
              <a href="#projects" className="hover:text-sky-400">
                projects
              </a>
              <a href="#experience" className="hover:text-sky-400">
                experience
              </a>
              <a href="#about" className="hover:text-sky-400">
                about
              </a>
              <Link href="/blog" className="hover:text-sky-400">
                blog
              </Link>
              <a href="#contact" className="hover:text-sky-400">
                contact
              </a>
            </nav>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-slate-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              status: open to Cloud / Platform / DevOps roles (EU)
            </span>
          </div>
        </header>

        <section className="mb-14 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Cloud Engineer
              <span className="block text-sky-400">
                Open Source Dev
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              I build automation tools and write infrastructure code.
              Creator of <span className="font-semibold text-sky-300">Flume</span>,
              a workflow orchestrator written in Go.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-sm border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
              >
                View projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-sm border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
              >
                Contact
              </a>
            </div>

            <ul className="mt-6 space-y-1 font-mono text-xs text-slate-500">
              <li>· AWS SAA-C03 Certified</li>
              <li>· 1 year Cloud Engineering @ Hilton</li>
              <li>· Research Assistant @ Tufts University</li>
              <li>· HackHarvard, HackBrown, & SBUHacks winner</li>
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-sm border border-sky-500/30 border-l-sky-500 border-l-2 bg-slate-900 p-4 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
              <div className="mb-3 flex items-center justify-between font-mono text-xs">
                <span className="text-sky-400">pipeline/portfolio-deploy</span>
                <span
                  className={`flex items-center gap-1.5 ${
                    health === "healthy"
                      ? "text-emerald-400"
                      : health === "degraded"
                      ? "text-amber-400"
                      : health === "failing"
                      ? "text-rose-400"
                      : "text-slate-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      health === "healthy"
                        ? "bg-emerald-400"
                        : health === "degraded"
                        ? "bg-amber-400"
                        : health === "failing"
                        ? "bg-rose-400"
                        : "bg-slate-400"
                    }`}
                  />
                  {metaLoading
                    ? "checking"
                    : health}
                </span>
              </div>

              <div className="relative grid grid-cols-3 gap-3">
                <PipelineNode
                  title="checkout"
                  subtitle="Git clone"
                  color="sky"
                  status={
                    meta?.pull_status === "true"
                      ? "done"
                      : metaLoading
                      ? "running"
                      : "pending"
                  }
                />
                <PipelineNode
                  title="build"
                  subtitle="Next static build"
                  color="amber"
                  status={
                    meta?.build_status === "true"
                      ? "done"
                      : metaLoading
                      ? "running"
                      : "pending"
                  }
                />
                <PipelineNode
                  title="deploy"
                  subtitle="S3 + CloudFront"
                  color="emerald"
                  status={
                    meta?.upload_status === "true"
                      ? "done"
                      : metaLoading
                      ? "running"
                      : "pending"
                  }
                />
              </div> 
              <div className="mt-4">
                <DeploymentMetaCard meta={meta} loading={metaLoading} />
              </div>

              <p className="mt-3 font-mono text-[10px] text-slate-500">
                Powered by Flume — Terraform → build → S3 → CloudFront
              </p>

              <Link
                href="/pipeline"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-sky-400 hover:text-sky-300"
              >
                view pipeline.yaml →
              </Link>
            </div>
          </div>
        </section>

        <section id="projects" className="mb-16">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Projects
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Infra tooling, automation, and cloud-native systems.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.name}
                className={`group rounded-sm border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-600 ${
                  project.featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-100">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-sky-400 hover:text-sky-300"
                    >
                      github ↗
                    </a>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-xs text-slate-500">{project.label}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="mb-16">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Experience
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Where I&apos;ve shipped tooling and automation.
          </p>

          <div className="mt-6 space-y-4">
            {experience.map((job) => (
              <article
                key={job.company}
                className="rounded-sm border border-slate-800 bg-slate-900/50 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {job.role}
                    </h3>
                    <p className="font-mono text-xs text-slate-500">{job.company}</p>
                  </div>
                  <p className="font-mono text-xs text-slate-500">{job.period}</p>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {job.description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-slate-400">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {job.devpost && (
                  <p className="mt-3">
                    <a
                      href={job.devpost}
                      target="_blank"
                      className="font-mono text-xs text-sky-400 hover:text-sky-300"
                    >
                      devpost.com/AlexSTJO ↗
                    </a>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="mb-16">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            About
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] items-start">
            <div className="space-y-4">
              <div className="text-sm text-slate-400 leading-relaxed">
                <p>
                  Cloud engineer with a CS degree and math minor. I build tools
                  that make cloud infrastructure easier to work with. Most of my time goes into
                  automation, Terraform, and writing code that other engineers won&apos;t hate me for.
                </p>
                <p className="mt-3">
                  Go + AWS + Terraform is my usual stack. I care about good logging and
                  pipelines that actually work. Sometimes I build frontends too, like this site.
                </p>
              </div>

              <div>
                <h3 className="font-mono text-xs text-slate-500 uppercase">
                  stack
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-sm border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-slate-500">
                <h3 className="font-mono text-xs uppercase">
                  outside work
                </h3>
                <p className="mt-2 text-slate-400">
                  I lift regularly and play volleyball when I can find a court. Big reader of history,
                  especially ancient Greek and Roman. Dual U.S.–Greek citizen, so I spend time around
                  the Mediterranean when possible. The photo is from Samothrace.
                </p>
                <p className="mt-2">
                  I also write small scripts and tools for fun. Automating random stuff is
                  basically a hobby at this point.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="/images/me.webp"
                alt="Alex standing near ancient ruins in Samothrace"
                className="w-full max-w-xs rounded-sm border border-slate-700 object-cover"
              />
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mt-auto border-t border-slate-800 pt-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-100">
                Get in touch
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Open to remote Cloud, Platform, or DevOps roles.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:alexandros.georgakoudi@gmail.com"
                className="inline-flex items-center justify-center rounded-sm border border-sky-500 bg-sky-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
              >
                Email
              </a>
              <a
                href="https://github.com/AlexSTJO"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500"
              >
                github
              </a>
              <a
                href="https://www.linkedin.com/in/alexstjohn1/"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500"
              >
                linkedin
              </a>
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] text-slate-600">
            © {new Date().getFullYear()} Alexandros St. John · Next.js · Tailwind · Deployed via Flume
          </p>
        </section>
      </div>
    </main>
  );
}

type PipelineStatus = "done" | "running" | "pending";
type PipelineColor = "sky" | "amber" | "emerald";

function PipelineNode({
  title,
  subtitle,
  status,
  color,
}: {
  title: string;
  subtitle: string;
  status: PipelineStatus;
  color: PipelineColor;
}) {
  const colorStyles: Record<PipelineColor, { active: string; done: string }> = {
    sky: { active: "border-sky-500/50 text-sky-400", done: "border-sky-500/30 text-sky-400/70" },
    amber: { active: "border-amber-500/50 text-amber-400", done: "border-amber-500/30 text-amber-400/70" },
    emerald: { active: "border-emerald-500/50 text-emerald-400", done: "border-emerald-500/30 text-emerald-400/70" },
  };

  const style = status === "done"
    ? colorStyles[color].done
    : status === "running"
    ? colorStyles[color].active
    : "border-slate-700 text-slate-500";

  return (
    <div
      className={`rounded-sm border bg-slate-900 px-2 py-2 font-mono text-[10px] ${style}`}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-0.5 text-slate-500">{subtitle}</p>
    </div>
  );
}





function DeploymentMetaCard({
  meta,
  loading,
}: {
  meta: MetaStatus | null;
  loading: boolean;
}) {
  const buildOk = meta?.build_status === "true";
  const pullOk = meta?.pull_status === "true";
  const uploadOk = meta?.upload_status === "true";

  return (
    <div className="mt-3 border-t border-slate-800 pt-3 font-mono text-[10px]">
      {loading ? (
        <p className="text-slate-500">fetching meta...</p>
      ) : !meta ? (
        <p className="text-slate-500">
          no meta found — meta/meta.json not written yet
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 text-slate-400">
            <span className={buildOk ? "text-emerald-400" : "text-rose-400"}>
              build: {buildOk ? "ok" : "fail"}
            </span>
            <span className={pullOk ? "text-emerald-400" : "text-rose-400"}>
              git: {pullOk ? "ok" : "fail"}
            </span>
            <span className={uploadOk ? "text-emerald-400" : "text-rose-400"}>
              s3: {uploadOk ? "ok" : "fail"}
            </span>
          </div>
          {meta.infra_status && (
            <p className="mt-2 text-slate-500">
              infra: {meta.infra_status}
            </p>
          )}
        </>
      )}
    </div>
  );
}
