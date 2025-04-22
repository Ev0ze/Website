// Policy Tool functionality
let log = (txt) => {
    console.log(txt);
    document.getElementById("log").innerText += txt + "\n";
}

let extract = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
        let netlog = e.target.result;
        let split_netlog = netlog.split("\n");
        let policyNets = [];
        
        // Clear previous results
        const logElement = document.getElementById("log");
        logElement.innerText = "";
        
        // Remove existing network rows except header
        const table = document.getElementById("output-networks");
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        
        // Find the line where the policy was returned
        for (let i = 0; i < split_netlog.length; i++) {
            if (split_netlog[i].includes("ya0NvbmZpZ3VyYXRpb2") || 
                split_netlog[i].includes("vcmtDb25maWd1cmF0aW") || 
                split_netlog[i].includes("rQ29uZmlndXJhdGlvbn") || 
                split_netlog[i].includes("Db25maWd1cmF0aW9ucw")) {
                log("Found policy data at line: " + i);
                policyNets.push(split_netlog[i]);
            }
        }
        
        if (policyNets.length === 0) {
            log("No policy network data found in the file. Please make sure you followed the instructions correctly.");
            return;
        }
        
        policyNets.forEach(policyNet => {
            try {
                policyNet = atob(policyNet.substring(
                    (policyNet.indexOf('"bytes":"') + 9), 
                    (policyNet.indexOf('"},"phase"'))
                ));
                log("Decoded policy data: " + policyNet.substring(0, 100) + "...");
                
                let NetworkConfigurations = policyNet.substring(
                    policyNet.indexOf('"NetworkConfigurations":'), 
                    policyNet.indexOf("]\n}b")
                ) + "]";
                
                NetworkConfigurations = NetworkConfigurations.substring(
                    0, 
                    NetworkConfigurations.search(/}\n *]/)
                );
                
                NetworkConfigurations = NetworkConfigurations.replace(
                    /("NetworkConfigurations":|\n)/g, ""
                ) + "}]";
                
                log("Extracted network configurations");
                
                // Using Function instead of eval for better security
                NetworkConfigurations = Function('"use strict";return (' + NetworkConfigurations + ')')();
                
                let networksFound = 0;
                
                for (let wifi in NetworkConfigurations) {
                    if (NetworkConfigurations[wifi]["Type"] != "WiFi") continue; // Skip non WiFi networks
                    
                    networksFound++;
                    log("Processing WiFi network: " + NetworkConfigurations[wifi]["WiFi"]["SSID"]);
                    
                    let tr = document.createElement("tr");
                    
                    let SSID = document.createElement("td");
                    SSID.innerText = NetworkConfigurations[wifi]["WiFi"]["SSID"];
                    
                    let Passphrase = document.createElement("td");
                    if (NetworkConfigurations[wifi]["WiFi"]["Passphrase"]) {
                        Passphrase.innerText = NetworkConfigurations[wifi]["WiFi"]["Passphrase"];
                    } else if (
                        NetworkConfigurations[wifi]["WiFi"]["Security"] == "WPA-EAP" && 
                        NetworkConfigurations[wifi]["WiFi"]["EAP"] && 
                        NetworkConfigurations[wifi]["WiFi"]["EAP"]["Password"]
                    ) {
                        Passphrase.innerText = "Identity: " + 
                            NetworkConfigurations[wifi]["WiFi"]["EAP"]["Identity"] + 
                            "\nPassword: " + 
                            NetworkConfigurations[wifi]["WiFi"]["EAP"]["Password"];
                    } else {
                        Passphrase.innerText = "NOT FOUND";
                    }
                    
                    let Security = document.createElement("td");
                    Security.innerText = NetworkConfigurations[wifi]["WiFi"]["Security"];
                    
                    let HiddenSSID = document.createElement("td");
                    HiddenSSID.innerText = NetworkConfigurations[wifi]["WiFi"]["HiddenSSID"];
                    
                    tr.appendChild(SSID);
                    tr.appendChild(Passphrase);
                    tr.appendChild(Security);
                    tr.appendChild(HiddenSSID);
                    
                    document.getElementById("output-networks").appendChild(tr);
                }
                
                if (networksFound === 0) {
                    log("No WiFi networks found in the policy data.");
                } else {
                    log("Successfully extracted " + networksFound + " WiFi network(s).");
                }
                
            } catch (err) {
                log("Error processing data: " + err.message);
                console.error(err);
            }
        });
    };
    
    reader.onerror = (err) => {
        log("Error reading file: " + err);
    };
}

// Initialize the tool when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("export").addEventListener("change", extract);
});
