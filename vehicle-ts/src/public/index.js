$(document).ready(function () {

    let bucketCount = 0;

    // Function to update the vehicle information
    function updateVehicle(device) {
        if (!device) {
            $("#vehicle_section").html("<p>No vehicle data available</p>");
            return;
        }

        let engine_on_pic = "engine_transparent.gif";
        let engine_off_pic = "engine_off.png";
        let alert_on_pic = "alert_icon_red.png";
        let alert_off_pic = "alert_icon_gray.png";
        let alert_on_tooltip = "Your battery is not okay";
        let alert_off_tooltip = "";

        let vehicle_default_pic = "new_car.png";
        let vehicle_spoiler_pic = "car_spoiler.png";

        const componentsCount = device.components ? device.components.length : 0;
        let vehicle_pic = componentsCount > 0 ? vehicle_spoiler_pic : vehicle_default_pic;
        let engine_pic = device.isOn ? engine_on_pic : engine_off_pic;
        let engine_status_tag = device.isOn ? "Engine on" : "Engine off";

        let battery = device.battery || {};
        let alert_pic = battery.status === "NOK" ? alert_on_pic : alert_off_pic;
        let alert_tooltip = battery.status === "NOK" ? alert_on_tooltip : alert_off_tooltip;

        const content = `
            <div id="vehicle_section">
                <h1>${device.name}</h1>
                <hr class="my-4">
                <img id="vehicle_image" src="${vehicle_pic}" alt="Image of vehicle">
                <p id="voltage">Voltage: ${battery.voltage || 'N/A'}</p>
                <p id="current">Current: ${battery.current || 'N/A'}</p>
                <p id="ison">${engine_status_tag}</p>
                <img id="engine_image" src="${engine_pic}" alt="Engine GIF" />
                <p id="vin">${device._id}</p>
                <div class="alert_section">
                    <img id="alert_image" src="${alert_pic}" alt="Alert Icon" />
                    <h3 id="alert_tooltip">${alert_tooltip}</h3>
                </div>
            </div>`;
        $("#vehicle_section").html(content);

        updateComponent(device);
        updateComands(device);
        updateMeasurements(device);
        updateTelemetrySliders(device)
    }

    // Function to update the number of components
    function updateComponent(device) {
        const componentsCount = device.components ? device.components.length : 0;
        $("#number_components").html(`Components: <strong>${componentsCount}</strong>`);
    }

    // Function to process new commands
    let processingCommands = false
    function updateComands(device){
        let skipUpdate = true;
        for (const command of device.commands) {
            if(command.status !== 'completed'){
                // if there is at least one commands that needs to be processed we do not skip this process
                skipUpdate = false
                break;
            }
        }
        if(skipUpdate || processingCommands === true)
            return
        processingCommands = true
        console.log('updateComands', device.commands)
        $.ajax({
            url: `${window.location.origin}/process_commands`,
            type: "POST",
            data: { commands: device.commands },
            success: (result) => {
                console.log(result.message);
                updateMeasurements();
                processingCommands = false

            },
            error: (error) => { 
                console.error(`${error}`);
                processingCommands = false
            }
        });
    }

    // Function to update the measurements bucket
    function updateMeasurements() {
        $("#measurements").html(`Bucket: ${bucketCount}/20`);

        if (bucketCount === 0) {
            $("#reset_message").show();
            setTimeout(() => {
                $("#reset_message").hide();
            }, 2000);
        }
    }

    // Function to update the telemetry values
    function updateTelemetrySliders(device){
        $("#battery_voltage").val(device.battery.voltage)
        $("#battery_voltage_current_value_label").text(device.battery.voltage);
        $("#battery_current").val(device.battery.current)
        $("#battery_current_value_label").text(device.battery.current);
    }

    // Function to add sensor. It is the "Track Telemetry button"
    function onAddSensor() {
        const voltage = $("#battery_voltage").val();
        const current = $("#battery_current").val();
    
        bucketCount++;
        if (bucketCount > 20) {
            bucketCount = 0;
        }
    
        $.ajax({
            url: `${window.location.origin}/add_sensor`,
            type: "POST",
            data: { voltage, current },
            success: (result) => {
                console.log(JSON.stringify(result));
                updateMeasurements();
            },
            error: (error) => {
                console.error(`${error}`);
            }
        });
    }

    // Initial vehicle data fetch
    $.ajax({
        url: `${window.location.origin}/vehicle`,
        type: "GET",
        success: (result) => {
            try {
                const vehicle = result;
                console.log('init vehicle data, ', vehicle)
                updateVehicle(vehicle);
            } catch (error) {
                console.error('Error parsing vehicle data:', error);
            }
        },
        error: (error) => {
            console.error('Error fetching initial vehicle data:', error);
        }
    });

    // Server-Sent Events (SSE) for real-time updates
    const eventSource = new EventSource(`/subscribe`);
    eventSource.onmessage = function (event) {
        try {
            console.log("onmessage", event)
            const vehicleData = JSON.parse(event.data);  
            updateVehicle(vehicleData);
        } catch (error) {
            console.error('Error parsing JSON:', error, 'Received data:', event.data);
        }
    };

    eventSource.onerror = function (error) {
        console.error('SSE error:', error);
    };

    // Add component button click event
    $("#add_component").click(function () {
        $.ajax({
            url: `${window.location.origin}/add_component`,
            type: "POST",
            data: { name: $("#component_name").val() },
            success: (result) => {
                console.log(result.message);
                updateMeasurements();
                // Update vehicle components if necessary
                const vehicle = result.vehicle;
                updateComponent(vehicle);
            },
            error: (error) => { console.error(`${error}`) }
        });
    });

    // Track telemetry button click event
    $("#add_sensor").click(onAddSensor);

    // Reset battery button click event
    $("#reset_battery").click(function () {
        $.ajax({
            url: `${window.location.origin}/reset`,
            type: "GET",
            success: (result) => {
                console.log("Battery reset successful.");
                $.ajax({
                    url: `${window.location.origin}/vehicle`,
                    type: "GET",
                    success: (result) => {
                        try {
                            const vehicle = result;
                            updateVehicle(vehicle);
                        } catch (error) {
                            console.error('Error parsing vehicle data:', error);
                        }
                    },
                    error: (error) => {
                        console.error('Error fetching updated vehicle data:', error);
                    }
                });
            },
            error: (error) => {
                console.error('Error resetting battery:', error);
            }
        });
    });

    // trigger the battery update on the on change event of the input
    $("#battery_current").change(function (e){
        $("#battery_current_value_label").text(e.target.value);
        onAddSensor();
    })

    // trigger the voltage update only on the label when slide input changes
    $("#battery_voltage").change(function (e){
        $("#battery_voltage_current_value_label").text(e.target.value);
        onAddSensor();
    })

    // Trigger to toggle the sync status
    $("#sync_toggle").change(function (e){
        const startSync = e.target.checked
        $.ajax({
            url: `${window.location.origin}/${startSync ? 'start_sync' : 'stop_sync'}`,
            type: "POST",
            data: {},
            success: (result) => {
                console.log(JSON.stringify(result));
            },
            error: (error) => {
                console.error(`${error}`);
                alert('Oops, something went wrong, please try again.')
                $("#sync_toggle").prop('checked', !startSync)
            }
        });
    })
});
