import { APIChatInputApplicationCommandInteractionData, APIGuildMember } from "discord-api-types/v10";

export default interface Interaction {
    data: APIChatInputApplicationCommandInteractionData;
    member: APIGuildMember
}