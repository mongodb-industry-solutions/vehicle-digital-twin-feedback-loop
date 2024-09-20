let s = {
    $source: {
      connectionName: "ditto_feedback_loop",
      topic: "user-consumable-34b0642b-0b00-4bd2-97ed-8b3afd3c3c9b",
      timeField: {
          $dateFromString: {
            dateString: '$cdcTimestamp'
          }
      },
      config: {
        auto_offset_reset: "earliest",
        group_id: "user-consumable-34b0642b-0b00-4bd2-97ed-8b3afd3c3c9b",
      },
    }
}

let mt = { 
    $match: {
        $and: [
          { "change.newValue.vin": { $exists: true } },
          { "change.newValue.measurements": { $exists: true } },
          { "change.newValue.type": { $exists: true } },
        ],
      }
}

let p = {
    $project: {
        _id: {
            $toObjectId: {
              $concat: [
                {
                  $toString: {
                    $add: [
                      1000000000000000,
                      { $toLong: "$_ts" },
                    ],
                  },
                },
                "00000000",
              ],
            },
          },
        vin: "$change.newValue.vin",
        type: "$change.newValue.type",
        measurements: "$change.newValue.measurements"
      }
}

let m = {
    $merge: {
      into: {
          connectionName: "mongodb_feedback_loop",
          db: "Vehicles",
          coll: "Sensor"
      },
      whenMatched: "keepExisting",
      whenNotMatched: "insert"
    }
}

sp.createStreamProcessor("dittoSensor", [s, mt, p, m])