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
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5V12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5.5" />
      <path d="M5 12v6.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V12" />
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

const topicIcons: Record<TopicId, (props: IconProps) => React.JSX.Element> = {
  "java-core": JavaIcon,
  "spring-boot": SpringIcon,
  "jpa-hibernate": JpaIcon,
  sql: SqlIcon,
  angular: AngularIcon,
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
