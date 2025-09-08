// src/controllers/clusterController.js
import { ddbDocClient } from '../config/dynamodbClient.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

const CLUSTERS_TABLE = 'clusters';

export const getAllClusters = async (req, res) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: CLUSTERS_TABLE }));
    // Parse complaints field from string to array
    const clusters = (data.Items || []).map(cluster => ({
      ...cluster,
      complaints: typeof cluster.complaints === 'string' ? JSON.parse(cluster.complaints) : cluster.complaints
    }));
    res.status(200).json({ clusters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
