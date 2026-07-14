import { getMessages } from "../../../lib/messages";
import MessagesViewer from "../../../components/MessagesViewer";

export const metadata = {
  title: "Messages - Admin",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const params = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (secret && params.secret !== secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="neu-raised rounded-2xl p-12 text-center">
          <p className="text-xl font-semibold text-red-500">Unauthorized</p>
          <p className="text-[var(--text-muted)] mt-2">Invalid or missing access key.</p>
        </div>
      </div>
    );
  }

  const messages = await getMessages();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Received Messages
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            {messages.length} message{messages.length !== 1 ? "s" : ""} from the contact form
          </p>
        </div>
        <MessagesViewer initialMessages={messages} secret={params.secret} />
      </main>
    </div>
  );
}
