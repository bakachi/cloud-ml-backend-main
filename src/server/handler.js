const predictClassification = require("../services/inferenceServices");
const crypto = require("crypto");

const { storeData, getDatas } = require("../services/storeData");

const postPredictHandler = async (request, h) => {
  const { image } = request.payload;

  const { model } = request.server.app;

  const { result, suggestion } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const newPrediction = {
    id,
    result,
    suggestion,
    createdAt,
  };

  await storeData(id, newPrediction);

  const response = h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data: newPrediction,
    })
    .code(201);

  return response;
};

const getPredictHistoriesHandler = async (request, h) => {
  const histories = await getDatas();

  const formattedHistories = histories.map((data) => ({
    id: data.id,
    history: {
      result: data.result,
      createdAt: data.createdAt,
      suggestion: data.suggestion,
      id: data.id,
    },
  }));

  const response = h.response({
    status: "success",
    data: formattedHistories,
  });

  return response;
};

module.exports = { postPredictHandler, getPredictHistoriesHandler };
