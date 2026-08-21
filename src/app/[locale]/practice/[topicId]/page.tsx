import { notFound } from "next/navigation";
import { questions, type TopicId } from "@/content/questions";
import { topics } from "@/content/topics";
import { TopicPractice } from "@/components/topic-practice";

const validTopicIds = new Set(topics.map((t) => t.id));

export default async function TopicPracticePage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  if (!validTopicIds.has(topicId as TopicId)) {
    notFound();
  }

  const topicQuestions = questions.filter((q) => q.topicId === topicId);
  if (topicQuestions.length === 0) {
    notFound();
  }

  return (
    <TopicPractice topicId={topicId as TopicId} questions={topicQuestions} />
  );
}
