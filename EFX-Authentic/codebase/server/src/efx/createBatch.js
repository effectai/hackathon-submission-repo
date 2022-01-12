module.exports.createBatch = async function createBatch(
  client,
  campaignId,
  content,
  repetitions
) {
  return await client.force.createBatch(campaignId, content, repetitions);
};
