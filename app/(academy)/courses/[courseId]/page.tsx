export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <main>
      <h1>Course {params.courseId}</h1>
    </main>
  );
}
