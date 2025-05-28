import { sendFeedbackRequestEmail } from "../utils/mailer";


async function main() {
    await sendFeedbackRequestEmail('test@example.com', 'fake-token-123', 'John Doe');
}

main();