// src/services/analysisService.js
// Copy from your existing backend, as it does not depend on Supabase
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { randomUUID } from "crypto";

const client = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION });

export const analyzeComplaint = async (description, postcode) => {
  const agentId = process.env.AWS_BEDROCK_AGENT_ID;
  const agentAliasId = process.env.AWS_BEDROCK_AGENT_ALIAS_ID;
  const sessionId = randomUUID();
  const inputText = `Postcode: ${postcode}, Complaint: "${description}"`;
  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId,
    sessionId,
    inputText,
  });
  try {
    const response = await client.send(command);
    let completion = "";
    for await (const chunk of response.completion) {
      if (chunk.chunk?.bytes) {
        completion += new TextDecoder().decode(chunk.chunk.bytes);
      }
    }
    const analysis = JSON.parse(completion);
    return analysis;
  } catch (error) {
    return { urgency: 1 };
  }
};
