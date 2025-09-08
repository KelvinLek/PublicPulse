// src/services/clusterDbService.js
import { ddbDocClient } from '../config/dynamodbClient.js';
import { ScanCommand, DeleteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const CLUSTERS_TABLE = 'clusters';

export const replaceClusters = async (clusters) => {
  // Delete all existing clusters
  const existing = await ddbDocClient.send(new ScanCommand({ TableName: CLUSTERS_TABLE }));
  if (existing.Items && existing.Items.length > 0) {
    for (const cluster of existing.Items) {
      await ddbDocClient.send(new DeleteCommand({ TableName: CLUSTERS_TABLE, Key: { id: cluster.id } }));
    }
  }
  // Insert new clusters
  for (const cluster of clusters) {
    // complaints must be a string for DynamoDB
    const item = {
      ...cluster,
      id: cluster.cluster_id?.toString() || cluster.id?.toString(),
      complaints: JSON.stringify(cluster.complaints),
    };
    delete item.cluster_id;
    await ddbDocClient.send(new PutCommand({ TableName: CLUSTERS_TABLE, Item: item }));
  }
};
