import type { SVGProps } from "react";
import type { TopicId } from "@/content/questions";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

function JavaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 10h9v4.5c0 2-2 3.5-4.5 3.5S7 16.5 7 14.5V10Z" />
      <path d="M16 11h1.5c1.4 0 2.5 1 2.5 2.2s-1.1 2.2-2.5 2.2H16" />
      <path d="M9 3.5c-1 1.2-1 2.3 0 3.4" />
      <path d="M12.3 3c-1 1.4-1 2.6 0 4" />
      <path d="M6 20.5c2 1 10 1 12 0" />
    </svg>
  );
}

function SpringIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18.5 5.5c-4-2-9.5-1.5-13 2-4 4-3.5 9-1.5 11 1.7-4.3 4.4-7.2 9-9" />
      <path d="M19 5c1.8 3.8 1.6 8.6-1.7 12-2.7 2.7-6.7 3.4-10.3 2.3" />
      <circle cx="18.5" cy="5.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function JpaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3.5" width="8" height="8" rx="1.8" />
      <ellipse cx="17.5" cy="16.5" rx="4" ry="1.7" />
      <path d="M13.5 16.5v3.3c0 .94 1.79 1.7 4 1.7s4-.76 4-1.7v-3.3" />
      <path d="M10 11.2 15 14.6" />
    </svg>
  );
}

function SqlIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="5" rx="7.5" ry="2.6" />
      <path d="M4.5 5v6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V5" />
      <path d="M4.5 11v6.5c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5V11" />
    </svg>
  );
}

function AngularIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 4 6.3l1.2 10.4L12 20.5l6.8-3.8L20 6.3 12 3.5Z" />
      <path d="M12 6.8 8 16h1.7l.8-2h3l.8 2H16L12 6.8Zm0 3 1 2.5h-2l1-2.5Z" />
    </svg>
  );
}

function ClaudeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l4.2 4.2M14.3 14.3l4.2 4.2M18.5 5.5l-4.2 4.2M9.7 14.3l-4.2 4.2" />
    </svg>
  );
}

function KubernetesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.8 20.5 8v8L12 21.2 3.5 16V8Z" />
      <circle cx="12" cy="12" r="2.3" />
      <path d="M12 4.5v5M12 14.5v5M5.5 8.3l4.5 2.8M18.5 8.3l-4.5 2.8M6.5 17l4-4.5M17.5 17l-4-4.5" />
    </svg>
  );
}

function GcpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 17h9a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.1 9.5 4 4 0 0 0 8 17Z" />
    </svg>
  );
}

function KafkaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M8 7l8 4M8 17l8-4" />
    </svg>
  );
}

function KotlinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4h16L12 12l8 8H4V4Z" />
    </svg>
  );
}

function CopilotIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AwsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
      <path d="M4 8.5 12 13l8-4.5M12 13v7" />
    </svg>
  );
}

function AzureIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4h4l6 15h-5l-3-8-4 8H3l6-15Z" />
    </svg>
  );
}

function DockerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="10" width="4" height="4" />
      <rect x="9" y="10" width="4" height="4" />
      <rect x="14" y="10" width="4" height="4" />
      <rect x="9" y="5" width="4" height="4" />
      <path d="M3 14c0 4 3.5 6 8 6 5.5 0 9-3 10-6" />
    </svg>
  );
}

function TerraformIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6 11 9.5v6L5 12V6Z" />
      <path d="M12 9.5 18 6v6l-6 3.5v-6Z" />
      <path d="M12 17 18 13.5v6l-6 3.5v-6Z" />
    </svg>
  );
}

function ApacheSparkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c-3 4-5 7-5 10a5 5 0 0 0 10 0c0-1.5-.8-2.8-1.8-3.8.3 1.3-.2 2.3-1 2.8.4-2-.5-4-2.2-5.5.3 1.2 0 2-1 2.5.5-2.3-.3-4.3-1-6Z" />
    </svg>
  );
}

const topicIcons: Record<TopicId, (props: IconProps) => React.JSX.Element> = {
  "java-core": JavaIcon,
  "spring-boot": SpringIcon,
  "jpa-hibernate": JpaIcon,
  sql: SqlIcon,
  angular: AngularIcon,
  claude: ClaudeIcon,
  kafka: KafkaIcon,
  kotlin: KotlinIcon,
  copilot: CopilotIcon,
  aws: AwsIcon,
  azure: AzureIcon,
  docker: DockerIcon,
  terraform: TerraformIcon,
  spark: ApacheSparkIcon,
  kubernetes: KubernetesIcon,
  gcp: GcpIcon,
};

export function TopicIcon({
  topicId,
  ...props
}: { topicId: TopicId } & IconProps) {
  const Icon = topicIcons[topicId];
  return <Icon {...props} />;
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

export function HalfIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
    </svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 15.5 9" />
      <path d="M4 15h1.5M18.5 15H20" />
    </svg>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h4l1.5 2.5h5L16 12h4" />
      <path d="M4 12 6 5h12l2 7v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Z" />
    </svg>
  );
}
