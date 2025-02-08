import { Client, GatewayIntentBits } from 'discord.js';

// This class initializes a Discord client and handles token resolution
export class DiscordClient {
  private client: Client;
  public apiToken: string;
  public character: any; // You might want to replace 'any' with a proper type

  constructor(character: any) {
    this.character = character;

    // Get the token using runtime's getSecret from character settings
    const token = this.character?.settings?.secrets?.DISCORD_API_TOKEN;

    // If the token is in the format '${...}', resolve it using the environment variable
    if (token?.startsWith('${') && token?.endsWith('}')) {
      const envVarName = token.slice(2, -1);
      this.apiToken = process.env[envVarName] || '';
    } else {
      this.apiToken = token || '';
    }

    // Debug logging to help trace token resolution
    console.debug('Token resolution debug:', {
      characterName: this.character?.name,
      rawToken: token,
      isEnvVar: token?.startsWith('${') && token?.endsWith('}'),
      envVarName: token?.startsWith('${') ? token.slice(2, -1) : null,
      envValue: token?.startsWith('${') ? process.env[token.slice(2, -1)] : null
    });

    // Initialize the Discord client with the necessary intents
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
  }

  // Connect to Discord using the resolved token
  public async connect(): Promise<void> {
    try {
      await this.client.login(this.apiToken);
      console.log('Discord client logged in successfully.');
    } catch (error) {
      console.error('Error logging in to Discord:', error);
    }
  }
}

// Example usage:
// const myCharacter = require('../../characters/plato.character.json');
// const discordClient = new DiscordClient(myCharacter);
// discordClient.connect(); 