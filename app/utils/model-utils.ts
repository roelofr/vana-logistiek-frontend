import type { Chat, Group, User } from "~/types";

export function getChatParticipants(chat: Chat): string {
  return [...chat.users, ...chat.groups].map((row) => row.name).join(", ");
}

type Colourful = { colour?: string; group?: Colourful };
type Colourable = Chat | Group | User;

function colourFromModel(model: Colourable): string | undefined {
  if (Object.hasOwn(model, "colour") && (model as Colourful).colour)
    return (model as Colourful).colour;

  if (
    Object.hasOwn(model, "group") &&
    (model as Colourful).group &&
    (model as Colourful).group!.colour
  )
    return (model as Colourful).group!.colour;

  return undefined;
}

export function getModelColour(
  model: Colourable,
  fallback: string = "pink",
): string {
  const colourComputed = colourFromModel(model) ?? fallback;
  return `bg-${colourComputed}-700 dark:bg-${colourComputed}-500`;
}
