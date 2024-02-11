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
    description: i18n.__("commands.music.introLength.description"),
    name: "introlength",
    slash: {
        description: i18n.__("commands.music.introLength.description"),
        options: [
            {
                description: i18n.__("commands.music.introLength.slashQueryDescription"),
                name: "length",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    usage: i18n.__("commands.music.introLength.usage")
})
export class IntroLengthCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<Message | undefined> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();

        const raw = readFileSync("intros.json", {encoding: "utf-8"});
        const intros: {[key: string]: {query: string, unlimited: false, length: number} | {query: string, unlimited: true}} = JSON.parse(raw);

        if (ctx.args.length > 0) {
            let intro = intros[ctx.author.id];
            intro.unlimited = false;
            
            if (!intro.unlimited) {
                intro.length = parseInt(ctx.args[0]);
            }
            writeFileSync("intros.json", JSON.stringify(intros), {encoding: "utf-8"});

            return ctx.channel?.send(`intro length is now ${ctx.args[0]}`);
        } else {
            let intro = intros[ctx.author.id];
            intro.unlimited = true;

            writeFileSync("intros.json", JSON.stringify(intros), {encoding: "utf-8"});

            return ctx.channel?.send(`intro unlimited`);
        }
    }
}
