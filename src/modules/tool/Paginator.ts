import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Colors,
    ButtonStyle,
    ComponentType,
    escapeNumberedList,
    ChatInputCommandInteraction,
    Message,
    ColorResolvable,
    ButtonInteraction,
    InteractionReplyOptions,
} from 'discord.js';
import LoggerTool from './LoggerTool.js';

const noEmbedsString =
    'There is not enough information for this command to work right now. Try again later.';

export default class Paginator {
    private interaction: ChatInputCommandInteraction;
    private readonly embedArray: EmbedBuilder[];
    private readonly deletable: boolean;
    private noEmbedErrorString: string;

    /**
     * Creates an interaction based embed paginator that allows users to see more data in a concise format
     * @param interaction An instance of ChatInputInteraction
     * @param embedArray An array of EmbedBuilder that will be used to build the pagination
     * @param deletable Whether the paginated response should be user deletable
     * @param noEmbedErrorString Custom description that will be sent whenever the embedArray is empty
     */
    constructor(
        interaction: ChatInputCommandInteraction,
        embedArray: EmbedBuilder[],
        deletable = true,
        noEmbedErrorString = noEmbedsString,
    ) {
        this.interaction = interaction;
        this.embedArray = embedArray;
        this.deletable = deletable;
        this.noEmbedErrorString = noEmbedErrorString;
    }

    private previousButton(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('previousButton')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Secondary);
    }

    private nextButton(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('nextButton')
            .setLabel('Next')
            .setStyle(ButtonStyle.Secondary);
    }

    private deleteButton(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('deleteButton')
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger);
    }

    private createPayload() {
        return (
            this.embedArray.length === 1
                ? this.deletable
                    ? {
                          embeds: [this.embedArray[0]],
                          components: [
                              new ActionRowBuilder().addComponents(
                                  this.deleteButton(),
                              ),
                          ],
                      }
                    : { embeds: [this.embedArray[0]] }
                : this.deletable
                  ? {
                        embeds: [this.embedArray[0]],
                        components: [
                            new ActionRowBuilder().addComponents(
                                this.previousButton(),
                                this.nextButton(),
                                this.deleteButton(),
                            ),
                        ],
                    }
                  : {
                        embeds: [this.embedArray[0]],
                        components: [
                            new ActionRowBuilder().addComponents(
                                this.previousButton(),
                                this.nextButton(),
                            ),
                        ],
                    }
        ) as InteractionReplyOptions;
    }

    private handler(message: Message) {
        let i = 0;
        const filter = async (interaction: ButtonInteraction) => {
            await interaction.deferUpdate();
            return interaction.user.id === this.interaction.user.id;
        };

        const collector = message.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            idle: 20000,
        });

        collector.on('collect', (interaction) => {
            if (interaction.customId === 'deleteButton') {
                void interaction.deleteReply();
            } else if (interaction.customId === 'nextButton') {
                i++;
                if (i >= this.embedArray.length) i = 0;
                void interaction.editReply({
                    embeds: [this.embedArray[i]],
                });
            } else {
                i--;
                if (i < 0) i = this.embedArray.length - 1;
                void interaction.editReply({
                    embeds: [this.embedArray[i]],
                });
            }
        });

        collector.on('end', () => {
            message.edit({ components: [] }).catch((err) => {
                LoggerTool.warn(err);
            });
        });
    }

    /**
     * Sends the paginated response into the channel where the interaction was initialised
     * @public
     */
    public async send() {
        if (this.embedArray.length === 0) {
            return this.interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(this.noEmbedErrorString)
                        .setColor(Colors.Red),
                ],
            });
        }
        await this.interaction
            .editReply(this.createPayload())
            .then((message) => this.handler(message));
    }

    /**
     * Create an array of embeds that can then be used when initialising an instance of Paginator
     * @static
     * @param data The data to add to the embeds
     * @param embedTitle The title that should be displayed on the embed
     * @param color The colour the embeds should be
     * @param author The data that should be shown in the author field (please make sure this follows discord.js EmbedAuthorData interface https://discord.js.org/docs/packages/discord.js/main/EmbedAuthorData:Interface)
     * @param footer The data that should be shown in the author field (this should be a string)
     * @param thumbnail The image url that will be displayed in the embed thumbnail
     * @param url The url to add to the embed title
     * @param chunk How many rows from the data that should be displayed on one embed
     * @returns {EmbedBuilder[]}
     */
    public static createEmbeds(
        data: string[],
        embedTitle: string,
        color: ColorResolvable,
        author = null,
        footer = null,
        thumbnail = null,
        url = null,
        chunk = 10,
    ): EmbedBuilder[] {
        const embeds: EmbedBuilder[] = [];
        const results: string[][] = data.reduce(
            (all: string[][], one: string, i: number): string[][] => {
                const ch = Math.floor(i / chunk);
                all[ch] = (all[ch] || []).concat(one);
                return all;
            },
            [],
        );

        results.forEach((result, i) => {
            embeds.push(
                new EmbedBuilder()
                    .setTitle(embedTitle)
                    .setAuthor(author)
                    .setDescription(escapeNumberedList(result.join('')))
                    .setThumbnail(thumbnail)
                    .setURL(url)
                    .setFooter({
                        text: `Page ${i + 1}/${results.length} ${footer ? footer : ''}`.trim(),
                    })
                    .setColor(color),
            );
        });

        return embeds;
    }
}
