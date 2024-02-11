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
    description: i18n.__("commands.music.intro.description"),
    name: "intro",
    slash: {
        description: i18n.__("commands.music.intro.description"),
        options: [
            {
                description: i18n.__("commands.music.intro.slashQueryDescription"),
                name: "query",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    usage: i18n.__("commands.music.intro.usage")
})
export class IntroCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<Message | undefined> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();

        const raw = readFileSync("intros.json", {encoding: "utf-8"});
        const intros: {[key: string]: {query: string, unlimited: false, length: number} | {query: string, unlimited: true}} = JSON.parse(raw);

        if (ctx.args.length > 0) {
            if (!(ctx.author.id in intros)) {
                intros[ctx.author.id] = {
                    query: "",
                    unlimited: true
                }
            }
            intros[ctx.author.id].query = ctx.args.join(" ");
            writeFileSync("intros.json", JSON.stringify(intros), {encoding: "utf-8"});

            return ctx.channel?.send(`intro is now ${ctx.args.join(" ")}`);
        } else {
            delete intros[ctx.author.id];
            writeFileSync("intros.json", JSON.stringify(intros), {encoding: "utf-8"});

            return ctx.channel?.send(`no more intro`);
        }
    }
}
