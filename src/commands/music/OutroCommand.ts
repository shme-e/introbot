import { checkQuery, handleVideos, searchTrack } from "../../utils/handlers/GeneralUtil.js";
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import { Song } from "../../typings/index.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType, Message } from "discord.js";
import { readFileSync, writeFileSync } from "fs";

@Command({
    aliases: [],
    description: i18n.__("commands.music.outro.description"),
    name: "outro",
    slash: {
        description: i18n.__("commands.music.outro.description"),
        options: [
            {
                description: i18n.__("commands.music.outro.slashQueryDescription"),
                name: "query",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    usage: i18n.__("commands.music.outro.usage")
})
export class OutroCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<Message | undefined> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();

        const raw = readFileSync("outros.json", {encoding: "utf-8"});
        const outros: {[key: string]: {query: string, unlimited: false, length: number} | {query: string, unlimited: true}} = JSON.parse(raw);

        if (ctx.args.length > 0) {
            if (!(ctx.author.id in outros)) {
                outros[ctx.author.id] = {
                    query: "",
                    unlimited: true
                }
            }
            outros[ctx.author.id].query = ctx.args.join(" ");
            writeFileSync("outros.json", JSON.stringify(outros), {encoding: "utf-8"});

            return ctx.channel?.send(`outro is now ${ctx.args.join(" ")}`);
        } else {
            delete outros[ctx.author.id];
            writeFileSync("outros.json", JSON.stringify(outros), {encoding: "utf-8"});

            return ctx.channel?.send(`no more outro`);
        }
    }
}
