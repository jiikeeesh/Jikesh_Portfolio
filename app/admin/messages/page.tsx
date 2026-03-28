import { getMessages } from "../../../lib/messages";
import MessagesViewer from "../../../components/MessagesViewer";

export const metadata = {
  title: "Messages - Admin",
};

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ secret?: string }> }) {
  const params = await searchParams;
  // simple protection via query param, set ADMIN_SECRET env variable
  const secret = process.env.ADMIN_SECRET;
  if (secret && params.secret !== secret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Unauthorized</p>
      </div>
    );
  }

  const messages = await getMessages();

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8">Received Messages</h2>
        <MessagesViewer initialMessages={messages} secret={params.secret} />
      </main>
    </div>
  );
}
