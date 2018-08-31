import uuidv4 from "uuid/v4";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "trickl",
    Item: {
      id: event.requestContext.identity.cognitoIdentityId,
      thoughtRoot: uuidv4(),
      createdAt: Date.now(),
      // settings: data.settings,
    },
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false, message: e }));
  }
}

export async function get(event, context, callback) {
  const params = {
    TableName: "trickl",
    Key: {
      id: event.requestContext.identity.cognitoIdentityId,
    },
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      callback(null, success(result.Item));
    } else {
      callback(null, failure({ status: false, error: "Item not found." }));
    }
  } catch (e) {
    callback(null, failure({ status: false, message: e }));
  }
}
