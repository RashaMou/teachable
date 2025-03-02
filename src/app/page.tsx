import Dashboard from "../components/Dashboard";
import ErrorBoundary from "./error";

export default async function Home() {
  const coursesResponse = await fetch("http://localhost:3000/api/courses", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const data = await coursesResponse.json();
  const courses = data.courses || [];

  if (!courses || !Array.isArray(courses)) {
    console.error("Courses data is not an array:", courses);
    return <main>Error loading courses data</main>;
  }

  return (
    <main>
      <ErrorBoundary>
        <Dashboard courses={courses} />
      </ErrorBoundary>
    </main>
  );
}
