require('dotenv').config();

// Helper function to safely display token prefix
const showTokenPrefix = (token) => token ? `${token.slice(0,6)}...` : 'missing';

// Dummy resolveSecrets function simulating the secret resolution process
function resolveSecrets(secrets) {
  const resolved = {};
  for (const key in secrets) {
    const envKey = secrets[key];
    const value = process.env[envKey];
    console.log(`Resolving secret ${key}: Looking up ${envKey} -> ${value ? showTokenPrefix(value) : 'undefined'}`);
    resolved[key] = value ? value.trim() : undefined;
  }
  return resolved;
}

// Example character-specific secrets from the character file
const characterSecrets = {
  DISCORD_API_TOKEN: "CHARACTER.PLATO.DISCORD_API_TOKEN",
  DISCORD_APPLICATION_ID: "CHARACTER.PLATO.DISCORD_APPLICATION_ID"
};

console.log("Environment Variables (Direct):");
console.log('CHARACTER.PLATO.DISCORD_API_TOKEN:', showTokenPrefix(process.env['CHARACTER.PLATO.DISCORD_API_TOKEN']));
console.log('\nFull token length:', process.env['CHARACTER.PLATO.DISCORD_API_TOKEN']?.length);
console.log('Token format valid:', process.env['CHARACTER.PLATO.DISCORD_API_TOKEN']?.startsWith('MTMzNz'));

// Test the secret resolution process
try {
  const resolvedSecrets = resolveSecrets(characterSecrets);
  console.log('\nResolved Secrets:', resolvedSecrets);

  // Validate Discord token format (change conditions as needed)
  function validateDiscordToken(token) {
    return token && token.startsWith("MT") && token.length === 72;
  }
  
  if (!validateDiscordToken(resolvedSecrets.DISCORD_API_TOKEN)) {
    throw new Error("Invalid Discord token in resolved secrets");
  }
  
  console.log('\nSecret resolution and validation passed successfully.');
} catch (error) {
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error setting up secret loading:", error.message);
  }
} 