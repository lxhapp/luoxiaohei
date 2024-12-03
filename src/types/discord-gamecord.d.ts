declare module "discord-gamecord" {
  import { CommandInteraction, User } from "discord.js";

  export class RockPaperScissors {
    constructor(options: {
      message: CommandInteraction;
      isSlashGame?: boolean;
      embed?: {
        title?: string;
        color?: string;
        description?: string;
      };
      buttons?: {
        rock?: string;
        paper?: string;
        scissors?: string;
      };
      emojis?: {
        rock?: string;
        paper?: string;
        scissors?: string;
      };
      mentionUser?: boolean;
      timeoutTime?: number;
      buttonStyle?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK";
      pickMessage?: string;
      winMessage?: string;
      tieMessage?: string;
      timeoutMessage?: string;
      playerOnlyMessage?: string;
    });

    startGame(): Promise<void>;
  }

  export class TicTacToe {
    constructor(options: {
      message: CommandInteraction;
      isSlashGame: boolean;
      opponent: User;
      embed: {
        title: string;
        color: string;
        statusTitle: string;
        overTitle: string;
      };
      emojis: {
        xButton: string;
        oButton: string;
        blankButton: string;
      };
      mentionUser: boolean;
      timeoutTime: number;
      xButtonStyle?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK";
      oButtonStyle?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK";
      turnMessage: string;
      winMessage: string;
      tieMessage: string;
      timeoutMessage: string;
      playerOnlyMessage: string;
    });

    startGame(): Promise<void>;
  }
}
