// src/services/analysisService.js
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { randomUUID } from "crypto"; // To generate unique session IDs

// Initialize the Bedrock Agent Runtime client
const client = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION });

export const analyzeComplaint = async (id, complaint, postcode) => {
  const agentId = process.env.AWS_BEDROCK_AGENT_ID;
  const agentAliasId = process.env.AWS_BEDROCK_AGENT_ALIAS_ID;
  
  // Each invocation needs a unique session ID
  const sessionId = randomUUID();

  // The input is now much simpler, just the raw text of the complaint.
  const inputText = `Id: ${id}, Postcode: ${postcode}, Complaint: "${complaint}"`;

  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId,
    sessionId,
    inputText,
  });

  try {
    const response = await client.send(command);

    let completion = "";
    // The response is a stream. We need to read it until it's done.
    for await (const chunk of response.completion) {
      if (chunk.chunk?.bytes) {
        completion += new TextDecoder().decode(chunk.chunk.bytes);
      }
    }
    
    // The 'completion' string should be the JSON our agent was instructed to return
    const analysis = JSON.parse(completion);
    console.log('Bedrock Agent Analysis Complete:', analysis);
    return analysis;

  } catch (error) {
    console.error("Error invoking Bedrock Agent:", error);
    // Return a default value in case of an error
    return {
      urgency: 1,
    };
  }
};