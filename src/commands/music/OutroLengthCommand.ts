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
    aliases: ["il"],
    description: i18n.__("commands.music.outroLength.description"),
    name: "outrolength",
    slash: {
        description: i18n.__("commands.music.outroLength.description"),
        options: [
            {
                description: i18n.__("commands.music.outroLength.slashQueryDescription"),
                name: "length",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    usage: i18n.__("commands.music.outroLength.usage")
})
export class OutroLengthCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<Message | undefined> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();

        const raw = readFileSync("outros.json", {encoding: "utf-8"});
        const outros: {[key: string]: {query: string, unlimited: false, length: number} | {query: string, unlimited: true}} = JSON.parse(raw);

        if (ctx.args.length > 0) {
            let outro = outros[ctx.author.id];
            outro.unlimited = false;
            
            if (!outro.unlimited) {
                outro.length = parseInt(ctx.args[0]);
            }
            writeFileSync("outros.json", JSON.stringify(outros), {encoding: "utf-8"});

            return ctx.channel?.send(`outro length is now ${ctx.args[0]}`);
        } else {
            let outro = outros[ctx.author.id];
            outro.unlimited = true;

            writeFileSync("outros.json", JSON.stringify(outros), {encoding: "utf-8"});

            return ctx.channel?.send(`outro unlimited`);
        }
    }
}
