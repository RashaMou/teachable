import Dashboard from "../components/Dashboard";

export default async function Home() {
  const coursesResponse = await fetch("http://localhost:3000/api/courses", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const courses = await coursesResponse.json();

  return (
    <main>
      return <Dashboard courses={courses} />
    </main>
  );
}
