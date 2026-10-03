import { useAuth } from "../contexts/AuthContext";
import { Container, Card, Badge } from "../components/ui/Primitives";

export function Profile() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <Container className="py-14">
      <h1 className="font-display text-3xl text-navy">Your profile</h1>
      <Card className="mt-6 max-w-lg">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-slate">Full name</span>
            <span className="font-medium text-navy">{profile.full_name}</span>
          </div>
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-slate">Email</span>
            <span className="font-medium text-navy">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate">Role</span>
            <Badge tone={profile.role === "admin" ? "amber" : "teal"}>{profile.role}</Badge>
          </div>
        </div>
      </Card>
    </Container>
  );
}
