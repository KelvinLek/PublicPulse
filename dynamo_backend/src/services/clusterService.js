// src/services/clusterService.js

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { randomUUID } from "crypto";
import { replaceClusters } from "./clusterDbService.js";

const client = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION });

export const clusterComplaints = async (complaints) => {
  const agentId = process.env.AWS_CLUSTER_AGENT_ID;
  const agentAliasId = process.env.AWS_CLUSTER_AGENT_ALIAS_ID;
  const sessionId = randomUUID();
  // Send a simple prompt to the agent
  const inputText = "please cluster data from complaints";
  console.log('[ClusterAgent] Sending:', inputText);
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
    console.log('[ClusterAgent] Received:', completion);
    // The agent should return cluster assignments for complaints
    let clustersObj = {};
    try {
      // Find first JSON object in response
      const firstBrace = completion.indexOf('{');
      if (firstBrace !== -1) {
        const jsonStr = completion.slice(firstBrace);
        clustersObj = JSON.parse(jsonStr);
      }
    } catch (e) {
      console.error('[ClusterAgent] JSON parse error:', e);
      clustersObj = { clusters: [] };
    }
    if (clustersObj.clusters) {
      await replaceClusters(clustersObj.clusters);
    }
    return clustersObj;
  } catch (error) {
    console.error('[ClusterAgent] Error:', error);
    return { clusters: [] };
  }
};
