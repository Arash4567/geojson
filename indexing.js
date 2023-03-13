const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "changeme",
  },
});

function indexing() {
  const mapping = {
    properties: {
      geometry: {
        type: "geo_shape",
      },
    },
  };

  client.indices.create(
    {
      index: "my_index",
      body: {
        mappings: mapping,
      },
    },
    (err, resp, status) => {
      if (err) {
        console.error(err);
      } else {
        console.log(resp);
      }
    }
  );

  const geojson = JSON.parse(fs.readFileSync("./sample.geojson"));

  const body = [];

  geojson.features.forEach((feature) => {
    body.push({ index: { _index: "my_index" } });
    body.push(feature);
    console.log("| " + feature?.properties?.name + " | indexing...");
  });

  client.bulk({ body }, (err, resp, status) => {
    if (err) {
      console.error(err);
    } else {
      console.log(resp);
    }
  });
}

/* if indexing geojson */
indexing()
