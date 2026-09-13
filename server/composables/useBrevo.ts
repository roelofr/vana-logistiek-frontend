import { BrevoClient } from "@getbrevo/brevo";

let brevoClient: BrevoClient;

interface BravoMessage {
  subject: string;
  body: string;
}

type Recipient = { name?: string; email: string } | string;

type BravoMessageTemplate = {
  [key in keyof BravoMessage]: string | ((args: Map<string, string>) => string);
};

const appName = "Penis LogistiekApp";

const templates: Record<string, BravoMessageTemplate> = {
  otpLogin: {
    subject: "Inlogcode voor LogistiekApp",
    body: (args) => `Hoi,

    Je hebt een inlogcode aangevraagd voor de ${appName}. Dit is ${args.get("code")}.

    Veel plezier ermee.`,
  },
  otpEmailVerify: {
    subject: "Verificatiecode voor LogistiekApp",
    body: (args) => `Hoi,

    Om je e-mailadres te valideren voor de ${appName} heb je de volgende code nodig: ${args.get("code")}.

    Veel plezier ermee.`,
  },
};

function renderTemplate(
  template: string,
  args: Map<string, string>,
): BravoMessage {
  if (!Object.hasOwn(templates, template))
    throw new Error(`Template ${template} does not exist`);

  const { subject, body } = templates[template]!;
  return {
    subject: typeof subject === "function" ? subject(args) : subject,
    body: typeof body === "function" ? body(args) : body,
  } as BravoMessage;
}

function getBrevoClient(): BrevoClient {
  if (brevoClient) return brevoClient;

  const config = useRuntimeConfig();
  if (config.brevo.apiKey && config.brevo.apiKey !== "unset")
    return (brevoClient = new BrevoClient({ apiKey: config.brevo.apiKey }));

  throw new Error("Brevo client unavailable");
}

function toRecipient(input: Recipient) {
  if (typeof input === "string") return { email: input };

  if (!input.email || !input.email.trim())
    throw new Error("Recipeint is invalid");

  if (Object.hasOwn(input, "name") && input.name?.trim())
    return { name: input.name, email: input.email };
  return { email: input.email };
}

export function useBrevo() {
  const client = getBrevoClient();
  if (!client)
    throw Error(
      "Failed to create Brevo client, have you confgured the API ke?",
    );

  async function sendMessage(
    recipient: Recipient,
    template: string,
    args: Record<string, string>,
  ): Promise<void> {
    if (!Object.hasOwn(templates, template))
      throw new Error("Template was not found");

    const mappedArgs = new Map(Object.entries(args));
    const { subject, body } = renderTemplate(template, mappedArgs);

    try {
      const result =
        await getBrevoClient().transactionalEmails.sendTransacEmail({
          subject,
          textContent: body,
          sender: { name: "LogistiekApp", email: "logistiek@myvana.dev" },
          to: [toRecipient(recipient)],
        });

      console.log("Email sent. Message ID:", result.messageId);
    } catch (e) {
      console.error(`Failed to send message: ${e}`);
      throw new Error("Failed to send message", { cause: e });
    }
  }

  return {
    client,
    sendMessage,
  };
}
