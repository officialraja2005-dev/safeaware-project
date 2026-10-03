import { useState } from "react";
import { Container, Button, Card } from "../components/ui/Primitives";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Container className="py-14">
      <h1 className="font-display text-3xl text-navy">Contact</h1>
      <p className="mt-2 max-w-xl text-slate">This is a demo contact form for the BCA project — submissions are not routed to a real organisation unless configured.</p>
      <Card className="mt-8 max-w-lg">
        {sent ? (
          <p className="text-sm text-teal-dark">Thanks — this demo form doesn't send anywhere yet, but the UI flow works end to end.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <input required placeholder="Your name" className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal" />
            <input required type="email" placeholder="Email" className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal" />
            <textarea required rows={4} placeholder="Message" className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal" />
            <Button type="submit">Send message</Button>
          </form>
        )}
      </Card>
    </Container>
  );
}
