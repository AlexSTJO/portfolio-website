"use client";
// hello, this website has swag, not a front end dev but with a little deep dive in the docs and some caffeinated AI-powered coding sessions we got something
// also this is deployed via a cloud workflow orchestrator I created that integrates terraform deployments into a step function like orchestrator
// cheeky little passion project
import { useEffect, useState } from "react";
import Image from "next/image";

<Image
  src="/images/me.webp"
  alt="Alex standing near ancient ruins in Samothrace"
  width={800}
  height={1200}
  className="rounded-3xl border border-slate-700/70 shadow-md shadow-sky-900/30 object-cover"
/>

type DeployStatus = {
  pipeline: string;
  status: "healthy" | "degraded" | "failing";
  lastRun: string;
  branch: string;
  region: string;
  commit: string;
  steps: {
    checkout: "done" | "running" | "pending";
    build: "done" | "running" | "pending";
    deploy: "done" | "running" | "pending";
  };
};

function useDeployStatus() {
  const [status, setStatus] = useState<DeployStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/meta/portfolio-status.json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Bad response");
        const data = (await res.json()) as DeployStatus;
        setStatus(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return { status, loading, error };
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
    name: "Datadog → Confluence Sync",
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

  const { status: deployStatus, loading: deployLoading } = useDeployStatus();

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.09),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.09),_transparent_55%)]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sm font-semibold text-sky-300">
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

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#projects" className="hover:text-sky-300">
              Projects
            </a>
            <a href="#experience" className="hover:text-sky-300">
              Experience
            </a>
            <a href="#about" className="hover:text-sky-300">
              About
            </a>
            <a href="#contact" className="hover:text-sky-300">
              Contact
            </a>
          </nav>
        </header>

        <section className="mb-20 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 shadow-sm shadow-sky-500/10">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to Cloud / Platform / DevOps roles (US/EU)
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              I build cloud-native automation
              <span className="block bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                that actually ships.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              Cloud engineer with a focus on workflow engines, infra-as-code,
              and cost-saving automation. Creator of{" "}
              <span className="font-semibold text-sky-300">Flume</span>, an
              infra-aware workflow orchestrator written in Go.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-slate-50 shadow-lg shadow-sky-500/30 transition hover:brightness-110"
              >
                View Flume & projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:border-sky-400/70 hover:text-sky-200"
              >
                Get in touch
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                AWS SAA-C03 Certified
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                1 year Cloud Engineering @ Hilton
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                Research Assistant @ Tufts University
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                HackHarvard, HackBrown, & SBUHacks winner
              </span> 
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-4 h-32 w-32 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-purple-500/30 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-2xl shadow-sky-500/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2 font-medium text-slate-200">
                  Pipeline · {deployStatus?.pipeline ?? "portfolio-deploy"}
                  <span
                    className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-300"
                    title="This Flume pipeline automatically rebuilds and deploys this portfolio."
                  >
                    Deploys this site
                  </span>
                </span>

                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                    (deployStatus?.status ?? "healthy") === "healthy"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : (deployStatus?.status ?? "healthy") === "degraded"
                      ? "bg-amber-500/10 text-amber-300"
                      : "bg-rose-500/10 text-rose-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      (deployStatus?.status ?? "healthy") === "healthy"
                        ? "bg-emerald-300"
                        : (deployStatus?.status ?? "healthy") === "degraded"
                        ? "bg-amber-300"
                        : "bg-rose-300"
                    }`}
                  />
                  {deployLoading
                    ? "Checking…"
                    : deployStatus?.status === "healthy"
                    ? "Healthy"
                    : deployStatus?.status === "degraded"
                    ? "Degraded"
                    : deployStatus?.status === "failing"
                    ? "Failing"
                    : "Unknown"}
                </span>
              </div>

              {/* Node graph */}
              <div className="relative grid grid-cols-3 gap-4">
                <PipelineNode
                  title="checkout"
                  subtitle="Git clone"
                  status={deployStatus?.steps.checkout ?? "done"}
                />
                <PipelineNode
                  title="build"
                  subtitle="Next export"
                  status={deployStatus?.steps.build ?? "running"}
                />
                <PipelineNode
                  title="deploy"
                  subtitle="S3 + CloudFront"
                  status={deployStatus?.steps.deploy ?? "pending"}
                />
              </div>


              <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                <StatusCard label="Next.js" value="Static export" accent="sky" />
                <StatusCard
                  label="Flume task"
                  value={deployStatus?.pipeline ?? "portfolio-deploy"}
                  accent="purple"
                />
                <StatusCard
                  label="Region"
                  value={deployStatus?.region ?? "us-east-1"}
                  accent="emerald"
                />
                <StatusCard
                  label="Last deploy"
                  value={
                    deployStatus?.lastRun
                      ? new Date(deployStatus.lastRun).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : deployLoading
                      ? "Checking…"
                      : "Not yet deployed"
                  }
                  accent="slate"
                />
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                Powered by{" "}
                <span className="font-semibold text-sky-300">
                  Flume
                </span>{" "}
                — this pipeline checks out the repo, builds the Next.js app, and deploys this
                portfolio to S3/CloudFront.
              </p>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Projects
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Infra-aware tooling, automation, and cloud-native systems I&apos;ve
                built.
              </p>
            </div>
            <div className="hidden rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 md:inline-flex">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Focused on automation & developer experience
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.name}
                className={`group relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-md shadow-sky-900/50 backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-500/70 hover:shadow-sky-500/40 ${
                  project.featured ? "md:col-span-2" : ""
                }`}
              >
                {project.featured && (
                  <div className="mb-3 inline-flex items-center rounded-full bg-sky-500/10 px-2 py-1 text-[11px] font-medium text-sky-300">
                    Featured
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-50">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{project.label}</p>
                <p className="mt-3 text-sm text-slate-300">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/90 px-2.5 py-1 text-[11px] text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200"
                    >
                      View on GitHub
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                  <span className="text-slate-500">
                    Built for real-world automation use cases
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Experience
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Roles where I&apos;ve shipped tooling, automation, and platforms that
            people actually use.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[0.25fr_minmax(0,1fr)]">
            {/* Timeline line */}
            <div className="relative hidden md:block">
              <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-sky-500/50 via-slate-700/80 to-purple-500/50" />
            </div>

            <div className="space-y-6">
              {experience.map((job, idx) => (
                <article
                  key={job.company}
                  className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-md shadow-sky-900/40 backdrop-blur-xl"
                >
                  {/* Dot on line */}
                  <div className="absolute -left-4 top-6 hidden h-3 w-3 rounded-full border border-sky-300 bg-slate-950 md:block" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                        {job.role}
                      </h3>
                      <p className="text-xs text-slate-400">{job.company}</p>
                    </div>
                    <p className="text-xs text-slate-400">{job.period}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {job.description}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-sky-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                    {job.devpost && (
                      <p className="mt-3">
                        <a
                          href={job.devpost}
                          target="_blank"
                          className="text-xs text-sky-300 underline hover:text-sky-200"
                        >
                          View my hackathon projects on Devpost ↗
                        </a>
                      </p>
                    )}
                  <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-500">
                    {idx === 0
                      ? "Most recent · heavy AWS & automation focus"
                      : "Hands-on software experience"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            About
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            A bit more about who I am and how I like to build.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-start">
  
            {/* LEFT COLUMN (stacked cards) */}
            <div className="space-y-6">
              
              {/* About Text */}
              <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-md shadow-sky-900/40 backdrop-blur-xl">
                <p className="text-sm text-slate-300">
                  I'm a cloud engineer and Computer Science graduate with a Math minor who loves
                  building tools that make infrastructure feel less chaotic. I focus on automation,
                  infrastructure as code, and developer experience — the glue that turns services
                  into reliable systems.
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  My favorite stack for infra-heavy work is Go + AWS SDK + Terraform, backed by clear
                  logging, pipelines, and good ergonomics for other engineers. I also enjoy crafting
                  clean frontends with Next.js when it helps tell the story of the systems behind them.
                </p>
              </div>

              {/* Skills */}
              <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 text-sm text-slate-300 shadow-md shadow-sky-900/40 backdrop-blur-xl">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Skills & tools
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-800/90 px-2.5 py-1 text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outside of Work */}
              <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 text-sm text-slate-300 shadow-md shadow-sky-900/40 backdrop-blur-xl">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Outside of work
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  I like lifting, playing volleyball, and reading history. I'm a
                  dual U.S.–Greek citizen and I love traveling, especially around the Mediterranean.
                  I still code for fun in my free time, often building small automation scripts to
                  make everyday tasks a little easier.
                </p>                
              </div>

            </div>

            {/* RIGHT COLUMN (photo) */}
            <div className="relative flex justify-center">              
               <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-sky-500/20 blur-3xl" />
              <img
                src="/images/me.webp"
                alt="Alex standing near ancient ruins in Samothrace"
                className="w-full max-w-xs md:max-w-sm rounded-3xl border border-slate-700/70 shadow-md shadow-sky-900/30 object-cover"
              />
            </div>

          </div>

        </section>

        {/* Contact / Footer */}
        <section
          id="contact"
          className="mt-auto rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-md shadow-sky-900/40 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Let&apos;s build something automated.
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                I&apos;m open to remote Cloud, Platform, or DevOps roles where I can
                design and own automation tooling.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:alexandros.georgakoudi@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-sky-500/40 hover:brightness-110"
              >
                Email me
              </a>
              <a
                href="https://github.com/AlexSTJO"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:border-sky-400/70 hover:text-sky-200"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/alexstjohn1/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:border-sky-400/70 hover:text-sky-200"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            © {new Date().getFullYear()} Alexandros St. John · Site built with
            Next.js, Tailwind, and deployed via Flume.
          </p>
        </section>
      </div>
    </main>
  );
}



type PipelineStatus = "done" | "running" | "pending";

function PipelineNode({
  title,
  subtitle,
  status,
}: {
  title: string;
  subtitle: string;
  status: PipelineStatus;
}) {
  const statusStyles: Record<PipelineStatus, string> = {
    done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    running: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    pending: "bg-slate-800/60 text-slate-300 border-slate-600/70",
  };

  return (
    <div
      className={`relative z-10 rounded-2xl border px-3 py-2.5 text-[11px] ${statusStyles[status]}`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-0.5 text-[10px] text-slate-300/80">{subtitle}</p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "sky" | "purple" | "emerald" | "slate";
}) {
  const dotColor: Record<typeof accent, string> = {
    sky: "bg-sky-400",
    purple: "bg-purple-400",
    emerald: "bg-emerald-400",
    slate: "bg-slate-400",
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-2">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor[accent]}`} />
        {label}
      </p>
      <p className="mt-1 text-[11px] text-slate-100">{value}</p>
    </div>
  );
}

