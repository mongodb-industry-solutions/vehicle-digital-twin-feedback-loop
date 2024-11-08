/*
This Stream Procesor is in charge of listening to changes inside the battery, isOn, components and commands of the vehicle.
It compares the new values of those attributes and if any change was registered we update those values from our Vehicle document.
*/

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

let p = {
    $project: {
        _id: {
          $toObjectId: "$change.oldValue._id"
        },
        battery: {
            $cond: {
              if: {
                $ne: [
                  "$change.newValue.battery",
                  "$change.oldValue.battery"
                ]
              },
              then: "$change.newValue.battery",
              else: "$$REMOVE"
            }
        },
        isOn: {
            $cond: {
              if: {
                $ne: [
                  "$change.newValue.isOn",
                  "$change.oldValue.isOn"
                ]
              },
              then: "$change.newValue.isOn",
              else: "$$REMOVE"
            }
        },
        components: {
          $cond: {
            if: {
              $ne: [
                "$change.newValue.components",
                "$change.oldValue.components"
              ]
            },
            then: "$change.newValue.components",
            else: "$$REMOVE"
          }
        },
        commands: {
          $cond: {
            if: {
              $ne: [
                "$change.newValue.commands",
                "$change.oldValue.commands"
              ]
            },
            then: "$change.newValue.commands",
            else: "$$REMOVE"
          }
        },
      }
}

let m = {
    $merge: {
      into: {
          connectionName: "mongodb_feedback_loop",
          db: "Vehicles",
          coll: "Vehicle"
      },
      whenMatched: "merge",
      whenNotMatched: "discard"
    }
}

sp.createStreamProcessor("dittoVehicle", [s, p, m])