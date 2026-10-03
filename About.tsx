import { Container, Card } from "../components/ui/Primitives";

export function About() {
  return (
    <Container className="py-14">
      <h1 className="font-display text-3xl text-navy">About SafeAware</h1>
      <p className="mt-3 max-w-2xl text-slate">
        SafeAware is a Bachelor of Computer Applications (BCA) minor project built to explore community safety
        awareness through a practical, database-backed web application. It combines a safety-concern survey,
        awareness campaigns, educational resources, legal-awareness information, an emergency contact directory,
        and anonymous reporting behind a role-based admin dashboard.
      </p>
      <Card className="mt-8 max-w-lg">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-slate">Student name</dt><dd className="font-medium text-navy">[Add your name]</dd></div>
          <div className="flex justify-between"><dt className="text-slate">Roll number</dt><dd className="font-medium text-navy">[Add roll number]</dd></div>
          <div className="flex justify-between"><dt className="text-slate">College</dt><dd className="font-medium text-navy">[Add college name]</dd></div>
          <div className="flex justify-between"><dt className="text-slate">Department</dt><dd className="font-medium text-navy">BCA</dd></div>
          <div className="flex justify-between"><dt className="text-slate">Academic year</dt><dd className="font-medium text-navy">[Add year]</dd></div>
          <div className="flex justify-between"><dt className="text-slate">Project guide</dt><dd className="font-medium text-navy">[Add guide's name]</dd></div>
        </dl>
      </Card>
    </Container>
  );
}
