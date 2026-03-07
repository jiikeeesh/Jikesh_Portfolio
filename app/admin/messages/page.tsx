import { promises as fs } from "fs";
import path from "path";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import MessagesViewer from "../../../components/MessagesViewer";

export const metadata = {
  title: "Messages - Admin",
};

export default async function MessagesPage({ searchParams }: { searchParams: { secret?: string } }) {
  // simple protection via query param, set ADMIN_SECRET env variable
  const secret = process.env.ADMIN_SECRET;
  if (secret && searchParams.secret !== secret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Unauthorized</p>
      </div>
    );
  }

  const dataPath = path.join(process.cwd(), "data", "messages.json");
  let messages: any[] = [];
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    messages = JSON.parse(file);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8">Received Messages</h2>
        <MessagesViewer initialMessages={messages} secret={searchParams.secret} />
      </section>
      <Footer />
    </div>
  );
}
