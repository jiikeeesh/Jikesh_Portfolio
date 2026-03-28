import { saveMessage, getMessages, deleteMessage, isNetlify } from "../lib/messages";

async function test() {
  console.log("Starting message service test...");
  console.log("Is Netlify:", isNetlify());

  const testMessage = {
    name: "Test User",
    email: "test@example.com",
    message: "This is a test message from the verification script.",
    timestamp: new Date().toISOString()
  };

  try {
    console.log("Saving test message...");
    await saveMessage(testMessage);
    console.log("Message saved successfully!");

    console.log("Fetching messages...");
    const messages = await getMessages();
    const found = messages.find(m => m.timestamp === testMessage.timestamp);
    
    if (found) {
      console.log("Test message found in store!");
    } else {
      throw new Error("Test message NOT found in store!");
    }

    console.log("Deleting test message...");
    await deleteMessage(testMessage.timestamp);
    console.log("Message deleted successfully!");

    const finalMessages = await getMessages();
    const stillExists = finalMessages.find(m => m.timestamp === testMessage.timestamp);
    if (!stillExists) {
      console.log("Verification successful: Message was deleted.");
    } else {
      throw new Error("Verification failed: Message still exists after deletion.");
    }

    console.log("All local tests passed!");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
